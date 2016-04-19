var _ = require('lodash');
var config = require('../config');

exports.escapeSignature = function (signature) {
    return signature.split('\n').map(function (p) {
        return _.escape(p);
    }).join('<br>');
};
exports.tabName = function (tab) {
    var pair = _.find(config.tabs, function (pair) {
        return pair[0] === tab;
    });
    if (pair) {
        return pair[1];
    }
};
exports.staticFile = function (filePath) {
    return config.site_static_host + filePath;
};

exports._ = _;