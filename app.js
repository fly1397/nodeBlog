var config = require('./config');
var fs = require('fs');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');
var webRouter = require('./web_router');
var MongoStore = require('connect-mongo')(session);
var auth = require('./middlewares/auth');
var busboy = require('connect-busboy');
var ueditor = require("./controllers/ueditor");
// 静态文件目录s
var staticDir = path.join(__dirname, 'public');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));



app.use(require('cookie-parser')(config.session_secret));
app.use(session({
    secret: config.session_secret,
    store: new MongoStore({
        url: config.db
    }),
    resave: true,
    saveUninitialized: true
}));

// custom middleware
app.use(auth.authUser);
app.use(auth.blockUser());

app.use(express.static(path.join(__dirname, 'public')));
_.extend(app.locals, {
    config: config
});
_.extend(app.locals, require('./common/render_helper'));
app.use(function (req, res, next) {
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



// routes
/*
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    var userId = req.session.user._id;
    if (req.query.action === 'uploadimage') {
        //var foo = req.ueditor;
        var date = new Date();
        //var imgname = req.ueditor.filename;

        //var img_url = "/uploads/"+userId+"/files/";
        //res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做


    }
    //  客户端发起涂鸦请求
    else if (req.query.action === 'uploadscrawl') {
        var time = new Date();
        var dataBuffer = new Buffer(req.body.upfile, 'base64');
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
        });
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = "/uploads/"+userId+"/files/";
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
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
}));
*/
app.use(busboy({
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
}));
app.use('/', webRouter);


app.listen(process.env.PORT || 1337, null);
//app.listen(config.port, function() {
//    console.log('Express server listening on port ' + config.port);});
module.exports = app;
