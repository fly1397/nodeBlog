var mailer = require('nodemailer');
var config = require('../config');
var util = require('util');

var transport = mailer.createTransport('SMTP', config.mail_opts);
var SITE_ROOT_URL = 'http://' + config.host;

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {

  // 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
  transport.sendMail(data, function (err) {
    if (err) {
      // 写为日志
      console.log(err);
    }
  });
};
exports.sendMail = sendMail;

/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendActiveMail = function (who, token, name) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject = config.name + '社区帐号激活';
  var html = '<p>您好：' + name + '</p>' +
    '<p>我们收到您在' + config.name + '社区的注册信息，请点击下面的链接来激活帐户：</p>' +
    '<a href="' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name + '社区 谨上。</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * 发送邀请邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} inviter 注册人邮件
 * @param {String} name 注册人用户名
 */
exports.sendInviteMail = function (who, inviter, name) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject ="您的好友正在邀请你注册"+ config.name + '，赶快与TA一起加入吧！';
  var html = '<p>您好：' + who + '</p>' +
      '<p>您的好友'+name+'正在使用' + config.name + '社区，邀请您一同加入！，TA的邮箱是邮箱：'+inviter+' 。请点击下面的链接赶快加入我们吧！</p>' +
      '<a href="' + SITE_ROOT_URL + '/signup?inviter=' + name + '">点击注册</a>' +
      '<p>若您不愿意使用' + config.name + '社区，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
      '<p>' + config.name + '社区 谨上。</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * 发送目标通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} inviter 注册人邮件
 * @param {String} types 注册人用户名
 * @param  topic
 */
exports.sendPostMail = function (who, inviter, types,topic) {
  // 得到所有的 tab, e.g. ['ask', 'share', ..]
  var subject;
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  if(types=='forgiveme'){
    subject ='听说有个不开眼的人惹你生气了，别担心，TA已经在这里跪着了！';
  }else{
    subject ='听说你惹某人人生气了，还不快来求TA的原谅！';
  }
  var html = '<p>您好：' + who + '</p>' +
      '<p>听说有个不开眼的人惹你生气了，别担心，TA已经在这里跪着了！' +
      '因为你的不开心，TA是寝食难安，写下了大作<a href="' + SITE_ROOT_URL + '/forgive/' + topic._id + '" target="_blank">'+topic.title+'</a>，赶快来看看吧！</p>' +
      '<p>若您不愿意使用' + config.name + '社区，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
      '<p>' + config.name + '社区 谨上。</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * 发送密码重置通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendResetPassMail = function (who, token, name) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject = config.name+'社区密码重置';
  var html = '<p>您好：' + name + '</p>' +
    '<p>我们收到您在' + config.name + '社区重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
    '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">重置密码链接</a>' +
    '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.name + '社区 谨上。</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};
