/**
 * config
 */

var path = require('path');
var config = {
    name: 'NODEMO', // 网站名字
    description: '这是一个神奇的网站', // 网站描述
    keywords: '网站关键词',

    // 添加到 html head 中的信息
    site_headers: [
        '<meta name="author" content="Mr.Fly" />'
    ],
    //头像设置
    avatar:{
        default_path:"/images/noavatar_default.png", //默认头像
        size:50 //大小(px) 高宽一致
    },
    site_logo: '', // default is `name`
    site_icon: '', // 默认没有 favicon, 这里填写网址
    // 右上角的导航区
    site_navs: [
        // 格式 [ path, title, [target=''] ]
        [ '/help', '解惑' ],
        [ '/story', '故事' ],
        [ '/photo', '图片' ],
        [ '/stars', '达人' ]
    ],
    //求原谅版块
    tabs: [
        ['forgiveme', '求原谅'],
        ['beggingme', '来跪着']
    ],
    //文章版块
    post_tabs: [
        ['help', '解惑'],
        ['story', '故事'],
        ['photo', '图片']
    ],

    // cdn host，如 http://cnodejs.qiniudn.com
    site_static_host: '', // 静态文件存储域名
    // 社区的域名
    host: 'localhost',
    // 程序运行的端口
    port: 1337,
    // 话题列表显示的话题数量
    list_topic_count: 10,
    // 限制发帖时间间隔，单位：毫秒
    post_interval: 2000,
    // mongodb 配置mongodb://username:password@ip:port/dbName
    //db: 'mongodb://34T0YT71:wl18Su1BHc5j@10.0.31.58:27017/007316-76168965_mong_uc16sh68',
    //db_name: '007316-76168965_mong_uc16sh68',
    db: 'mongodb://127.0.0.1/nodemo',
    db_name: 'nodemo',
    session_secret:"node_demo",
    auth_cookie_name: 'nodemo_cookie',
    // 是否允许直接注册（否则只能走 其他的方式）
    allow_sign_up: true,
    //用户默认已经激活
    active:true,

    // RSS配置
    rss: {
        title: 'demo',
        link: 'http://qiuyuanliang.com',
        language: 'zh-cn',
        description: 'demo',
        //最多获取的RSS Item数量
        max_rss_items: 50
    },

    // 邮箱配置
    mail_opts: {
        host: 'smtp.qq.com',
        port: 465,
        secureConnection: true,
        requiresAuth: true,
        domains: ["qq.com"],
        auth: {
            user: '*****@qq.com',
            pass: '*****'
        }
    },

    // admin 可删除，编辑，设某人为达人  user_login_name(用户名): true
    admins: { admin: true },
    //7牛的access信息，用于文件上传
    qn_access: {
        accessKey: 'rXDz0v9_kV_hyDwBq7Hb1SeWgHkqf70Z2L2mfAIi',
        secretKey: 'G0o356IrGobSW45NigCohNxvrca3O-1X0d3u-JXl',
        bucket: 'qiuyuanliang',
        domain: 'http://7viifz.com1.z0.glb.clouddn.com'
    },
    //文件上传配置
    //注：如果填写 qn_access，则会上传到 7牛，以下配置无效
    upload: {
        path: path.join(__dirname, 'public/upload/'),
        url: '/public/upload/'
    }

};
module.exports = config;
