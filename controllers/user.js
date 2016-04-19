var User = require('../proxy').User;
var utility = require('utility');
var util = require('util');
var Topic = require('../proxy').Topic;
var Post = require('../proxy').Post;
var Reply = require('../proxy').Reply;
var TopicModel = require('../models').Topic;
var ReplyModel = require('../models').Reply;
var tools = require('../common/tools');
var config = require('../config');
var EventProxy = require('eventproxy');
var validator = require('validator');
var TopicCollect = require('../proxy').TopicCollect;
var PostCollect = require('../proxy').PostCollect;
var crypto = require('crypto');
var formidable = require('formidable');
var images = require('images');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var store = require('../common/store');

exports.index = function (req, res, next) {
    var user_name = req.params.name;
    var referer = req.get('referer');
    User.getUserByLoginName(user_name, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.render('notify/notify', {error: '这个用户不存在。', referer: referer});
            return;
        }
        var render = function (recent_topics,recent_shares, recent_replies,recent_replies_post) {
            user.friendly_create_at = tools.formatDate(user.create_at, true);
            user.url = (function () {
                if (user.url && user.url.indexOf('http') !== 0) {
                    return 'http://' + user.url;
                }
                return user.url;
            })();
            // 如果用户没有激活，那么管理员可以帮忙激活
            var token = '';
            if (!user.active && req.session.user && req.session.user.is_admin) {
                token = utility.md5(user.email + user.pass + config.session_secret);
            }
            res.render('user/index', {
                user: user,
                recent_topics: recent_topics,
                recent_shares: recent_shares,
                recent_replies: recent_replies,
                recent_replies_post: recent_replies_post,
                token: token,
                pageTitle: util.format('@%s 的个人主页', user.loginname),
            });
        };

        var proxy = new EventProxy();
        proxy.assign('recent_topics','recent_shares', 'recent_replies','recent_replies_post', render);
        proxy.fail(next);

        var query = {author_id: user._id};
        var opt = {limit: 5, sort: '-create_at'};
        Topic.getTopicsByQuery(query, opt, proxy.done('recent_topics'));
        Post.getPostsByQuery(query, opt, proxy.done('recent_shares'));

        Reply.getRepliesByAuthorId(user._id, {limit: 20, sort: '-create_at'},
            proxy.done(function (replies) {
                var topic_ids = [];
                for (var i = 0; i < replies.length; i++) {
                    if (topic_ids.indexOf(replies[i].topic_id.toString()) < 0) {
                        topic_ids.push(replies[i].topic_id.toString());
                    }
                }
                var query = {_id: {'$in': topic_ids}};
                var opt = {limit: 5, sort: '-create_at'};
                Topic.getTopicsByQuery(query, opt, proxy.done('recent_replies'));
                Post.getPostsByQuery(query, opt, proxy.done('recent_replies_post'));
            }));
    });
};

