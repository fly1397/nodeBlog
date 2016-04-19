var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

// models
require('./user');
require('./topic');
require('./post');
require('./reply');
require('./topic_collect');
require('./post_collect');
require('./message');

exports.User = mongoose.model('User');
exports.Topic = mongoose.model('Topic');
exports.Post = mongoose.model('Post');
exports.Reply = mongoose.model('Reply');
exports.TopicCollect = mongoose.model('TopicCollect');
exports.PostCollect = mongoose.model('PostCollect');
exports.Message = mongoose.model('Message');
