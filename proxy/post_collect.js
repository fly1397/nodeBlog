var PostCollect = require('../models').PostCollect;

exports.getTopicCollect = function (userId, topicId, callback) {
    PostCollect.findOne({user_id: userId, topic_id: topicId}, callback);
};

exports.getTopicCollectsByUserId = function (userId, callback) {
    PostCollect.find({user_id: userId}, callback);
};

exports.newAndSave = function (userId, topicId, callback) {
    var topic_collect = new PostCollect();
    topic_collect.user_id = userId;
    topic_collect.topic_id = topicId;
    topic_collect.save(callback);
};

exports.remove = function (userId, topicId, callback) {
    PostCollect.remove({user_id: userId, topic_id: topicId}, callback);
};