exports.avatarUpload = function(req, res) {
    var ep = new EventProxy();
    var userId = req.session.user._id;
    var ratio = req.body.r;
    var imgData = req.body;
    if(ratio){

        var url = imgData.url+'?imageMogr2/thumbnail/445x445>/crop/!'+imgData.w+'x'+imgData.h+'a'+imgData.x+'a'+imgData.y;
        User.getUserById(req.session.user._id, ep.done(function (user) {

            user.avatar_small = url;
            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                req.session.user = user.toObject({virtual: true});
                res.json({
                    success: true,
                    url: url
                });
            });
        }));
    }else{
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log(filename,file);
            store.delete('avatar/'+userId+'/'+filename, function (err) {

            });

            store.upload(file, {key: 'avatar/'+userId+'/'+filename}, function (err, result) {
                if (err) {
                    console.log(err);
                    return false;
                }
                User.getUserById(req.session.user._id, ep.done(function (user) {

                    user.avatar = result.url;
                    user.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        req.session.user = user.toObject({virtual: true});
                        res.json({
                            success: true,
                            url: result.url
                        });
                    });
                }));

            });
        });

        req.pipe(req.busboy);
    }
    /*var ep = new EventProxy();
    var referer = req.get('referer');
    //ep.fail(next);
    var userId = req.session.user._id;
    var ratio = req.body.r;
    var imgData = req.body;


    var mkFN  = tools.mkdirsSync('public/uploads/'+userId+'/avatar');
    if(!mkFN){
       return res.send('{status: false,message: "出错啦，请重新上传试试！"}');
    }

    if(ratio){
        var img = images("public/uploads/"+userId+"/avatar/"+userId+".jpg");
        images(img, imgData.x*ratio, imgData.y*ratio, imgData.w*ratio, imgData.h*ratio)
            .resize(config.avatar.size,config.avatar.size)                          //等比缩放图像到100像素宽
            //.draw(images("logo.png"), 10, 10)   //在(10,10)处绘制Logo
            .save("public/uploads/"+userId+"/avatar/"+userId+"_small.jpg", {               //保存图片到文件,图片质量为50
                                                                      //quality : 50
            });
        res.send({
            status: true,
            avatar: userId+"_small.jpg"
        });
    }else{
        var form = new formidable.IncomingForm();
        form.uploadDir='public/uploads/'+userId+"/avatar";
        form.parse(req, function(error, fields, files){
            //var imgData = JSON.parse(fields.file_data);
            if(!/image\/\w+/.test(files.avatar_file.type)){
                res.send('{status: false,message: "请选择图片"}');
            }else if(files.avatar_file.size > 800*1024){
                res.send('{status: false,message: "图片大于1M"}');
            }else{
                if(files.avatar_file.name){
                    //console.log(images(files.avatar_file.path).encode("png"));
                    fs.renameSync(files.avatar_file.path, "public/uploads/"+userId+"/avatar/"+userId+".jpg");
                    var avatar_B= "/uploads/"+userId+"/avatar/"+userId+".jpg";

                    User.getUserById(req.session.user._id, ep.done(function (user) {

                        user.avatar = avatar_B;
                        user.save(function (err) {
                            if (err) {
                                return next(err);
                            }
                            req.session.user = user.toObject({virtual: true});
                            res.send('{success: true,url: "/uploads/'+userId+'/avatar/'+userId+'.jpg"}');
                        });
                    }));

                }
            }
            // 删除缓存文件
            //fs.unlink(files.avatar_file.path);

        });
    }*/


};

exports.show_stars = function (req, res, next) {
    User.getUsersByQuery({is_star: true}, {}, function (err, stars) {
        if (err) {
            return next(err);
        }
        res.render('user/stars', {stars: stars});
    });
};

exports.showSetting = function (req, res, next) {
    User.getUserById(req.session.user._id, function (err, user) {
        if (err) {
            return next(err);
        }
        if (req.query.save === 'success') {
            user.success = '保存成功。';
        }
        user.error = null;
        //user.accessTokenBase64 = qrcode(user.accessToken);
        return res.render('user/setting', user);
    });
};

