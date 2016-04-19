var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var http = require('http');
var validator = require('validator');

exports.meinv = function (req, res, next) {
    var url = 'http://www.sodao.com/app/showtime/girl';
    var ress = res;
    var referer = req.get('referer');
    var id = req.query.id;
    var pg = req.query.pg;
    if(id){
        url = 'http://i.sodao.com/'+id+'/show.html';
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
//        console.log("body:", body);
                var $ = cheerio.load(body);
                $('.btns').remove();
                var show = $('#main-b .col-main').html();
                ress.render('meinv_d', {
                    show: show,
                    referer:referer
                });
                //console.log(show)

            }
        })
    }else{
        if(pg){
            url = 'http://www.sodao.com/app/showtime/girl?pg='+pg
        }
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
//        console.log("body:", body);
                var $ = cheerio.load(body);
                var li = $('li', '.mmlist_warp');
                var page_a =$(".try_cutPage a");
                page_a.each(function(){
                    var href = $(this).attr("href");
                    if(!href) return;
                    var newHref = href.match(/\?pg=\d*/g);
                    $(this).attr('href', newHref);
                });
                var page  = $(".try_cutPage").html();
                //console.log("li.length:", li.length);
                var arr = [];
                li.each(function (index, ele) {
                    var text = $('.user_name_state span a',this).text();
                    text = validator.trim(text);
                    var src = $('.user_photo img', this).attr('src');
                    var href = $('.user_name_state a', this).attr('href');
                    if(href){
                        var hrefs = href+"";
                        var newHref = hrefs.replace("http://i.sodao.com/","");
                        href = "?id="+newHref;
                    }
                    //console.log("href:", href);
                    var obj = {
                        src: src,
                        href: href,
                        text: text
                    };
                    arr.push(obj);
//            console.log("src:", src);
//            console.log("text:", text);
                });
                ress.render('meinv', {
                    meinvs: arr,
                    page: page
                });
                //console.log("arr:", arr);

            }
        })
    }
};
function readRemoteFile (url, cb) {
    var callback = function () {
        // 回调函数，避免重复调用
        callback = function () {};
        cb.apply(null, arguments);
    };

    var req = http.get(url, function (res) {
        var b = [];
        res.on('data', function (c) {
            b.push(c);
        });
        res.on('end', function () {
            callback(null, Buffer.concat(b));
        });
        res.on('error', callback);
    });
    req.on('error', callback);
}
exports.douban = function(req, res, next){
    var ress = res;
    var referer = req.get('referer');
    var pg = req.query.pg;
    var url = "http://www.douban.com/photos/album/43697061/";
    var img = req.query.img;
    var Bimg = req.query.Bimg;
    if(img){
        var img_url = "http://img3.douban.com/view/photo/thumb/public/"+img;
        request(img_url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                readRemoteFile(img_url, function(error, file) {
                    if(error) {
                    } else {
                        ress.writeHead(200, {"Content-Type": "image/png"});
                        ress.write(file, "binary");
                        ress.end();
                    }
                });
                /*ress.render('douban', {
                    img:img
                });*/

            }
        })
    }else if(Bimg){
        var Bimg_url = "http://img3.douban.com/view/photo/photo/public/"+Bimg;
        request(Bimg_url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                readRemoteFile(Bimg_url, function(error, file) {
                    if(error) {
                    } else {
                        ress.writeHead(200, {"Content-Type": "image/png"});
                        ress.write(file, "binary");
                        ress.end();
                    }
                });
                /*ress.render('douban', {
                 img:img
                 });*/

            }
        })
    }else{
        if(pg){
            url = 'http://www.douban.com/photos/album/43697061/?start='+pg
        }
        request({url:url,headers:{'User-Agent': 'request'}}, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                var $ = cheerio.load(body);
                var li = $('.photo_wrap', '.photolst');
                $(".paginator link").remove();
                var page_a =$(".paginator a");
                page_a.each(function(){
                    var href = $(this).attr("href");
                    if(!href) return;
                    var newHref = href.match(/=\d*/g);
                    $(this).attr('href', '?pg'+newHref);
                });
                var page  = $(".paginator").html();
                //console.log("li.length:", li.length);
                var arr = [];
                li.each(function (index, ele) {
                    var text = $('.pl',this).text();
                    text = validator.trim(text);
                    var src = $('.photolst_photo img', this).attr('src');
                    var href = $('.photolst_photo', this).attr('href');
                    var srcs;
                    srcs = src+"";
                    var newSrc = srcs.replace(/http.*\//g,"");
                    //console.log("href:", href);
                    var obj = {
                        src: "?img="+newSrc,
                        href: "?Bimg="+newSrc,
                        text: text
                    };
                    arr.push(obj);
//            console.log("src:", src);
//            console.log("text:", text);
                });
                ress.render('douban', {
                    douban: arr,
                    page: page
                });
                /*ress.render('douban', {
                    douban:JSON.parse(body)
                });*/
                //console.log("arr:", arr);

            }
        })
    }
};

exports.tmall = function(req,res,next){
    var ress = res;
    var referer = req.get('referer');
    var url = "http://detail.tmall.com/item.htm?spm=a220o.1000855.w5003-6391513116.4.MqZRAM&id=37193835175";

    request({url:url,headers:{'User-Agent': 'request'}}, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var thumb = $('#J_UlThumb img');

            var bodys  = $("body").html();
            var d_url = bodys.match(/http:\/\/dsc.taobaocdn.com\/.*(?=","fetchDcUrl\b)/g);
            //console.log("li.length:", li.length);
            var arr = [];
            thumb.each(function (index, ele) {
                var src = $(this).attr('src');
                var srcs;
                srcs = src+"";
                var newSrc = srcs.replace(/_60x60q90.jpg/g,"");

                var obj ={
                    src : newSrc
                };
                arr.push(obj);
            });

            /*if(d_url){
                request(d_url, function (error, res, body) {
                    if (!error && res.statusCode == 200) {


                    }
                })
            }*/

            ress.render('tmall', {
                thumb: arr,
                detail: d_url
            });

        }
    })
};