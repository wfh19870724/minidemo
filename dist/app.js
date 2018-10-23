require("common/manifest.js"), require("common/vendor.js"), global.webpackJsonp([ 2 ], {
    44: function(e, a, t) {
        Object.defineProperty(a, "__esModule", {
            value: !0
        });
        var o = t(15), n = t.n(o), i = t(46), r = t(50), s = t(54);
        n.a.config.productionTip = !1, i.a.mpType = "app", new n.a(i.a).$mount(), App(r.a), 
        n.a.prototype.$app = getApp(), n.a.prototype.$store = s.a;
    },
    46: function(e, a, t) {
        var o = t(49), n = !1, i = t(11)(o.a, null, function(e) {
            n || t(47);
        }, null, null);
        i.options.__file = "src/App.vue", i.esModule && Object.keys(i.esModule).some(function(e) {
            return "default" !== e && "__" !== e.substr(0, 2);
        }) && console.error("named exports are not supported in *.vue files."), a.a = i.exports;
    },
    47: function(e, a) {},
    49: function(e, a, t) {
        a.a = {
            created: function() {}
        };
    },
    50: function(e, a, t) {
        var o = t(51);
        a.a = {
            data: {
                cbs: [],
                logining: !1
            },
            loginInit: function(e) {
                var a = this;
                if (this.data.logining) return console.log("登录中..."), void wx.showToast({
                    title: "登录中",
                    icon: "loading",
                    duration: 2e3
                });
                this.data.logining = !0, wx.login({
                    success: function(t) {
                        if (t.code) {
                            var o = t.code;
                            a.globalData.code = o, wx.getSetting({
                                success: function(t) {
                                    t.authSetting["scope.userInfo"] ? a.getUserInfo() : wx.canIUse("button.open-type.getUserInfo") ? ("function" == typeof e && e(), 
                                    a.data.logining = !1) : (wx.showModal({
                                        title: "提示",
                                        content: "请升级微信版本",
                                        success: function(e) {}
                                    }), a.data.logining = !1);
                                }
                            });
                        }
                    }
                });
            },
            loginfail: function() {
                wx.showModal({
                    title: "登录失败",
                    content: "登录失败，请检查您的网络",
                    success: function(e) {
                        e.confirm;
                    }
                }), this.data.logining = !1;
            },
            getUserInfo: function() {
                var e = this;
                wx.getUserInfo({
                    success: function(a) {
                        a ? e.wyLogin(a) : e.loginfail();
                    }
                });
            },
            wyLogin: function(e) {
                var a = this;
                wx.request({
                    url: a.globalData.psServer + "/json/white/miniprogrom/login",
                    header: {
                        appid: "mini-app"
                    },
                    data: {
                        code: a.globalData.code,
                        signature: e.signature,
                        encryptedData: e.encryptedData,
                        iv: e.iv,
                        plat: "mircowx"
                    },
                    success: function(e) {
                        if (e && e.data && !1 === e.data.hasError) {
                            var t = e.data.data;
                            a.globalData.loginInfo = {
                                secret: t.secret || "",
                                loginToken: t.loginToken || "",
                                state: t.state,
                                smsType: t.smsType || ""
                            };
                        } else a.loginfail();
                    },
                    fail: function() {
                        a.loginfail();
                    },
                    complete: function() {
                        for (var e = a.data.cbs, t = 0; t < e.length; t++) "function" == typeof e[t] && e[t]();
                        a.data.logining = !1;
                    }
                });
            },
            getAddress: function(e) {
                function a(e, a) {
                    t.globalData.locationInfo = {
                        latitude: e || "",
                        longitude: a || "",
                        provinceId: "all",
                        provinceName: "全国",
                        areaId: "all",
                        areaName: "不限",
                        setted: !0
                    };
                }
                var t = this;
                t.globalData.locationInfo.setted ? "function" == typeof e && e(t.globalData.locationInfo) : wx.getLocation({
                    type: "wgs84",
                    success: function(o) {
                        var n = o.latitude, i = o.longitude;
                        wx.request({
                            url: t.globalData.psServer + "/json/white/location/get",
                            data: {
                                longitude: i,
                                latitude: n
                            },
                            method: "GET",
                            success: function(o) {
                                if (o && o.data && o.data.success && o.data.data) {
                                    var r = o.data.data, s = r.cityId;
                                    t.globalData.locationInfo = {
                                        latitude: n,
                                        longitude: i,
                                        provinceId: r.provinceId,
                                        provinceName: r.province,
                                        areaId: "all" === s ? r.provinceId : s,
                                        areaName: r.city,
                                        autoCityId: "all" === s ? r.provinceId : s,
                                        setted: !0
                                    };
                                } else console.log("自动定位接口请求失败"), a(n, i);
                                "function" == typeof e && e(t.globalData.locationInfo);
                            },
                            fail: function(o) {
                                console.log("自动定位接口请求失败！"), a(n, i), "function" == typeof e && e(t.globalData.locationInfo);
                            }
                        });
                    },
                    fail: function() {
                        console.log("未开启定位授权或其他错误！"), a(), "function" == typeof e && e(t.globalData.locationInfo);
                    }
                });
            },
            _doRequestH5api: function(e) {
                var a = this;
                wx.request({
                    url: e.url.indexOf("//") > -1 ? e.url : this.globalData.haServer + e.url,
                    method: (e.method || "POST").toUpperCase(),
                    dataType: "json",
                    header: {
                        "weiyi-authtoken": a.globalData.loginInfo.loginToken,
                        "weiyi-version": "1.0",
                        "weiyi-appid": "p_h5_minapp",
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    data: e.data || {},
                    success: function(a) {
                        200 === a.statusCode && a.data && ("0" === a.data.code ? e.success(a.data) : wx.showToast({
                            title: a.data.message,
                            icon: "none",
                            duration: 2e3
                        }));
                    },
                    fail: e.fail,
                    complete: e.complete
                });
            },
            requestH5api: function(e) {
                this._doRequestH5api(e);
            },
            globalData: {
                code: "",
                userInfo: null,
                loginInfo: {
                    secret: "",
                    loginToken: "",
                    state: "",
                    smsType: ""
                },
                locationInfo: {
                    latitude: "",
                    longitude: "",
                    provinceId: "",
                    provinceName: "",
                    areaId: "",
                    areaName: "",
                    autoCityId: "",
                    setted: !1
                },
                haServer: o.a.gatewayServer,
                gatewayServer: o.a.gatewayServer,
                psServer: o.a.serviceServer,
                serviceServer: o.a.serviceServer,
                staticServer: o.a.staticServer,
                mircoServer: o.a.mircoServer
            }
        };
    },
    51: function(e, a, t) {
        var o = void 0;
        o = t(53), a.a = o;
    },
    52: function(e, a) {
        var t = {};
        t.guahaoServer = "https://wy.guahao.com", t.serviceServer = "https://service.guahao.com", 
        t.gatewayServer = "https://api-gateway.guahao.com", t.staticServer = "https://img.guahao.com", 
        t.kanoServer = "https://kano.guahao.com", t.mircoServer = "https://mircowx.wy.guahao.com", 
        e.exports = t;
    },
    53: function(e, a) {
        var t = {};
        t.guahaoServer = "https://wy.guahao.com", t.serviceServer = "https://service.guahao.com", 
        t.gatewayServer = "https://api-gateway.guahao.com", t.staticServer = "https://img.guahao.com", 
        t.kanoServer = "https://kano.guahao.com", t.mircoServer = "https://mircowx.wy.guahao.com", 
        e.exports = t;
    },
    54: function(e, a, t) {
        var o = t(55), n = t.n(o), i = t(15), r = t.n(i), s = t(61), c = {
            test: "zane"
        }, l = n()({}, "SET_DATA", function(e, a) {
            e.test = a;
        });
        r.a.use(s.a), a.a = new s.a.Store({
            state: c,
            mutations: l
        });
    }
}, [ 44 ]);