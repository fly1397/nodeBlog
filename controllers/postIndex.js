var cache = require('../common/cache');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy').User;
var Post = require('../proxy').Post;
var renderHelper = require('../common/render_helper');

exports.story_index = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var tab = 'story';

    var proxy = new eventproxy();
    proxy.fail(next);

    // 取主题
    var query = {};
    if (tab && tab !== 'all') {
        if (tab === 'good') {
            query.good = true;
        } else {
            query.tab = tab;
        }
    }

    var limit = config.list_topic_count;
    var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};
    var optionsStr = JSON.stringify(query) + JSON.stringify(options);

    cache.get(optionsStr, proxy.done(function (topics) {
        if (topics) {
            return proxy.emit('topics', topics);
        }
        Post.getPostsByQuery(query, options, proxy.done('topics', function (topics) {
            return topics;
        }));
    }));
    // END 取主题
    // 取分页数据
    cache.get('pages', proxy.done(function (pages) {
        if (pages) {
            proxy.emit('pages', pages);
        } else {
            Post.getCountByQuery(query, proxy.done(function (all_topics_count) {
                var pages = Math.ceil(all_topics_count / limit);
                cache.set(JSON.stringify(query) + 'pages', pages, 1000 * 60 * 1);
                proxy.emit('pages', pages);
            }));
        }
    }));
    proxy.all('topics','pages',
        function (topics, pages) {
            res.render('story', {
                topics: topics,
                current_page: page,
                list_topic_count: limit,
                pages: pages,
                tabs: config.post_tabs,
                tab: tab
            });
        });
};

exports.help_index = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var tab = 'help';


    var proxy = new eventproxy();
    proxy.fail(next);

    // 取主题
    var query = {};
    if (tab && tab !== 'all') {
        if (tab === 'good') {
            query.good = true;
        } else {
            query.tab = tab;
        }
    }

    var limit = config.list_topic_count;
    var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};
    var optionsStr = JSON.stringify(query) + JSON.stringify(options);

    cache.get(optionsStr, proxy.done(function (topics) {
        if (topics) {
            return proxy.emit('topics', topics);
        }
        Post.getPostsByQuery(query, options, proxy.done('topics', function (topics) {
            return topics;
        }));
    }));
    // END 取主题
    // 取分页数据
    cache.get('pages', proxy.done(function (pages) {
        if (pages) {
            proxy.emit('pages', pages);
        } else {
            Post.getCountByQuery(query, proxy.done(function (all_topics_count) {
                var pages = Math.ceil(all_topics_count / limit);
                cache.set(JSON.stringify(query) + 'pages', pages, 1000 * 60 * 1);
                proxy.emit('pages', pages);
            }));
        }
    }));
    proxy.all('topics','pages',
        function (topics, pages) {
            res.render('story', {
                topics: topics,
                current_page: page,
                list_topic_count: limit,
                pages: pages,
                tabs: config.post_tabs,
                tab: tab
            });
        });
};

exports.photo_index = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var tab = 'photo';

    var proxy = new eventproxy();
    proxy.fail(next);

    // 取主题
    var query = {};
    if (tab && tab !== 'all') {
        if (tab === 'good') {
            query.good = true;
        } else {
            query.tab = tab;
        }
    }

    var limit = 20;
    var options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};
    var optionsStr = JSON.stringify(query) + JSON.stringify(options);

    cache.get(optionsStr, proxy.done(function (topics) {
        if (topics) {
            return proxy.emit('topics', topics);
        }
        Post.getPostsByQuery(query, options, proxy.done('topics', function (topics) {
            return topics;
        }));
    }));
    // END 取主题
    // 取分页数据
    cache.get('pages', proxy.done(function (pages) {
        if (pages) {
            proxy.emit('pages', pages);
        } else {
            Post.getCountByQuery(query, proxy.done(function (all_topics_count) {
                var pages = Math.ceil(all_topics_count / limit);
                cache.set(JSON.stringify(query) + 'pages', pages, 1000 * 60 * 1);
                proxy.emit('pages', pages);
            }));
        }
    }));
    proxy.all('topics','pages',
        function (topics, pages) {
            res.render('photo', {
                topics: topics,
                current_page: page,
                list_topic_count: limit,
                pages: pages,
                tabs: config.post_tabs,
                tab: tab
            });
        });
};