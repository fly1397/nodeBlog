var express = require('express');
var site = require('./controllers/site');
var postIndex = require('./controllers/postIndex');
var sign = require('./controllers/sign');
var user = require('./controllers/user');
var auth = require('./middlewares/auth');
var topic = require('./controllers/topic');
var post = require('./controllers/post');
var reply = require('./controllers/reply');
var limit = require('./middlewares/limit');
var message = require('./controllers/message');
var upload = require('./controllers/upload');
var search = require('./controllers/search');
var up = require('./controllers/up');
var config = require('./config');
var ueditor = require('./controllers/ueditor');

var reptile = require('./controllers/reptile');



var router = express.Router();

// home page
router.get('/', site.index);

// sitemap
router.get('/sitemap.xml', site.sitemap);

// sign controller
if (config.allow_sign_up) {
    router.get('/signup', sign.showSignup);  // 跳转到注册页面
    router.post('/signup', sign.signup);  // 提交注册信息
} else {
    //router.get('/signup', configMiddleware.github, passport.authenticate('github'));  // 进行github验证
}
router.post('/signout', sign.signout);  // 登出
router.get('/signin', sign.showLogin);  // 进入登录页面
router.post('/signin', sign.login);  // 登录校验
router.get('/active_account', sign.active_account);  //帐号激活

router.get('/search_pass', sign.showSearchPass);  // 找回密码页面
router.post('/search_pass', sign.updateSearchPass);  // 更新密码
router.get('/reset_pass', sign.reset_pass);  // 进入重置密码页面
router.post('/reset_pass', sign.update_pass);  // 更新密码

//Editor



// user controller
router.get('/user/:name', user.index); // 用户个人主页
router.get('/setting', auth.userRequired, user.showSetting); // 用户个人设置页
router.post('/setting', auth.userRequired, user.setting); // 提交个人信息设置
router.post('/upload/avatar', auth.userRequired, user.avatarUpload); // 头像上传
router.get('/stars', user.show_stars); // 显示所有达人列表页
router.get('/users/top100', user.top100);  // 显示积分前一百用户页
router.get('/user/:name/collections', user.get_collect_topics);  // 用户收藏的所有话题页
router.get('/user/:name/share/collections', user.get_collect_shares);  // 用户收藏的所有分享页
router.get('/user/:name/forgive', user.list_topics);  // 用户发布的所有话题页
router.get('/user/:name/share', user.list_shares);  // 用户发布的所有分享页
router.get('/user/:name/forgive/replies', user.list_replies);  // 用户参与话题的所有回复页
router.get('/user/:name/share/replies', user.list_share_replies);  // 用户参与分享的所有回复页

router.post('/user/set_star', auth.adminRequired, user.toggle_star); // 把某用户设为达人
router.post('/user/cancel_star', auth.adminRequired, user.toggle_star);  // 取消某用户的达人身份
router.post('/user/:name/block', auth.adminRequired, user.block);  // 禁言某用户
router.post('/user/:name/delete_all', auth.adminRequired, user.deleteAll);  // 删除某用户所有发言

// message controler
router.get('/my/messages', auth.userRequired, message.index); // 用户个人的所有消息页
// 新建文章界面
router.get('/forgive/create', auth.userRequired, topic.create);
router.get('/forgive/:tid', topic.index);  // 显示某个话题
//router.get('/forgive/:title', topic.index2);  // 显示某个话题
router.post('/forgive/:tid/top/:is_top?', auth.adminRequired, topic.top);  // 将某话题置顶
router.post('/forgive/:tid/good/:is_good?', auth.adminRequired, topic.good); // 将某话题加精
router.get('/forgive/:tid/edit', auth.userRequired, topic.showEdit);  // 编辑某话题

router.post('/forgive/:tid/delete', auth.userRequired, topic.delete);

router.post('/forgive/like', auth.userRequired, up.like); //支持
router.post('/forgive/dislike', auth.userRequired, up.dislike);//反对
// 保存新建的文章
router.post('/forgive/create', auth.userRequired, limit.postInterval, topic.put);

router.post('/forgive/:tid/edit', auth.userRequired, topic.update);
router.post('/forgive/collect', auth.userRequired, topic.collect); // 关注某话题
router.post('/forgive/de_collect', auth.userRequired, topic.de_collect); // 取消关注某话题

router.post('/share/collect', auth.userRequired, post.collect); // 关注某话题
router.post('/share/de_collect', auth.userRequired, post.de_collect); // 取消关注某话题


router.get('/story', postIndex.story_index);
router.get('/help', postIndex.help_index);
router.get('/photo', postIndex.photo_index);
// 新建普通文章界面
router.get('/post/create', auth.userRequired, post.create);
router.get('/post/:tid/edit', auth.userRequired, post.showEdit);  // 编辑某话题
router.get('/post/:tid', post.index);  // 显示某个话题
// 保存新建的文章
router.post('/post/create', auth.userRequired, limit.postInterval, post.put);
router.post('/post/:tid/edit', auth.userRequired, post.update);


// reply controller
router.post('/:topic_id/reply', auth.userRequired, limit.postInterval, reply.add); // 提交一级回复
router.post('/:topic_id/reply2', auth.userRequired, limit.postInterval, reply.add2); // 提交一级回复
router.get('/reply/:reply_id/edit', auth.userRequired, reply.showEdit); // 修改自己的评论页
router.post('/reply/:reply_id/edit', auth.userRequired, reply.update); // 修改某评论
router.post('/reply/:reply_id/delete', auth.userRequired, reply.delete); // 删除某评论
router.post('/reply/:reply_id/up', auth.userRequired, reply.up); // 为评论点赞


router.get('/ueditor/ue', auth.userRequired, upload.upload); //上传图片
router.post('/ueditor/ue', auth.userRequired, upload.upload); //上传图片

router.get('/meinv',reptile.meinv); //爬虫测试
router.get('/douban',reptile.douban); //爬虫测试2
router.get('/tmall',reptile.tmall); //爬虫测试3


router.get('/search', search.index);
module.exports = router;