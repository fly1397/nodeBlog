var store = require('../common/store');
var snowflake = require('node-snowflake').Snowflake;
var config = require('../config');
exports.upload = function (req, res, next) {
    var userId = req.session.user._id;
    if (req.query.action === 'uploadimage') {
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            store.upload(file, {key: 'files/'+userId+'/'+snowflake.nextId()}, function (err, result) {
                if (err) {
                    console.log(err);
                    return false;
                }
                res.json({
                    'url':result.url,
                    'title': filename,
                    'original': filename,
                    'state': 'SUCCESS'
                });
            });
        });

        req.pipe(req.busboy);
        //var foo = req.ueditor;
        //var date = new Date();
        //var imgname = req.ueditor.filename;

        //var img_url = "/uploads/"+userId+"/files/";
        //res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做


    }
    //  客户端发起涂鸦请求
    else if (req.query.action === 'uploadscrawl') {
        var dataBuffer = new Buffer(req.body.upfile, 'base64');
        var imgid = snowflake.nextId();
        store.upload(dataBuffer, {key: 'files/'+userId+'/'+imgid}, function (err, result) {
            if (err) {
                console.log(err);
                return false;
            }
            res.json({
                'url':result.url,
                name: imgid+".png",
                original: imgid+".png",
                'state': 'SUCCESS'
            });
        });
        /*var time = new Date();
        fs.writeFile("public/uploads/"+userId+"/files/scrawl_"+time.getTime()+".png", dataBuffer, function(err) {
            if(err){
                console.log(err);
            }else{
                res.send({
                    name: "scrawl_"+time.getTime()+".png",
                    original: "scrawl_"+time.getTime()+".png",
                    size: "99697",
                    state: "SUCCESS",
                    type: ".png",
                    url: "/uploads/"+userId+"/files/scrawl_"+time.getTime()+".png"
                })
            }
        });*/
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = "/files/"+userId+"/";
        //res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
        var str = '';
        var i = 0;
        var list = [];
        store.list(dir_url, function (err, result) {
            if (err) {
                console.log(err);
                return false;
            }
            var files = result.items;
            var total = files.length;
            files.forEach(function(file) {
                var temp = {};
                var domain = config.qn_access.domain;
                if (domain[domain.length - 1] !== '/') {
                    domain += '/';
                }
                temp.url = domain+file.key;
                list[i] = temp;
                i++;
                // send file name string when all files was processed
                if (i === total) {
                    res.json({
                        "state": "SUCCESS",
                        "list": list,
                        "start": 1,
                        "total": total
                    });
                }
            });


        });
    }
    //  客户端发起视频上传请求
    else if (req.query.action === 'uploadvideo') {
        res.send('{status: false,message: "不允许上传视频"}');
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
    /*
    var ratio = req.body.r;
    var imgData = req.body;
    if(ratio){
        res.send({
            success: true,
            url: 'http://'+imgData.os+'?imageMogr2/thumbnail/445x445/crop/!'+imgData.w+'x'+imgData.x+'a'+imgData.w+'a'+imgData.y
        });
    }else{
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            store.upload(file, {filename: filename}, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.json({
                    success: true,
                    url: result.url
                });
            });
        });

        req.pipe(req.busboy);
    }*/

};