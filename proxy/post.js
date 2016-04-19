var EventProxy = require('eventproxy');

var models = require('../models');
var Post = models.Post;
var User = require('./user');
var Reply = require('./reply');
var tools = require('../common/tools');
var at = require('../common/at');
var _ = require('lodash');

/**
 * 根据主题ID获取主题
 * Callback:
 * - err, 数据库错误
 * - topic, 主题
 * - author, 作者
 * - lastReply, 最后回复
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
exports.getPostById = function (id, callback) {
    var proxy = new EventProxy();
    var events = ['post', 'author', 'last_reply'];
    proxy.assign(events, function (post, author, last_reply) {
        if (!author) {
            return callback(null, null, null, null);
        }
        return callback(null, post, author, last_reply);
    }).fail(callback);

    Post.findOne({_id: id}, proxy.done(function (post) {
        if (!post) {
            proxy.emit('post', null);
            proxy.emit('author', null);
            proxy.emit('last_reply', null);
            return;
        }
        proxy.emit('post', post);
        User.getUserById(post.author_id, proxy.done('author'));

        if (post.last_reply) {
            Reply.getReplyById(post.last_reply, proxy.done(function (last_reply) {
                proxy.emit('last_reply', last_reply);
            }));
        } else {
            proxy.emit('last_reply', null);
        }
    }));
};

/**
 * 获取关键词能搜索到的主题数量
 * Callback:
 * - err, 数据库错误
 * - count, 主题数量
 * @param {String} query 搜索关键词
 * @param {Function} callback 回调函数
 */
exports.getCountByQuery = function (query, callback) {
    Post.count(query, callback);
};

/**
 * 根据关键词，获取主题列表
 * Callback:
 * - err, 数据库错误
 * - count, 主题列表
 * @param {String} query 搜索关键词
 * @param {Object} opt 搜索选项
 * @param {Function} callback 回调函数
 */
exports.getPostsByQuery = function (query, opt, callback) {
    Post.find(query, '_id', opt, function (err, docs) {
        if (err) {
            return callback(err);
        }
        if (docs.length === 0) {
            return callback(null, []);
        }

        var posts_id = _.pluck(docs, 'id');

        var proxy = new EventProxy();
        proxy.after('post_ready', posts_id.length, function (posts) {
            // 过滤掉空值
            var filtered = posts.filter(function (item) {
                return !!item;
            });
            return callback(null, filtered);
        });
        proxy.fail(callback);

        posts_id.forEach(function (id, i) {
            exports.getPostById(id, proxy.group('post_ready', function (post, author, last_reply) {
                // 当id查询出来之后，进一步查询列表时，文章可能已经被删除了
                // 所以这里有可能是null
                if (post) {
                    var tn = post.content.match(/<img.*src=[\"](.*?)[\"].*?>/gi);
                    if(tn){
                        tn = tn[0]
                    }else{
                        tn=""
                    }
                    post.thumb = tn;
                    post.author = author;
                    post.reply = last_reply;
                    post.friendly_create_at = tools.formatDate(post.create_at, true);
                }
                return post;
            }));
        });
    });
};

// for sitemap

exports.getLimit5w = function (callback) {
    Post.find({}, '_id', {limit: 50000, sort: '-create_at'}, callback);
};

/**
 * 获取所有信息的主题
 * Callback:
 * - err, 数据库异常
 * - message, 消息
 * - topic, 主题
 * - author, 主题作者
 * - replies, 主题的回复
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */

exports.getFullPost = function (id, callback) {
    var proxy = new EventProxy();
    var events = ['post', 'author', 'replies'];
    proxy
        .assign(events, function (post, author, replies) {
            callback(null, '', post, author, replies);
        })
        .fail(callback);

    Post.findOne({_id: id}, proxy.done(function (post) {
        if (!post) {
            proxy.unbind();
            return callback(null, '此话题不存在或已被删除。');
        }
        at.linkUsers(post.content, proxy.done('post', function (str) {
            post.linkedContent = str;
            return post;
        }));

        User.getUserById(post.author_id, proxy.done(function (author) {
            if (!author) {
                proxy.unbind();
                return callback(null, '话题的作者丢了。');
            }
            proxy.emit('author', author);
        }));
        Reply.getRepliesByTopicId(post._id, proxy.done('replies'));
    }));
};

/**
 * 更新主题的最后回复信息
 * @param {String} postId 主题ID
 * @param {String} replyId 回复ID
 * @param {Function} callback 回调函数
 */

exports.updateLastReply = function (postId, replyId, callback) {
    Post.findOne({_id: postId}, function (err, post) {
        if (err || !post) {
            return callback(err);
        }
        post.last_reply = replyId;
        post.last_reply_at = new Date();
        post.reply_count += 1;
        post.save(callback);
    });
};

/**
 * 根据主题ID，查找一条主题
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */

exports.getPost = function (id, callback) {
    Post.findOne({_id: id}, callback);
};

/**
 * 将当前主题的回复计数减1，删除回复时用到
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
/*
exports.reduceCount = function (id, callback) {
    Topic.findOne({_id: id}, function (err, topic) {
        if (err) {
            return callback(err);
        }

        if (!topic) {
            return callback(new Error('该主题不存在'));
        }

        topic.reply_count -= 1;
        topic.save(callback);
    });
};
*/
exports.newAndSave = function (title, content, authorId,tab, callback) {
    var post = new Post();
    post.title = title;
    post.content = content;
    post.author_id = authorId;
    post.tab = tab;
    post.save(callback);
};
