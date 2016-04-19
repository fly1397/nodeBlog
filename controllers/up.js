var config = require('../config');
var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var TopicCollect = require('../proxy').TopicCollect;


exports.like = function (req, res, next) {
    var topic_id = req.body.topic_id;
    var userId = req.session.user._id;
    Topic.getTopicById(topic_id,function(err,topic){
        if (err) {
            return next(err);
        }
        if (topic.author_id.equals(userId) && !config.debug) {
            // 不能帮自己点赞
            res.send({
                status: false,
                message: '呵呵，不能给自己点哦。'
            });
        }else{
            topic.dislike = topic.dislike || [];
            topic.like = topic.like || [];
            var upIndex = topic.dislike.indexOf(userId) < 0?topic.like.indexOf(userId):topic.dislike.indexOf(userId);
            if (upIndex === -1) {
                topic.like.push(userId);
                topic.save(function () {
                    res.send({
                        status: true,
                        message:"成功！",
                        like:topic.like.length,
                        dislike:topic.dislike.length
                    });
                });
            } else {
                res.send({
                    status: false,
                    message:"只能表态一次！"
                });
            }


        }

    });
};

exports.dislike = function (req, res, next) {
    var topic_id = req.body.topic_id;
    var userId = req.session.user._id;
    Topic.getTopicById(topic_id,function(err,topic){
        if (err) {
            return next(err);
        }
        if (topic.author_id.equals(userId) && !config.debug) {
            // 不能帮自己点赞
            res.send({
                status: false,
                message: '呵呵，不能给自己点哦。'
            });
        }else{
            topic.dislike = topic.dislike || [];
            topic.like = topic.like || [];
            var upIndex = topic.dislike.indexOf(userId) < 0?topic.like.indexOf(userId):topic.dislike.indexOf(userId);
            if (upIndex === -1) {
                topic.dislike.push(userId);
                topic.save(function () {
                    res.send({
                        status: true,
                        message:"成功！",
                        like:topic.like.length,
                        dislike:topic.dislike.length
                    });
                });
            } else {
                res.send({
                    status: false,
                    message:"只能表态一次！"
                });
            }


        }

    });
};