exports.setting = function (req, res, next) {
    var ep = new EventProxy();
    ep.fail(next);

    // 显示出错或成功信息
    function showMessage(msg, data, isSuccess) {
        data = data || req.body;
        var data2 = {
            name: data.name,
            email: data.email,
            url: data.url,
            location: data.location,
            signature: data.signature,
            weibo: data.weibo,
            accessToken: data.accessToken
            //,accessTokenBase64: qrcode(data.accessToken)
        };
        if (isSuccess) {
            data2.success = msg;
        } else {
            data2.error = msg;
        }
        res.render('user/setting', data2);
    }

    // post
    var action = req.body.action;
    if (action === 'change_setting') {
        var name = validator.trim(req.body.name);
        var url = validator.trim(req.body.url);
        url = validator.escape(url);
        var location = validator.trim(req.body.location);
        location = validator.escape(location);
        var weibo = validator.trim(req.body.weibo);
        weibo = validator.escape(weibo);
        var signature = validator.trim(req.body.signature);
        signature = validator.escape(signature);


        User.getUserById(req.session.user._id, ep.done(function (user) {
            if (!tools.validateName(name)) {
                //return ep.emit('prop_err', '用户名不合法。');
                return showMessage('昵称不合法，至少需要4个字符,中文一个字占2位。。', user);
            }
            user.name = name;
            user.url = url;
            user.location = location;
            user.signature = signature;
            user.weibo = weibo;
            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                req.session.user = user.toObject({virtual: true});
                return res.redirect('/setting?save=success');
            });
        }));
    }
    if (action === 'change_password') {
        var old_pass = validator.trim(req.body.old_pass);
        var new_pass = validator.trim(req.body.new_pass);
        if (!old_pass || !new_pass) {
            return res.send('旧密码或新密码不得为空');
        }

        User.getUserById(req.session.user._id, ep.done(function (user) {
            var md5 = crypto.createHash('md5'),
                password = md5.update(old_pass).digest('hex');
            var Npassword = crypto.createHash('md5').update(new_pass).digest('hex');
            var passhash = user.pass;
            if(passhash != password){
                return showMessage('当前密码不正确。', user);
            }
            user.pass = Npassword;
            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                return showMessage('密码已被修改。', user, true);

            });
            /*tools.bcompare(old_pass, user.pass, ep.done(function (bool) {
                if (!bool) {
                    return showMessage('当前密码不正确。', user);
                }

                tools.bhash(new_pass, ep.done(function (passhash) {
                    user.pass = passhash;
                    user.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        return showMessage('密码已被修改。', user, true);

                    });
                }));
            }));*/
        }));
    }
};

exports.toggle_star = function (req, res, next) {
    var user_id = req.body.user_id;
    User.getUserById(user_id, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('user is not exists'));
        }
        user.is_star = !user.is_star;
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            res.json({ status: 'success' });
        });
    });
};

exports.get_collect_topics = function (req, res, next) {
    var name = req.params.name;
    User.getUserByLoginName(name, function (err, user) {
        if (err || !user) {
            return next(err);
        }

        var page = Number(req.query.page) || 1;
        var limit = config.list_topic_count/2;

        var render = function (topics,shares, pages) {
            var alls = [];
            for(var m = 0 ;m<topics.length;m++){
                alls.push(topics[m]);
            }
            for(var n = 0 ;n<shares.length;n++){
                alls.push(shares[n]);
            }


            res.render('user/collect_topics', {
                topics: alls,
                current_page: page,
                pages: pages,
                user: user
            });
        };

        var proxy = EventProxy.create('topics','shares', 'pages', render);
        proxy.fail(next);

        TopicCollect.getTopicCollectsByUserId(user._id, proxy.done(function (docs) {
            var ids = [];
            for (var i = 0; i < docs.length; i++) {
                ids.push(docs[i].topic_id);
            }
            var query = { _id: { '$in': ids } };
            var opt = {
                skip: (page - 1) * limit,
                limit: limit,
                sort: '-create_at'
            };
            Topic.getTopicsByQuery(query, opt, proxy.done('topics'));
            Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
                var pages = Math.ceil(all_topics_count / limit);
                proxy.emit('pages', pages);
            }));
        }));

        PostCollect.getTopicCollectsByUserId(user._id, proxy.done(function (docs) {
            var ids = [];
            for (var i = 0; i < docs.length; i++) {
                ids.push(docs[i].topic_id);
            }
            var query = { _id: { '$in': ids } };
            var opt = {
                skip: (page - 1) * limit,
                limit: limit,
                sort: '-create_at'
            };
            Post.getPostsByQuery(query, opt, proxy.done('shares'));
            Post.getCountByQuery(query, proxy.done(function (all_topics_count) {
                var pages = Math.ceil(all_topics_count / limit);
                proxy.emit('pages', pages);
            }));
        }));
    });
};
exports.get_collect_shares = function (req, res, next) {
    var name = req.params.name;
    User.getUserByLoginName(name, function (err, user) {
        if (err || !user) {
            return next(err);
        }

        var page = Number(req.query.page) || 1;
        var limit = config.list_topic_count;

        var render = function (topics, pages) {
            res.render('user/collect_topics', {
                topics: topics,
                current_page: page,
                pages: pages,
                user: user
            });
        };

        var proxy = EventProxy.create('topics', 'pages', render);
        proxy.fail(next);

        PostCollect.getTopicCollectsByUserId(user._id, proxy.done(function (docs) {
            var ids = [];
            for (var i = 0; i < docs.length; i++) {
                ids.push(docs[i].topic_id);
            }
            var query = { _id: { '$in': ids } };
            var opt = {
                skip: (page - 1) * limit,
                limit: limit,
                sort: '-create_at'
            };
            Post.getPostsByQuery(query, opt, proxy.done('topics'));
            Post.getCountByQuery(query, proxy.done(function (all_topics_count) {
                var pages = Math.ceil(all_topics_count / limit);
                proxy.emit('pages', pages);
            }));
        }));
    });
};

