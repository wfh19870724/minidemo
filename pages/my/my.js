var t = require("../../utils/utilMd5.js"), a = getApp();

Page({
    data: {
        binding: !1,
        sendText: "获取验证码",
        canSendCode: !1,
        isCountDown: !1,
        mobile: "",
        code: "",
        showError: !1,
        errorMsg: "",
        authModal: !1
    },
    onLoad: function(t) {},
    onShareAppMessage: function() {
        return {
            title: "挂号平台demo",
            path: "/pages/index/index"
        };
    },
    onShow: function() {
        this.hideAuthModal();
    },
    authLogin: function() {
        var t = this;
        return !!a.globalData.loginInfo.loginToken || (a.loginInit(function() {
            t.showAuthModal();
        }), !1);
    },
    showAuthModal: function() {
        this.setData({
            authModal: !0
        });
    },
    hideAuthModal: function() {
        this.setData({
            authModal: !1
        });
    },
    bindGetUserInfo: function(t) {
        t && t.detail && "getUserInfo:ok" == t.detail.errMsg && a.wyLogin(t.detail);
    },
    onGuahao: function() {
        wx.navigateTo({
            url: "../my-order/my-order"
        }) ; this.setData({
            // binding: !0
        });
    },
    onContacts: function() {
        wx.navigateTo({
            url: "../my-patient/my-patient"
        }) ;this.setData({
            // binding: !0
        });
    },
    closebind: function() {
        this.setData({
            binding: !1,
            showError: !1,
            errorMsg: ""
        });
    },
    mobileIpt: function(t) {
        var a = t.detail.value;
        this.setData({
            mobile: a
        }), 11 !== a.length || this.data.isCountDown ? this.setData({
            canSendCode: !1
        }) : this.setData({
            canSendCode: !0
        });
    },
    codeIpt: function(t) {
        var a = t.detail.value;
        this.setData({
            code: a
        });
    },
    sendcode: function() {
        if (!this.data.canSendCode) return !1;
        var o = this;
        o.setData({
            showError: !1,
            errorMsg: ""
        });
        var e = this.data.mobile, n = a.globalData.loginInfo.smsType, s = t.hexMD5(n + e);
        o.countdown(), wx.request({
            url: a.globalData.mircoServer + "/json/white/mobile/send/" + e + "/" + n + "/" + s,
            method: "GET",
            success: function(t) {
                !1 === t.data.hasError || o.setData({
                    showError: !0,
                    errorMsg: t.data.message || "验证码发送失败，请重试"
                });
            },
            fail: function(t) {
                o.setData({
                    showError: !0,
                    errorMsg: t.data.message || "验证码发送失败，请重试"
                });
            }
        });
    },
    bind: function() {
        var t = this, o = this.data.mobile, e = this.data.code;
        return "" === o ? (this.setData({
            showError: !0,
            errorMsg: "请输入手机号码"
        }), this) : "" === e ? (this.setData({
            showError: !0,
            errorMsg: "请输入验证码"
        }), this) : (this.setData({
            showError: !1,
            errorMsg: ""
        }), void wx.request({
            url: a.globalData.psServer + "/json/white/miniprogrom/bind",
            method: "GET",
            header: {
                appid: "mini-app"
            },
            data: {
                mobile: o,
                secret: a.globalData.loginInfo.secret,
                smsCaptcha: e,
                plat: "mircowx"
            },
            success: function(o) {
                !1 === o.data.hasError ? (a.globalData.loginInfo.loginToken = o.data.data.loginToken, 
                a.globalData.loginInfo.state = !0, t.setData({
                    binding: !1,
                    showError: !1,
                    errorMsg: ""
                }), wx.showToast({
                    title: "绑定成功",
                    icon: "success",
                    duration: 2e3
                })) : t.setData({
                    showError: !0,
                    errorMsg: o.data.message || "绑定失败，请重试"
                });
            },
            fail: function() {
                t.setData({
                    showError: !0,
                    errorMsg: res.data.message || "绑定失败，请重试"
                });
            }
        }));
    },
    countdown: function() {
        var t = this, a = 60;
        t.setData({
            sendText: "已发送（" + a + "）",
            canSendCode: !1,
            isCountDown: !0
        });
        var o = setInterval(function() {
            --a ? t.setData({
                sendText: "已发送（" + a + "）"
            }) : (clearInterval(o), t.setData({
                sendText: "重新获取",
                canSendCode: !0,
                isCountDown: !1
            }));
        }, 1e3);
        return o;
    }
});