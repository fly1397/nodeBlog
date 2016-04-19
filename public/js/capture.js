if (typeof Sina == "undefined") {
    Sina = {}
}
Sina.pkg = function (c) {
    if (!c || !c.length) {
        return null
    }
    var d = c.split(".");
    var b = Sina;
    for (var a = (d[0] == "Sina") ? 1 : 0; a < d.length; ++a) {
        b[d[a]] = b[d[a]] || {};
        b = b[d[a]]
    }
    return b
};
function $E(b) {
    var a = typeof b == "string" ? document.getElementById(b) : b;
    if (a != null) {
        return a
    }
    return null
}
function $C(a) {
    return document.createElement(a)
}
function $N(a) {
    return document.getElementsByName(a)
}
function $T(b, a) {
    return b.getElementsByTagName(a)
}
try {
    document.execCommand("BackgroundImageCache", false, true)
} catch (e) {
}
(function () {
    var b = function (f, d) {
        var c = f;
        return function () {
            return c.apply(d, arguments)
        }
    };
    var a = "Debug";
    if (window[a] == null || typeof window[a].log == "undefined") {
        window[a] = {
            cacheData: [],
            base_url: "http://sjs.sinajs.cn/bind2/",
            product: scope.$PRODUCT_NAME,
            baseColor: {
                1: {color: "#FFF", bgcolor: "#E00"},
                2: {color: "#F00"},
                3: {color: "#FFF000"},
                4: {color: "#0F0"},
                5: {color: "#FFF"}
            },
            fatal: function (c) {
                this.addData(c, 1)
            },
            error: function (c) {
                this.addData(c, 2)
            },
            warning: function (c) {
                this.addData(c, 3)
            },
            info: function (c) {
                this.addData(c, 4)
            },
            log: function (c) {
                this.addData(c, 5)
            },
            dir: function (c) {
                this.addData(c, 5)
            },
            addData: function (d, c, f, g) {
                if (d == null) {
                    return
                }
                if (typeof d != "object") {
                    d = d.toString()
                }
                var h = {type: c || "5", color: f || this.baseColor[c].color, bgcolor: g || this.baseColor[c].bgcolor};
                this.cacheData.push([d, h]);
                if (this.initFinished == true) {
                    this.showCurrentData([d, h])
                }
            }
        };
        window.trace = b(window[a].log, window[a]);
        window.traceError = b(window[a].error, window[a])
    }
})();
Sina.pkg("Core");
if (typeof Core == "undefined") {
    Core = Sina.Core
}
Sina.pkg("Core.Array");
Core.Array.foreach = function (d, c) {
    if (d == null && d.constructor != Array) {
        return []
    }
    var f = 0, b = d.length, g = [];
    while (f < b) {
        var a = c(d[f], f);
        if (a !== null) {
            g[g.length] = a
        }
        f++
    }
    return g
};
Sina.pkg("Core.Events");
(function (j) {
    var g = navigator.userAgent.toLowerCase();
    var a = {
        $winXP: /windows nt 5.1/.test(g),
        $winVista: /windows nt 6.0/.test(g),
        $win7: /windows nt 6.1/.test(g),
        $macOS: /mac/.test(g)
    };
    var c = {
        $OPERA: false,
        $IE6: false,
        $IE7: false,
        $IE8: false,
        $IE9: false,
        $SAFARI: false,
        $FF2: false,
        $FF3: false,
        $FF4: false,
        $FF: false,
        $CHROME: false,
        $TT: false,
        $360: false,
        $SOGO: false,
        $Maxthon: false
    };
    var h = {$IE: 0, $MOZ: false, $WEBKIT: false, $KHTML: false};
    if (/opera/.test(g) || j.opera) {
        c.$OPERA = true
    } else {
        if (/chrome\/(\S+)/.test(g)) {
            c.$CHROME = true
        } else {
            if (/safari\/(\S+)/.test(g)) {
                c.$SAFARI = true
            } else {
                if (/msie/.test(g)) {
                    h.$IE = true;
                    if (/360se/.test(g)) {
                        c.$360 = true
                    } else {
                        if (/tencenttraveler/.test(g)) {
                            c.$TT = true
                        } else {
                            if (/se\s\S+\smetasr\s\d+\.\d+/.test(g)) {
                                c.$SOGO = true
                            }
                        }
                    }
                    var b = g.match(/msie (\d+)/);
                    var f = parseInt(b[1]);
                    h.$IE = f;
                    if (f === 8) {
                        c.$IE8 = true
                    } else {
                        if (f === 6) {
                            c.$IE6 = true
                        } else {
                            if (f === 9) {
                                c.$IE9 = true
                            } else {
                                if (f === 7) {
                                    c.$IE7 = true
                                } else {
                                    if (f === 10) {
                                        c.$IE10 = true
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (/firefox/.test(g)) {
                        var b = g.match(/firefox\/(\d+)/);
                        c.$FF = parseInt(b[1]);
                        if (/firefox\/3/.test(g)) {
                            c.$FF3 = true
                        } else {
                            if (/firefox\/4/.test(g)) {
                                c.$FF4 = true
                            } else {
                                if (/firefox\/2/.test(g)) {
                                    c.$FF2 = true
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    try {
        var k = window.external;
        c.$Maxthon = k.max_version ? true : false
    } catch (d) {
    }
    if (/applewebkit\/(\S+)/.test(g)) {
        h.$WEBKIT = true
    } else {
        if (/khtml\/(\S+)/.test(g)) {
            h.$KHTML = true
        } else {
            if (/rv:([^\)]+)\) gecko\/\d{8}/.test(g)) {
                h.$MOZ = true
            }
        }
    }
    c.$MOBILE = /mobile/i.test(g);
    if (!c.$MOBILE) {
        c.$MOBILE = /HTC/.test(g)
    }
    function i(n, l) {
        var m;
        for (m in l) {
            n[m] = l[m]
        }
    }

    i(j, c);
    i(j, h);
    i(j, a)
})(window);
Core.Events.addEvent = function (g, d, c, a) {
    var f = typeof g == "string" ? $E(g) : g;
    if (f == null) {
        trace("addEvent 找不到对象：" + g);
        return
    }
    if (typeof a == "undefined") {
        a = false
    }
    if (typeof c == "undefined") {
        c = "click"
    }
    if (f.addEventListener) {
        if (c == "mousewheel" && $FF) {
            c = "DOMMouseScroll"
        }
        f.addEventListener(c, d, a);
        return true
    } else {
        if (f.attachEvent) {
            var b = f.attachEvent("on" + c, d);
            return true
        } else {
            f["on" + c] = d
        }
    }
};
Core.Events.removeEvent = function (a, b, c) {
    var d = $E(a);
    if (d == null) {
        trace("removeEvent 找不到对象：" + a);
        return
    }
    if (typeof b != "function") {
        return
    }
    if (typeof c == "undefined") {
        c = "click"
    }
    if (d.addEventListener) {
        d.removeEventListener(c, b, false)
    } else {
        if (d.attachEvent) {
            d.detachEvent("on" + c, b)
        }
    }
    b[c] = null
};
Sina.pkg("Core.Function");
Core.Function.bind3 = function (d, c, b) {
    b = b == null ? [] : b;
    var a = d;
    return function () {
        return a.apply(c, b)
    }
};
Core.Array.findit = function (a, c) {
    var b = -1;
    Core.Array.foreach(a, function (f, d) {
        if (c == f) {
            b = d
        }
    });
    return b
};
window.onerror = function (c, b, a) {
    trace("Error occured:" + c + "<br/>file:" + b + "<br/>line:" + a + "<br/>");
    return true
};
function Jobs(a) {
    this.option = a || {};
    this._jobTable = [[], [], [], []]
}
Jobs.prototype = {
    _registedJobTable: {}, errorMsg: [], _registJob: function (b, a) {
        this._registedJobTable[b] = a
    }, error: function (a) {
        Debug.error(a);
        this.errorMsg.push(a)
    }, add: function (b, a) {
        a = a || 1;
        if (Core.Array.findit(this._jobTable[a], b) == -1) {
            this._jobTable[a].push(b)
        } else {
            this.error("Error: Job <b>" + b + "</b> is existed now.")
        }
    }, start: function () {
        if (this.option.onStart != null) {
            this.option.onStart()
        }
        var c = this._registedJobTable;
        var a = this._jobTable[1].concat(this._jobTable[2]);
        var d = this;
        this.fe = Core.Function.bind3(d.focus, d, []);
        var b = function () {
            if (d._jobTable[3].length == 0) {
                if (d.option.onEnd != null) {
                    d.option.onEnd()
                }
                return
            }
            Core.Events.addEvent(document.body, d.fe, "focus");
            Core.Events.addEvent(window, d.fe, "scroll");
            Core.Events.addEvent(document.body, d.fe, "mousemove");
            Core.Events.addEvent(document.body, d.fe, "mouseover")
        };
        this.queue(a, b)
    }, focus: function () {
        var b = this;
        if (this.focusdown) {
            Core.Events.removeEvent(document.body, b.fe, "focus");
            Core.Events.removeEvent(window, b.fe, "scroll");
            Core.Events.removeEvent(document.body, b.fe, "mousemove");
            Core.Events.removeEvent(document.body, b.fe, "mouseover");
            b.fe = null;
            return
        }
        this.focusdown = true;
        var a = this._jobTable[3];
        this.queue(a, this.option.onEnd)
    }, queue: function (a, j) {
        var h = this;
        var b = function () {
            return new Date().valueOf()
        };
        var c = this._registedJobTable;
        var g = a.length;
        var f = 0;
        var d = window.setInterval(function () {
            if (f >= g) {
                clearInterval(d);
                d = null;
                if (j != null) {
                    j()
                }
                return
            }
            var o = a[f];
            var m = c[o];
            f++;
            if (typeof m == "undefined") {
                h.error("<b>Job[" + o + "] is undefiend!!!</b>");
                return
            }
            var l = true;
            var k = b();
            try {
                m.call()
            } catch (n) {
                h.error("<b>Job[" + o + "] failed!!!</b>" + n.message + "");
                if (j != null) {
                    j()
                }
                l = false;
                throw n
            } finally {
                if (l) {
                    var i = b();
                    Debug.info("<b>Job[" + o + "] done in " + (i - k) + "ms.</b>")
                }
            }
        }, 10)
    }, call: function (b, a) {
        if (typeof this._registedJobTable[b] != "undefined") {
            this._registedJobTable[b].apply(this, a)
        } else {
            trace("<b>Job[" + b + "] is undefined!!!</b>", {color: "#900", bgColor: "#FFF;"})
        }
    }
};
$registJob = function (b, a) {
    Jobs.prototype._registJob(b, a)
};
$callJob = function (b) {
    var a = [];
    if (arguments.length > 1) {
        Core.Array.foreach(arguments, function (c, d) {
            a[d] = c
        });
        a.shift()
    }
    Jobs.prototype.call(b, a)
};
if (typeof Xblog == "undefined") {
    Xblog = {}
}
Xblog.pkg = function (c) {
    if (!c || !c.length) {
        return null
    }
    var d = c.split(".");
    var b = Xblog;
    for (var a = (d[0] == "Xblog") ? 1 : 0; a < d.length; ++a) {
        b[d[a]] = b[d[a]] || {};
        b = b[d[a]]
    }
    return b
};
Xblog.pkg("Utils");
if (typeof Lib == "undefined") {
    Lib = {}
}
Lib.pkg = function (c) {
    if (!c || !c.length) {
        return null
    }
    var d = c.split(".");
    var b = Lib;
    for (var a = (d[0] == "Lib") ? 1 : 0; a < d.length; ++a) {
        b[d[a]] = b[d[a]] || {};
        b = b[d[a]]
    }
    return b
};
Sina.pkg("Utils");
if (typeof Utils == "undefined") {
    Utils = Sina.Utils
}
Sina.pkg("Utils.Cookie");
Utils.Cookie.getCookie = function (a) {
    a = a.replace(/([\.\[\]\$])/g, "\\$1");
    var c = new RegExp(a + "=([^;]*)?;", "i");
    var d = document.cookie + ";";
    var b = d.match(c);
    if (b) {
        return b[1] || ""
    } else {
        return ""
    }
};
Sina.pkg("Core.System");
Core.System.keyValue = function (b, c) {
    var a = b.match(new RegExp("(\\?|&)" + c + "=([^&]*)(&|$)"));
    if (a != null) {
        return a[2]
    }
    return null
};
Lib.checkAuthor = function () {
    var a = unescape(Utils.Cookie.getCookie("SUP"));
    if (a && a != "") {
        $UID = Core.System.keyValue(a, "uid");
        $nick = decodeURIComponent(Core.System.keyValue(a, "nick"));
        $isLogin = !!($UID);
        if (typeof scope.$uid == "undefined") {
            $isAdmin = false
        } else {
            $isAdmin = (scope.$uid == $UID)
        }
    } else {
        a = Utils.Cookie.getCookie("SU");
        if (a && a != "") {
            var b = a.match(/^([^:]*:){2}(\d{5,11})/);
            $UID = (b && b[2]) || null;
            window.$isLogin = !!($UID);
            if (typeof scope.$uid == "undefined") {
                window.$isAdmin = false
            } else {
                window.$isAdmin = (scope.$uid == $UID)
            }
        } else {
            $UID = null;
            $isLogin = false;
            $isAdmin = false
        }
    }
};
Sina.pkg("Utils.Io");
Sina.pkg("Core.String");
Utils.Url = function (a) {
    a = a || "";
    this.url = a;
    this.query = {};
    this.parse()
};
Utils.Url.prototype = {
    parse: function (a) {
        if (a) {
            this.url = a
        }
        this.parseAnchor();
        this.parseParam()
    }, parseAnchor: function () {
        var a = this.url.match(/\#(.*)/);
        a = a ? a[1] : null;
        this._anchor = a;
        if (a != null) {
            this.anchor = this.getNameValuePair(a);
            this.url = this.url.replace(/\#.*/, "")
        }
    }, parseParam: function () {
        var a = this.url.match(/\?([^\?]*)/);
        a = a ? a[1] : null;
        if (a != null) {
            this.url = this.url.replace(/\?([^\?]*)/, "");
            this.query = this.getNameValuePair(a)
        }
    }, getNameValuePair: function (b) {
        var a = {};
        b.replace(/([^&=]*)(?:\=([^&]*))?/gim, function (c, f, d) {
            if (f == "") {
                return
            }
            a[f] = d || ""
        });
        return a
    }, getParam: function (a) {
        return this.query[a] || ""
    }, clearParam: function () {
        this.query = {}
    }, setParam: function (a, b) {
        if (a == null || a == "" || typeof(a) != "string") {
            throw new Error("no param name set")
        }
        this.query = this.query || {};
        this.query[a] = b
    }, setParams: function (a) {
        this.query = a
    }, serialize: function (c) {
        var a = [];
        for (var b in c) {
            if (c[b] == null || c[b] == "") {
                a.push(b + "=")
            } else {
                a.push(b + "=" + c[b])
            }
        }
        return a.join("&")
    }, toString: function () {
        var a = this.serialize(this.query);
        return this.url + (a.length > 0 ? "?" + a : "") + (this.anchor ? "#" + this.serialize(this.anchor) : "")
    }, getHashStr: function (a) {
        return this.anchor ? "#" + this.serialize(this.anchor) : (a ? "#" : "")
    }
};
Core.String.encodeDoubleByte = function (a) {
    if (typeof a != "string") {
        return a
    }
    return encodeURIComponent(a)
};
Utils.Io.Ajax = {
    createRequest: function () {
        var c = null;
        try {
            c = new XMLHttpRequest()
        } catch (b) {
            try {
                c = new ActiveXObject("Msxml2.XMLHTTP")
            } catch (d) {
                try {
                    c = ActiveXObject("Microsoft.XMLHTTP")
                } catch (a) {
                }
            }
        }
        if (c == null) {
        } else {
            return c
        }
    }, request: function (a, b) {
        b = b || {};
        b.onComplete = b.onComplete || function () {
        };
        b.onException = b.onException || function () {
        };
        b.returnType = b.returnType || "txt";
        b.method = b.method || "get";
        b.data = b.data || {};
        if (typeof b.GET != "undefined" && typeof b.GET.url_random != "undefined" && b.GET.url_random == 0) {
            this.rand = false;
            b.GET.url_random = null
        }
        return this.loadData(a, b)
    }, loadData: function (url, option) {
        var request = this.createRequest(), tmpArr = [];
        var _url = new Utils.Url(url);
        if (option.POST) {
            for (var postkey in option.POST) {
                var postvalue = option.POST[postkey];
                if (postvalue != null) {
                    tmpArr.push(postkey + "=" + Core.String.encodeDoubleByte(postvalue))
                }
            }
        }
        var sParameter = tmpArr.join("&") || "";
        if (option.GET) {
            for (var key in option.GET) {
                if (key != "url_random") {
                    _url.setParam(key, Core.String.encodeDoubleByte(option.GET[key]))
                }
            }
        }
        if (this.rand != false) {
        }
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                var response, type = option.returnType;
                try {
                    switch (type) {
                        case"txt":
                            response = request.responseText;
                            break;
                        case"xml":
                            if ($IE) {
                                response = request.responseXML
                            } else {
                                var Dparser = new DOMParser();
                                response = Dparser.parseFromString(request.responseText, "text/xml")
                            }
                            break;
                        case"json":
                            response = eval("(" + request.responseText + ")");
                            break
                    }
                    option.onComplete(response)
                } catch (e) {
                    option.onException(e.message, _url);
                    return false
                }
            }
        };
        try {
            if (option.POST) {
                request.open("POST", _url, true);
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                request.send(sParameter)
            } else {
                request.open("GET", _url, true);
                request.send(null)
            }
        } catch (e) {
            option.onException(e.message, _url);
            return false
        }
        return request
    }
};
Xblog.Utils.checkUser = function (c, f) {
    var d = null;
    var g = $_GLOBAL.DOMAIN_CORE;
    var a = !!(c && c.success && typeof c.success === "function");
    var b = !!(c && c.fail && typeof c.fail === "function");
    Lib.checkAuthor();
    if (window.$isLogin) {
        Utils.Io.Ajax.request(g + "blog/api/usershow.php", {
            returnType: "json",
            GET: {uid: (window.$UID || 0), aid: (f || window.$UID || 0), checkattention: 1},
            onComplete: function (h) {
                if (h && h.code === "A00006") {
                    switch (h.data.isOpenQing) {
                        case 0:
                            d = 3;
                            break;
                        case 1:
                            d = 1;
                            break;
                        case -1:
                            d = 2;
                            break
                    }
                    if (a) {
                        c.success(d, h.data)
                    }
                } else {
                    if (b) {
                        c.fail()
                    }
                }
            },
            onException: function (h) {
                if (b) {
                    c.fail()
                }
            }
        })
    } else {
        d = 0;
        if (a) {
            c.success(d, {})
        }
    }
};
$registJob("checkUserOnce", function () {
    var c = 3;
    var a = function () {
        var f = arguments.callee;
        var d = scope.$uid || window.$UID;
        Xblog.Utils.checkUser({
            success: function (h, g) {
                window.scope.userState_checkUserOnce = h;
                window.scope.userInfo_relation = g
            }, fail: function () {
                c--;
                if (c) {
                    window.setTimeout(function () {
                        f()
                    }, 50)
                } else {
                    window.scope.userState_checkUserOnce = 0;
                    window.scope.userInfo_relation = {}
                }
            }
        }, d)
    };
    var b = window.scope;
    if (b && b.userState_checkUserOnce == null) {
        if (typeof b.$userStatus === "number") {
            b.userState_checkUserOnce = b.$userStatus
        } else {
            a()
        }
    }
});
Core.String.trimHead = function (a) {
    return a.replace(/^(\u3000|\s|\t)*/gi, "")
};
Core.String.trimTail = function (a) {
    return a.replace(/(\u3000|\s|\t)*$/gi, "")
};
Core.String.trim = function (a) {
    return Core.String.trimHead(Core.String.trimTail(a))
};
Lib.classUtils = function () {
};
Lib.classUtils.prototype.addClass = function (b, a) {
    if (!b) {
        return false
    }
    if (!this.hasClass(b, a)) {
        b.className = Core.String.trim(b.className.concat(" " + a))
    }
};
Lib.classUtils.prototype.delClass = function (c, b) {
    if (!c) {
        return false
    }
    var a = new RegExp("( +|^)" + b + "(?=( |$))", "ig");
    c.className = Core.String.trim(c.className.replace(a, ""))
};
Lib.classUtils.prototype.hasClass = function (c, b) {
    if (!c) {
        return false
    }
    var a = new RegExp("( +|^)" + b + "(?=( |$))", "ig");
    return a.test(c.className)
};
Sina.pkg("Core.Dom");
Core.Dom.getElementsByClass = function (c, b, h) {
    c = c || document;
    var d = [];
    h = " " + h + " ";
    var k = c.getElementsByTagName(b), g = k.length;
    for (var f = 0; f < g; ++f) {
        var a = k[f];
        if (a.nodeType == 1) {
            var j = " " + a.className + " ";
            if (j.indexOf(h) != -1) {
                d[d.length] = a
            }
        }
    }
    return d
};
Core.Dom.byClz = Core.Dom.getElementsByClass;
Core.Dom.getStyle = function (a, c) {
    switch (c) {
        case"opacity":
            var f = 100;
            try {
                f = a.filters["DXImageTransform.Microsoft.Alpha"].opacity
            } catch (d) {
                try {
                    f = a.filters("alpha").opacity
                } catch (d) {
                }
            }
            return f / 100;
        case"float":
            c = "styleFloat";
        default:
            var b = a.currentStyle ? a.currentStyle[c] : null;
            return (a.style[c] || b)
    }
};
if (!$IE || $IE > 8) {
    Core.Dom.getStyle = function (a, c) {
        if (c == "float") {
            c = "cssFloat"
        }
        try {
            var b = document.defaultView.getComputedStyle(a, "")
        } catch (d) {
            traceError(d)
        }
        return a.style[c] || b ? b[c] : null
    }
}
Core.System.getScrollPos = function (c) {
    c = c || document;
    var a = c.documentElement;
    var b = c.body;
    return [Math.max(a.scrollTop, b.scrollTop), Math.max(a.scrollLeft, b.scrollLeft), Math.max(a.scrollWidth, b.scrollWidth), Math.max(a.scrollHeight, b.scrollHeight)]
};
Core.Dom.getXY = function (b) {
    if ((b.parentNode == null || b.offsetParent == null || Core.Dom.getStyle(b, "display") == "none") && b != document.body) {
        return false
    }
    var a = null;
    var g = [];
    var c;
    var d = b.ownerDocument;
    c = b.getBoundingClientRect();
    var f = Core.System.getScrollPos(b.ownerDocument);
    return [c.left + f[1], c.top + f[0]];
    a = b.parentNode;
    while (a.tagName && !/^body|html$/i.test(a.tagName)) {
        if (Core.Dom.getStyle(a, "display").search(/^inline|table-row.*$/i)) {
            g[0] -= a.scrollLeft;
            g[1] -= a.scrollTop
        }
        a = a.parentNode
    }
    return g
};
if (!$IE) {
    Core.Dom.getXY = function (b) {
        if ((b.parentNode == null || b.offsetParent == null || Core.Dom.getStyle(b, "display") == "none") && b != document.body) {
            return false
        }
        var a = null;
        var g = [];
        var c;
        var d = b.ownerDocument;
        g = [b.offsetLeft, b.offsetTop];
        a = b.offsetParent;
        var f = Core.Dom.getStyle(b, "position") == "absolute";
        if (a != b) {
            while (a) {
                g[0] += a.offsetLeft;
                g[1] += a.offsetTop;
                if ($SAFARI && !f && Core.Dom.getStyle(a, "position") == "absolute") {
                    f = true
                }
                a = a.offsetParent
            }
        }
        if ($SAFARI && f) {
            g[0] -= b.ownerDocument.body.offsetLeft;
            g[1] -= b.ownerDocument.body.offsetTop
        }
        a = b.parentNode;
        while (a.tagName && !/^body|html$/i.test(a.tagName)) {
            if (Core.Dom.getStyle(a, "display").search(/^inline|table-row.*$/i)) {
                g[0] -= a.scrollLeft;
                g[1] -= a.scrollTop
            }
            a = a.parentNode
        }
        return g
    }
}
if (typeof Xblog === "undefined") {
    Xblog = {}
}
Xblog.captureImgs = function (c) {
    var d = c.picLimWidth || 100, h = c.picLimHeight || 100, f = c.createLayer || function () {
        };
    var m = [];
    var i;
    l();
    return a();
    function a(y, n, p) {
        var v = y || document;
        n = n || [], p = p || {};
        for (var q = 0; q < v.images.length; q++) {
            var r = v.images[q];
            if (j(r)) {
                if (r.src.indexOf("http") == -1) {
                    var t = location.host;
                    r.src = t + r.src
                }
                b(r);
                r = k(r);
                n.push(r);
                m.push(r.src)
            }
        }
        var s;
        if (document.all) {
            s = v.frames
        } else {
            s = v.getElementsByTagName("iframe")
        }
        for (var o = 0; o < s.length; o++) {
            try {
                var y;
                if (document.all) {
                    y = s[o].document
                } else {
                    y = s[o].contentDocument
                }
                if (y) {
                    var w = s[o].parentNode;
                    n = a(y, n, {parentNode: w})
                }
            } catch (u) {
            }
        }
        return n
    }

    function l() {
        if ($E("captureToQing")) {
            return
        }
        var n = document.createElement("input");
        n.value = "收集到Qing";
        n.type = "button";
        n.id = "captureToQing";
        n.style.display = "none";
        n.style.position = "absolute";
        n.style.width = 100 + "px";
        n.style.zIndex = 10000000;
        document.body.appendChild(n);
        n.onmouseover = function () {
            clearTimeout(i);
            this.style.display = "block"
        };
        n.onmouseout = function (p) {
            var o = p || window.event;
            var q = o.relatedTarget || o.toElement;
            if (q === n.curImg) {
                return
            }
            var r = this;
            i = setTimeout(function () {
                r.style.display = "none"
            }, 100)
        };
        n.onclick = function () {
            f(n.curImg)
        }
    }

    function b(n) {
        if (n.getAttribute("capturePin")) {
            return
        }
        n.setAttribute("capturePin", "registered");
        var o = document.getElementById("captureToQing");
        n.onmouseover = function () {
            clearTimeout(i);
            g(o, n);
            o.style.display = "block"
        };
        n.onmouseout = function (q) {
            var p = q || window.event;
            var r = p.relatedTarget || p.toElement;
            if (r === o) {
                return
            }
            i = setTimeout(function () {
                o.style.display = "none"
            }, 100)
        }
    }

    function g(o, n) {
        var p = Core.Dom.getXY(n);
        o.style.position = "absolute";
        o.style.left = p[0] + "px";
        o.style.top = p[1] + "px";
        o.curImg = n
    }

    function j(n) {
        for (var o = 0; o < m.length; o++) {
            if (n.src == m[o]) {
                return !1
            }
        }
        if (n.style.display != "none" && n.width >= d && n.height >= h) {
            return !0
        } else {
            return !1
        }
    }

    function k(n) {
        var o = new Image;
        o.w = n.width;
        o.h = n.height;
        o.src = n.src;
        o.alt = n.alt;
        return o
    }
};
Xblog.onlyShadow = function (b, c, f) {
    this.entity = null;
    this.parent = c || document.body;
    this._ie6Fixed = function () {
        if (d.entity) {
            d.entity.style.top = document.documentElement.scrollTop + "px";
            var i = (document.documentElement.scrollLeft - d._ie6EntityXY[0]);
            var h = i + d.entity.offsetWidth;
            var g = (document.documentElement.scrollWidth || document.body.scrollWidth);
            if (h <= g) {
                d.entity.style.left = i + "px"
            }
            if (d.ifm) {
                d.ifm.style.top = d.entity.style.top;
                if (h <= g) {
                    d.ifm.style.left = d.entity.style.left
                }
            }
        }
    };
    var d = this;
    this.resetShadowDiv = Core.Function.bind3(function () {
        if (d.entity) {
            setTimeout(function () {
                d.updateSize();
                if ($IE6 && d.isShow()) {
                    d.entity.style.left = "0px";
                    var g = Core.Dom.getXY(d.entity);
                    d._ie6EntityXY = g;
                    d._ie6Fixed()
                }
            }, 1)
        }
    }, this);
    this._create = function () {
        d.entity = $C("div");
        if (f) {
            d.entity.id = f
        }
        d.entity.style.position = "absolute";
        d.entity.style.width = d.getAreaWidth() + "px";
        d.entity.style.height = d.getAreaHeight() + "px";
        d.entity.style.left = "0px";
        d.entity.style.top = "0px";
        d.entity.style.zIndex = 1400000;
        d.entity.style.backgroundColor = "black";
        d.parent.appendChild(d.entity);
        d._setOpacity(d.entity, isNaN(b) ? 0.5 : b);
        if ($IE6) {
            var h = Core.Dom.getXY(d.entity);
            d._ie6EntityXY = h;
            var g = (document.documentElement.scrollLeft - d._ie6EntityXY[0]);
            d.entity.style.left = g + "px";
            d.addIframe()
        }
        Core.Events.addEvent(window, d.resetShadowDiv, "resize");
        d.setFixed(true);
        d.hidden()
    };
    (function a() {
        if (f && $E(f)) {
            d.entity = $E(f)
        } else {
            d._create()
        }
    })()
};
Xblog.onlyShadow.prototype = {
    isShow: function () {
        return this.entity.offsetHeight > 0 ? true : false
    }, show: function () {
        this.entity.style.display = "";
        if (this.ifm) {
            this.ifm.style.display = ""
        }
        if ($IE6) {
            this.updateSize();
            this.entity.style.left = "0px";
            var a = Core.Dom.getXY(this.entity);
            this._ie6EntityXY = a;
            this._ie6Fixed()
        }
        this.onShow()
    }, hidden: function () {
        this.entity.style.display = "none";
        if (this.ifm) {
            this.ifm.style.display = "none"
        }
        this.onHidden()
    }, close: function () {
        this.hidden();
        this.destroy()
    }, destroy: function () {
        Core.Events.removeEvent(window, this._ie6Fixed, "scroll");
        Core.Events.removeEvent(window, this.resetShadowDiv, "resize");
        this.entity.parentNode.removeChild(this.entity);
        this.entity = null;
        if (this.ifm) {
            this.ifm.parentNode.removeChild(this.ifm);
            this.ifm = null
        }
    }, addIframe: function () {
        this.ifm = $C("iframe");
        this._setOpacity(this.ifm, 0);
        this.ifm.style.position = "absolute";
        this.ifm.style.zIndex = this.entity.style.zIndex;
        this.ifm.style.left = this.entity.style.left;
        this.ifm.style.top = this.entity.style.top;
        this.ifm.style.width = this.entity.style.width;
        this.ifm.style.height = this.entity.style.height;
        this.entity.parentNode.insertBefore(this.ifm, this.entity)
    }, insertBefore: function (a) {
        a.parentNode.insertBefore(this.entity, a);
        if (this.ifm) {
            this.entity.parentNode.insertBefore(this.ifm, this.entity)
        }
    }, updateSize: function () {
        var b = this.getAreaWidth();
        var a = this.getAreaHeight();
        this.entity.style.width = b + "px";
        this.entity.style.height = a + "px";
        if (this.ifm) {
            this.ifm.style.width = b + "px";
            this.ifm.style.height = a + "px"
        }
    }, getAreaHeight: function () {
        var a = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
        return a
    }, getAreaWidth: function () {
        var a = document.documentElement.clientWidth || document.body.clientWidth;
        return a
    }, setFixed: function (a) {
        if ($IE6) {
            var b = this;
            if (a) {
                b._ie6Fixed();
                Core.Events.addEvent(window, b._ie6Fixed, "scroll")
            } else {
                Core.Events.removeEvent(window, b._ie6Fixed, "scroll")
            }
        } else {
            this.entity.style.position = a ? "fixed" : "absolute"
        }
    }, _setOpacity: function (b, a) {
        if ($IE) {
            b.style.filter = "alpha(opacity=" + a * 100 + ")"
        } else {
            b.style.opacity = a
        }
    }, onShow: function () {
    }, onHidden: function () {
    }
};
Xblog.loadExternalCSS = function (a, f) {
    if (typeof a !== "string") {
        return
    }
    var c, d, b = document.getElementsByTagName("head")[0] || document.body;
    if ($FF) {
        d = $C("style");
        d.type = "text/css";
        d.innerHTML = "@import url(" + a + ")";
        b.appendChild(d);
        (function () {
            try {
                d.sheet.cssRules;
                typeof f === "function" && f()
            } catch (g) {
                setTimeout(arguments.callee, 50)
            }
        })()
    } else {
        c = $C("link");
        c.href = a;
        c.type = "text/css";
        c.rel = "stylesheet";
        c.media = "all";
        b.appendChild(c);
        if ($SAFARI || $CHROME) {
            (function () {
                try {
                    c.sheet.cssRules;
                    typeof f === "function" && f()
                } catch (g) {
                    setTimeout(arguments.callee, 50)
                }
            })()
        } else {
            c.onload = function () {
                c.onload = null;
                typeof f === "function" && f()
            }
        }
    }
};
$registJob("captureImgs", function () {
    if (location.hostname.indexOf("qing.blog.sina.com.cn") != -1) {
        alert("不能收集Qing本站的图片，请使用转载功能");
        return
    }
    if ($E("captureStepOne")) {
        return
    }
    var h = Core.Events.addEvent;
    var a = Core.Dom.getElementsByClass;
    var d = new Lib.classUtils;
    var g = '<div class="qingLayerBg"><div class="qingLayerInner"><div class="qingCaptureBox "><div class=" qingCaptureTit "><h4>收集到Qing</h4><div class="qingTip "><p id="choicePicNum">一次最多可以选择20张图片</p></div><a class="qingClose" id="captureCloseBtn" href="#" title=""></a></div><div class="qinCaptureCon"><div class="qingPicWrap"><!--最大高度是338px，超出后显示滚动条--><ul class="qingPicList" id="capturePicWrap"></ul></div><div class="qingBtnWrap"><a class="qingBtn qingBtndis" id="captureNextBtn"><span>下一步</span></a><!--此为按钮不可用状态--><span style="display:none" class="qingErrorTip" id="captureErrorTip">请选择一张图片</span></div></div></div></div></div>';
    Xblog.loadExternalCSS("http://simg.sinajs.cn/xblogstyle/css/dialog/layer_capture.css?r=" + Math.random(), function () {
        if ($E("captureStepOne")) {
            return
        }
        var k = {picLimWidth: 100, picLimHeight: 100, createLayer: n};
        var j = false, l = 0, i = 20;
        window.liEventInit = false;
        n();
        function n(s) {
            var x = new Xblog.onlyShadow(0.8, document.body, "captureMaskLayer");
            var o = $C("div");
            o.id = "captureStepOne";
            o.className = "qingCaptureWrap qingCaptureStep1";
            o.innerHTML = g;
            o.style.display = "none";
            document.body.appendChild(o);
            if (s) {
                var v = new Image;
                v.alt = s.alt;
                v.src = s.src;
                s = v;
                j = true;
                m([s])
            } else {
                var t = Xblog.captureImgs(k);
                if (t.length == 0) {
                    alert("抱歉，页面上没有足够大的图片");
                    document.body.removeChild(o);
                    return
                }
                m(t)
            }
            x.show();
            $E("captureStepOne").style.display = "";
            f("captureStepOne");
            $E("captureStepOne").style.zIndex = 14010000;
            if (!window.liEventInit) {
                window.liEventInit = true;
                var w = $E("captureCloseBtn"), u = $E("capturePicWrap"), r = $E("captureErrorTip"), q = $E("captureNextBtn"), p = $E("captureLoading");
                h(w, function () {
                    document.body.removeChild($E("captureStepOne"));
                    window.liEventInit = false;
                    x.close()
                }, "click");
                h(u, function (B) {
                    var z = B || window.event;
                    var A = z.target || z.srcElement;
                    var y = c(A, "li");
                    if (!y) {
                        return
                    }
                    if (!d.hasClass(y, "selected")) {
                        d.addClass(y, "selected");
                        l++;
                        $E("choicePicNum").innerHTML = '还可以选择<span style="color:red;">' + (i - l) + "</span>张";
                        if (l > i) {
                            l--;
                            $E("choicePicNum").innerHTML = '还可以选择<span style="color:red;">' + (i - l) + "</span>张";
                            d.delClass(y, "selected");
                            return
                        }
                    } else {
                        d.delClass(y, "selected");
                        l--;
                        $E("choicePicNum").innerHTML = '还可以选择<span style="color:red;">' + (i - l) + "</span>张"
                    }
                    if (l >= 1) {
                        d.delClass(q, "qingBtndis");
                        r.style.display = "none"
                    } else {
                        d.addClass(q, "qingBtndis")
                    }
                });
                h(q, function () {
                    if (l == 0) {
                        $E("captureErrorTip").innerHTML = "请至少选择一张图片";
                        $E("captureErrorTip").style.display = "inline";
                        return
                    }
                    var I = [];
                    var y = u.getElementsByTagName("li");
                    for (var A = 0; A < y.length; A++) {
                        if (y[A].className == "selected") {
                            var B = y[A].innerHTML;
                            var H = /<img(.+?)src=""*([^\s]+?)""*(\s|>)/ig;
                            var F = String(B.match(H));
                            var C = /src\s*=\s*(["'])([^"']+)\1/i;
                            I.push(String(F.match(C)[2]))
                        }
                    }
                    document.body.removeChild($E("captureStepOne"));
                    window.liEventInit = false;
                    x.close();
                    var D = "";
                    for (var A = 0; A < I.length; A++) {
                        D += "img[]=";
                        var E = b(String(I[A]));
                        D += encodeURIComponent(E);
                        D += "&"
                    }
                    var G = document.URL;
                    var z = $_GLOBAL.DOMAIN_CORE + "/blog/controllers/capture.php?" + D + "&title=" + encodeURIComponent(document.title) + "&host=" + encodeURIComponent(G) + "&r=" + Math.random();
                    window.open(z, "selectionshare", "toolbar=0,status=0,resizable=1,width=900,height=500,left=100,top=100")
                }, "click")
            }
        }

        function m(r) {
            for (var q = 0; q < r.length; q++) {
                var o = $C("li");
                var p = '<a href="javascript:void(0);" title="图片大小:' + r[q].w + "x" + r[q].h + '" onclick="return false;"><img src="' + r[q].src + '" alt="图片大小:' + r[q].alt + '" title="图片大小:' + r[q].w + "x" + r[q].h + '"><span class="qingMaskLayer"></span><span class="qingIcon"></span></a>';
                if (j == true) {
                    d.addClass(o, "selected");
                    d.delClass($E("captureNextBtn"), "qingBtndis");
                    $E("captureErrorTip").style.display = "none";
                    l++;
                    j = false
                }
                o.innerHTML = p;
                $E("capturePicWrap").appendChild(o)
            }
        }
    });
    function c(j, i) {
        i = i.toUpperCase();
        while (j != document.body) {
            if (j.tagName.toUpperCase() == i) {
                return j
            }
            j = j.parentNode
        }
        return null
    }

    function f(i) {
        var j = document.documentElement.clientHeight || document.body.clientHeight;
        var l = document.documentElement.clientWidth || document.body.clientWidth;
        var k = 876;
        $E(i).style.position = $IE6 ? "absolute" : "fixed";
        $E(i).style.left = Math.abs(l - k) / 2 + "px";
        if ($IE6) {
            $E(i).style.top = document.documentElement.scrollTop + 60 + "px"
        } else {
            $E(i).style.top = 60 + "px"
        }
    }

    function b(j) {
        var i = document.createElement("div");
        i.innerHTML = j;
        return i.innerText || i.textContent
    }
});
(function () {
    var a = function (c, b) {
        var d;
        try {
            if (typeof b != "undefined") {
                for (d in c) {
                    if (b[d] != null) {
                        c[d] = b[d]
                    }
                }
            }
        } finally {
            d = null;
            return c
        }
    };
    Core.System.parseParam = a
})();
Utils.Io.JsLoad = {};
(function () {
    function a(k, g) {
        b(k, g);
        var j = k.urls;
        var f, d = j.length;
        for (f = 0; f < d; f++) {
            var h = $C("script");
            h.src = j[f].url;
            h.charset = j[f].charset;
            h.onload = h.onerror = h.onreadystatechange = function () {
                if (h && h.readyState && h.readyState != "loaded" && h.readyState != "complete") {
                    return
                }
                g.script_loaded_num++;
                h.onload = h.onreadystatechange = h.onerror = null;
                h.src = "";
                h.parentNode.removeChild(h);
                h = null
            };
            document.getElementsByTagName("head")[0].appendChild(h)
        }
    }

    function b(m, h) {
        var l = m.urls;
        var o = m.GET;
        var j, k = l.length;
        var n, f, d, g;
        for (j = 0; j < k; j++) {
            g = window.parseInt(Math.random() * 100000000);
            f = new Utils.Url(l[j].url);
            for (n in o) {
                if (m.noencode == true) {
                    f.setParam(n, o[n])
                } else {
                    f.setParam(n, Core.String.encodeDoubleByte(o[n]))
                }
            }
            d = f.getParam("varname") || "requestId_" + g;
            if (m.noreturn != true) {
                f.setParam("varname", d)
            }
            h.script_var_arr.push(d);
            l[j].url = f.toString();
            l[j].charset = l[j].charset || m.charset
        }
    }

    function c(g, h) {
        var f = {
            urls: [],
            charset: "utf-8",
            noreturn: false,
            noencode: false,
            timeout: -1,
            POST: {},
            GET: {},
            onComplete: null,
            onException: null
        };
        var d = {script_loaded_num: 0, is_timeout: false, is_loadcomplete: false, script_var_arr: []};
        f.urls = typeof g == "string" ? [{url: g}] : g;
        Core.System.parseParam(f, h);
        a(f, d);
        (function () {
            if (f.noreturn == true && f.onComplete == null) {
                return
            }
            var j, k = [];
            if (d.script_loaded_num == f.urls.length) {
                d.is_loadcomplete = true;
                if (f.onComplete != null) {
                    for (j = 0; j < d.script_var_arr.length; j++) {
                        k.push(window[d.script_var_arr[j]])
                    }
                    if (d.script_var_arr.length < 2) {
                        f.onComplete(k[0])
                    } else {
                        f.onComplete(k)
                    }
                }
                return
            }
            if (d.is_timeout == true) {
                return
            }
            setTimeout(arguments.callee, 50)
        })();
        if (f.timeout > 0) {
            setTimeout(function () {
                if (d.is_loadcomplete != true) {
                    if (f.onException != null) {
                        f.onException()
                    }
                    d.is_timeout = true
                }
            }, f.timeout)
        }
    }

    Utils.Io.JsLoad.request = function (d, f) {
        new c(d, f)
    }
})();
function v6SendLog(b, a) {
}
function v7sendLog(b, a, c) {
    if (!b) {
        return false
    }
    if (b.split("_").length == 3) {
        Lib.checkAuthor();
        if ($isLogin) {
            b += "_" + $UID
        }
    }
    if (typeof scope == "undefined") {
        window.scope = {};
        scope.$pageid = ""
    }
    a = a || scope.$pageid;
    c = c || "";
    Utils.Io.JsLoad.request("http://hits.sinajs.cn/A2/b.html?type=" + b + "&pageid=" + a + "&msg=" + c, {
        onComplete: function () {
        }
    })
}
Xblog.register = function (a, f) {
    var d = a.split(".");
    var g = {}, c, b = Xblog;
    while (c = d.shift()) {
        if (d.length) {
            if (b[c] === undefined) {
                b[c] = {}
            }
            b = b[c]
        } else {
            if (b[c] === undefined) {
                b[c] = f(Xblog)
            }
        }
    }
};
Xblog.register("sendSuda", function () {
    var c = !1;
    var a;
    var b = [];
    var d = "http://www.sinaimg.cn/unipro/pub/suda_s_v851c.js";
    var c = function () {
        Utils.Io.JsLoad.request(d, {
            isRemove: !1, noreturn: true, onComplete: function () {
                a = !1;
                c = !0;
                for (var g = 0, f = b.length; g < f; g++) {
                    b[g]()
                }
                b = []
            }
        })
    };
    return function (f) {
        if (!0 === c) {
            f()
        } else {
            if (!0 === a) {
                b.push(f)
            } else {
                b.push(f);
                c()
            }
        }
    }
});
$registJob("suda", function () {
    var c = scope && scope.$pageid && scope.$pageid;
    var b = c && (c === "tpl_home" || c === "tpl_article");
    if (typeof _S_pSt == "function") {
        if (b) {
            a(c, "42_01_26", "42_01_29")
        }
        return
    }
    if (b) {
        a(c, "42_01_26", "42_01_29")
    }
    Xblog.sendSuda(function () {
        try {
            _S_pSt("")
        } catch (d) {
        }
        if (b) {
            a(c, "42_01_27", "42_01_30")
        }
    });
    function a(d, g, f) {
        switch (d) {
            case"tpl_home":
                v7sendLog(g);
                break;
            case"tpl_article":
                v7sendLog(f);
                break
        }
    }
});
function main() {
    var a = new Jobs();
    a.add("checkUserOnce");
    a.add("suda");
    a.add("captureImgs");
    a.start()
};