exports.top100 = function (req, res, next) {
    var opt = {limit: 100, sort: '-score'};
    User.getUsersByQuery({'$or': [
        {is_block: {'$exists': false}},
        {is_block: false},
    ]}, opt, function (err, tops) {
        if (err) {
            return next(err);
        }
        res.render('user/top100', {
            users: tops,
            pageTitle: 'top100',
        });
    });
};

exports.list_topics = function (req, res, next) {
    var user_name = req.params.name;
    var referer = req.get('referer');
    var page = Number(req.query.page) || 1;
    var limit = config.list_topic_count;

    User.getUserByLoginName(user_name, function (err, user) {
        if (!user) {
            res.render('notify/notify', {error: '这个用户不存在。', referer: referer});
            return;
        }

        var render = function (topics, pages) {
            user.friendly_create_at = tools.formatDate(user.create_at, true);
            res.render('user/topics', {
                user: user,
                topics: topics,
                current_page: page,
                pages: pages
            });
        };

        var proxy = new EventProxy();
        proxy.assign('topics', 'pages', render);
        proxy.fail(next);

        var query = {'author_id': user._id};
        var opt = {skip: (page - 1) * limit, limit: limit, sort: '-create_at'};
        Topic.getTopicsByQuery(query, opt, proxy.done('topics'));

        Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
            var pages = Math.ceil(all_topics_count / limit);
            proxy.emit('pages', pages);
        }));
    });
};
exports.list_shares = function (req, res, next) {
    var user_name = req.params.name;
    var referer = req.get('referer');
    var page = Number(req.query.page) || 1;
    var limit = config.list_topic_count;

    User.getUserByLoginName(user_name, function (err, user) {
        if (!user) {
            res.render('notify/notify', {error: '这个用户不存在。',referer:referer});
            return;
        }

        var render = function (shares, pages) {
            user.friendly_create_at = tools.formatDate(user.create_at, true);
            res.render('user/topics', {
                user: user,
                shares: shares,
                current_page: page,
                pages: pages
            });
        };

        var proxy = new EventProxy();
        proxy.assign('shares', 'pages', render);
        proxy.fail(next);

        var query = {'author_id': user._id};
        var opt = {skip: (page - 1) * limit, limit: limit, sort: '-create_at'};
        Post.getPostsByQuery(query, opt, proxy.done('shares'));

        Post.getCountByQuery(query, proxy.done(function (all_topics_count) {
            var pages = Math.ceil(all_topics_count / limit);
            proxy.emit('pages', pages);
        }));
    });
};
exports.list_replies = function (req, res, next) {
    var user_name = req.params.name;
    var referer = req.get('referer');
    var page = Number(req.query.page) || 1;
    var limit = 50;

    User.getUserByLoginName(user_name, function (err, user) {
        if (!user) {
            res.render('notify/notify', {error: '这个用户不存在。',referer:referer});
            return;
        }

        var render = function (topics, pages) {
            user.friendly_create_at = tools.formatDate(user.create_at, true);
            res.render('user/replies', {
                user: user,
                topics: topics,
                current_page: page,
                pages: pages
            });
        };

        var proxy = new EventProxy();
        proxy.assign('topics', 'pages', render);
        proxy.fail(next);

        var opt = {skip: (page - 1) * limit, limit: limit, sort: '-create_at'};
        Reply.getRepliesByAuthorId(user._id, opt, proxy.done(function (replies) {
            // 获取所有有评论的主题
            var topic_ids = replies.map(function (reply) {
                return reply.topic_id;
            });
            topic_ids = _.uniq(topic_ids);
            var query = {'_id': {'$in': topic_ids}};
            Topic.getTopicsByQuery(query, {}, proxy.done('topics'));

        }));

        Reply.getCountByAuthorId(user._id, proxy.done('pages', function (count) {
            var pages = Math.ceil(count / limit);
            return pages;
        }));
    });
};
exports.list_share_replies = function (req, res, next) {
    var user_name = req.params.name;
    var referer = req.get('referer');
    var page = Number(req.query.page) || 1;
    var limit = 50;

    User.getUserByLoginName(user_name, function (err, user) {
        if (!user) {
            res.render('notify/notify', {error: '这个用户不存在。',referer:referer});
            return;
        }

        var render = function (shares, pages) {
            user.friendly_create_at = tools.formatDate(user.create_at, true);
            res.render('user/replies', {
                user: user,
                topics: shares,
                current_page: page,
                pages: pages
            });
        };

        var proxy = new EventProxy();
        proxy.assign('shares', 'pages', render);
        proxy.fail(next);

        var opt = {skip: (page - 1) * limit, limit: limit, sort: '-create_at'};
        Reply.getRepliesByAuthorId(user._id, opt, proxy.done(function (replies) {
            // 获取所有有评论的主题

            var topic_ids = replies.map(function (reply) {
                return reply.topic_id;
            });
            topic_ids = _.uniq(topic_ids);
            var query = {'_id': {'$in': topic_ids}};
            Post.getPostsByQuery(query, {}, proxy.done('shares'));

        }));

        Reply.getCountByAuthorId(user._id, proxy.done('pages', function (count) {
            var pages = Math.ceil(count / limit);
            return pages;
        }));
    });
};

