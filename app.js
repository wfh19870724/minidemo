App({
    onLaunch: function() {},
    data: {
        cbs: [],
        logining: !0
    },
    loginInit: function(t) {
        var a = this;
        if (this.data.logining) return console.log("登录中..."), void wx.showToast({
            title: "登录中",
            icon: "loading",
            duration: 2e3
        });
        this.data.logining = !0, wx.login({
            success: function(o) {
                if (o.code) {
                    var e = o.code;
                    a.globalData.code = e, wx.getSetting({
                        success: function(o) {
                            o.authSetting["scope.userInfo"] ? a.getUserInfo() : wx.canIUse("button.open-type.getUserInfo") ? ("function" == typeof t && t(), 
                            a.data.logining = !1) : (wx.showModal({
                                title: "提示",
                                content: "请升级微信版本",
                                success: function(t) {}
                            }), a.data.logining = !1);
                        }
                    });
                }
            }
        });
    },
    getUserInfo: function() {
        function t() {
            wx.showModal({
                title: "登录失败",
                content: "登录失败，请检查您的网络",
                success: function(t) {
                    t.confirm;
                }
            }), this.data.logining = !1;
        }
        var a = this;
        wx.getUserInfo({
            success: function(o) {
              console.log(o);
                o ? a.wyLogin(o) : t();
            }
        });
    },
    wyLogin: function(t) {
        var a = this;
      
        wx.request({
            url: a.globalData.psServer + "/json/white/miniprogrom/login",
            header: {
                appid: "mini-app"
            },
            
            data: {
                code: a.globalData.code,
                signature: t.signature,
                encryptedData: t.encryptedData,
                iv: t.iv,
                plat: "mircowx"
            },
          
            success: function(t) {
                if (t && t.data && !1 === t.data.hasError) {
                    var o = t.data.data;
                    a.globalData.loginInfo = {
                        secret: o.secret || "",
                        loginToken: o.loginToken || "",
                        state: o.state,
                        smsType: o.smsType || ""
                    };
                } else {
                  // loginfail();
                  console.info("loginfail");
                  console.info(t.data);
                  secret:  "1";
                  loginToken:  "1";
                  state: "1";
                  smsType: "1";

                }
            },
            fail: function() {
                console.info("loginfail1");
            },
            complete: function() {
                for (var t = a.data.cbs, o = 0; o < t.length; o++) "function" == typeof t[o] && t[o]();
                a.data.logining = !1;
            },
          
        });
    },
  


    
    getAddress: function(t) {
        function a(t, a) {
            o.globalData.locationInfo = {
                latitude: t || "",
                longitude: a || "",
                provinceId: "all",
                provinceName: "全国",
                areaId: "all",
                areaName: "不限",
                setted: !0
            };
        }
        var o = this;
        o.globalData.locationInfo.setted ? "function" == typeof t && t(o.globalData.locationInfo) : wx.getLocation({
            type: "wgs84",
            success: function(e) {
                var n = e.latitude, i = e.longitude;
                wx.request({
                    url: o.globalData.psServer + "/json/white/location/get",
                    data: {
                        longitude: i,
                        latitude: n
                    },
                    method: "GET",
                    success: function(e) {
                        if (e && e.data && e.data.success && e.data.data) {
                            var s = e.data.data, l = s.cityId;
                            o.globalData.locationInfo = {
                                latitude: n,
                                longitude: i,
                                provinceId: s.provinceId,
                                provinceName: s.province,
                                areaId: "all" == l ? s.provinceId : l,
                                areaName: s.city,
                                autoCityId: "all" == l ? s.provinceId : l,
                                setted: !0
                            };
                        } else console.log("自动定位接口请求失败"), a(n, i);
                        "function" == typeof t && t(o.globalData.locationInfo);
                    },
                    fail: function(e) {
                        console.log("自动定位接口请求失败！"), a(n, i), "function" == typeof t && t(o.globalData.locationInfo);
                    }
                });
            },
            fail: function() {
                console.log("未开启定位授权或其他错误！"), a(), "function" == typeof t && t(o.globalData.locationInfo);
            }
        });
    },
    _doRequestH5api: function(t) {
        var a = this;
        wx.request({
            url: t.url.indexOf("//") > -1 ? t.url : this.globalData.haServer + t.url,
            method: (t.method || "POST").toUpperCase(),
            dataType: "json",
            header: {
                "weiyi-authtoken": a.globalData.loginInfo.loginToken,
                "weiyi-version": "1.0",
                "weiyi-appid": "p_h5_minapp",
                "Content-Type": "application/json;charset=utf-8"
            },
            data: t.data || {},
            success: function(a) {
                200 == a.statusCode && a.data && (0 == a.data.code ? t.success(a.data) : wx.showToast({
                    title: a.data.message,
                    icon: "none",
                    duration: 2e3
                }));
            },
            fail: t.fail,
            complete: t.complete
        });
    },
    requestH5api: function(t) {
        this._doRequestH5api(t);
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
        haServer: "https://api-gateway.guahao.com",
        psServer: "https://service.guahao.com",
        staticServer: "https://img.guahao.com",
        mircoServer: "https://mircowx.wy.guahao.com"
    }
});