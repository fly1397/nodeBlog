//var bcrypt = require('bcrypt');
var moment = require('moment');
moment.locale('zh-cn'); // 使用中文
var fs = require('fs');
var path = require('path');
// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};

exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.validateName = function (str) {
    return (/^[a-zA-Z0-9-_\u4e00-\u9fa5]+$/g).test(str);
};
/*exports.bhash = function (str, callback) {
    bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
    bcrypt.compare(str, hash, callback);
};*/

// 创建所有目录
//创建多层文件夹 同步

exports.mkdirsSync = function(dirpath, mode) {
    if(!mode) mode = "0777";
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split("/").forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
};