exports.block = function (req, res, next) {
    var loginname = req.params.name;
    var action = req.body.action;

    var ep = EventProxy.create();
    ep.fail(next);

    User.getUserByLoginName(loginname, ep.done(function (user) {
        if (!user) {
            return next(new Error('user is not exists'));
        }
        if (action === 'set_block') {
            ep.all('block_user',
                function (user) {
                    res.json({status: 'success'});
                });
            user.is_block = true;
            user.save(ep.done('block_user'));

        } else if (action === 'cancel_block') {
            user.is_block = false;
            user.save(ep.done(function () {

                res.json({status: 'success'});
            }));
        }
    }));
};

exports.deleteAll = function (req, res, next) {
    var loginname = req.params.name;

    var ep = EventProxy.create();
    ep.fail(next);

    User.getUserByLoginName(loginname, ep.done(function (user) {
        if (!user) {
            return next(new Error('user is not exists'));
        }
        ep.all('del_topics', 'del_replys', 'del_ups',
            function () {
                res.json({status: 'success'});
            });
        TopicModel.remove({author_id: user._id}, ep.done('del_topics'));
        ReplyModel.remove({author_id: user._id}, ep.done('del_replys'));
        // 点赞数也全部干掉
        ReplyModel.update({}, {$pull: {'ups': user._id}}, {multi: true}, ep.done('del_ups'));
    }));
};
