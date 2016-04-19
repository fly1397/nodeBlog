var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config');
var _ = require('lodash');

var PostSchema = new Schema({
    title: { type: String },
    content: { type: String },
    author_id: { type: ObjectId },
    top: { type: Boolean, default: false }, // 置顶帖
    good: {type: Boolean, default: false}, // 精华帖
    reply_count: { type: Number, default: 0 },
    visit_count: { type: Number, default: 0 },
    collect_count: { type: Number, default: 0 },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    last_reply: { type: ObjectId },
    last_reply_at: { type: Date, default: Date.now },
    tab: {type: String},
    content_is_html: { type: Boolean }
});

PostSchema.index({create_at: -1});
PostSchema.index({top: -1, last_reply_at: -1});
PostSchema.index({last_reply_at: -1});
PostSchema.index({author_id: 1, create_at: -1});


mongoose.model('Post', PostSchema);
