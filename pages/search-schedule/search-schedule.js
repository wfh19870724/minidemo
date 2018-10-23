var t = require("../../utils/utilMd5.js"), a = getApp();

Page({
    data: {
        modalType: "",
        perfectInfo: {
            identityNo: 0,
            name: 0
        },
        invalid: {},
        id: "",
        doctorList: [],
        doctorList2: [],
        doctorListFilterByDate: [],
        dateList: [],
        active_date: 0,
        active_tab: 0,
        binding: !1,
        sendText: "获取验证码",
        canSendCode: !1,
        isCountDown: !1,
        mobile: "",
        code: "",
        showError: !1,
        errorMsg: "",
        authModal: !1,
        doctorLoading: !0,
        scheduleLoading: !0
    },
    onShareAppMessage: function() {
        return {
            title: "挂号平台demo",
            path: "/pages/search-schedule/search-schedule?hospitalId=" + this.data.hospitalId + "&deptId=" + this.data.deptId + "&deptName=" + this.data.deptName
        };
    },
    onShow: function() {
        this.hideAuthModal();
    },
    authLogin: function() {
        var t = this;
        return !!a.globalData.loginInfo.loginToken || (a.loginInit(function() {
            t.showAuthModal();
        }), !0);
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
    choseTab: function(t) {
        var a = t.currentTarget.dataset.type;
        this.setData({
            active_tab: a
        }), 1 == a && this.data.dateList[0] && this.choseDate({
            currentTarget: {
                dataset: {
                    index: 0,
                    date: this.data.dateList[0].fullDate
                }
            }
        });
    },
    choseDate: function(t) {
        var a = t.currentTarget.dataset.index, e = t.currentTarget.dataset.date;
        this.setData({
            active_date: a,
            doctorListFilterByDate: []
        }), this.getSchedule(e);
    },
    getSchedule: function(t) {
        var e = this;
        e.setData({
            scheduleLoading: !0
        }), wx.showLoading({
            title: "加载中"
        }), a.requestH5api({
            url: "/doctor/doctorshiftsearch/list.json",
            data: {
                hospDeptId: e.data.deptId,
                date: t || ""
            },
            success: function(t) {
                if (0 == t.flag && t.dateList) {
                    var a = [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ], o = t.dateList.map(function(t) {
                        var e = t.date.substr(5), o = new Date(t.date.replace(/\-/g, "/")).getDay();
                        return {
                            date: e,
                            fullDate: t.date,
                            week: a[o]
                        };
                    });
                    e.setData({
                        doctorListFilterByDate: t.items,
                        dateList: o
                    });
                }
                e.setData({
                    scheduleLoading: !1
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    getDoctor: function() {
        var t = this;
        t.setData({
            doctorLoading: !0
        }), wx.showLoading({
            title: "加载中"
        }), a.requestH5api({
            url: "/doctor/doctorsearch/list.json",
            data: {
                department: t.data.deptId,
                pageSize: 50,
                pageNo: 1,
                sort: "haoyuan",
                contract: 4
            },
            success: function(a) {
                wx.hideLoading(), console.log(a), 0 == a.flag && a.items && (a.items.forEach(function(t) {
                    if (0 == t.score) t.scoreLeft = 0, t.scoreRight = 0, t.noScore = !0; else {
                        var a = t.score.toString().split(".");
                        t.scoreLeft = a[0], t.scoreRight = a[1], t.noScore = !1;
                    }
                }), t.setData({
                    doctorList: a.items
                })), t.setData({
                    doctorLoading: !1
                });
            }
        });
    },
    imgError: function(t) {
        var e = this, o = a.globalData.staticServer + "/img/character/doc-unknow.png";
        e.errImgFun(t, e, o);
    },
    errImgFun: function(t, a, e) {
        var o = e || "https://img.guahao.com/img/character/doc-unknow.png", s = {};
        s[t.target.dataset.errImg] = o, a.setData(s);
    },
    jumpOrderByDate: function(t) {
      console.info(t.currentTarget.dataset.id)
        if (this.authLogin()) {
            var e = t.currentTarget.dataset.id;
            this.setData({
                id: e
            });
            var o = a.globalData.loginInfo.state, s = t.currentTarget.dataset.status;
            if (o) {
                if (10 != s) return;
                this.getConfig(e);
            } else this.setData({
                binding: !0
            });
        }
    },
    cancel: function() {
        this.setData({
            modalType: "",
            invalid: {}
        });
    },
    showModal: function(t) {
        this.setData({
            modalType: t
        });
    },
    getConfig: function(t) {
        var e = this;
        t && (wx.showLoading({
            title: "加载中",
            mask: !0
        }), a.requestH5api({
            url: "/order/orderconfig/getconfig.json",
            data: {
                shiftCaseId: t
            },
            success: function(a) {
                1 == a.flag ? wx.showModal({
                    title: "身份信息未完善",
                    content: "应国家卫计委要求，预约挂号必须进行实名认证，请完善相关信息后再进行操作",
                    confirmText: "去完善",
                    success: function(t) {
                        t.confirm && e.showModal("perfectInfo");
                    }
                }) : wx.navigateTo({
                    url: "/pages/order-info/order-info?shiftCaseId=" + t
                });
            },
            fail: function() {},
            complete: function() {
                wx.hideLoading();
            }
        }));
    },
    validate: function(t) {
        var a = {
            hasError: !1,
            errMsg: ""
        };
        for (var e in t) "" === t[e] && (a[e] = !0, a.hasError = !0, a.errMsg = "请输入正确的姓名、身份证号");
        this.setData({
            invalid: a
        });
    },
    perfectInfoSubmit: function(t) {
        var e = this;
        e.validate(t.detail.value), e.data.invalid.hasError || (e.data.perfectInfo = t.detail.value, 
        a.requestH5api({
            url: "/user/profile/updateinfo.json",
            data: e.data.perfectInfo,
            success: function(t) {
                0 == t.flag ? wx.navigateTo({
                    url: "/pages/order-info/order-info?shiftCaseId=" + e.data.id
                }) : e.setData({
                    "invalid.hasError": !0,
                    "invalid.errMsg": t.message || "系统异常"
                });
            }
        }));
    },
    jumpOrderByDoctor: function(t) {
        if (this.authLogin()) {
            var e = t.currentTarget.dataset;
            a.globalData.loginInfo.state ? wx.navigateTo({
                url: "/pages/select-schedule/select-schedule?doctorId=" + e.id + "&deptId=" + this.data.deptId + "&hospitalId=" + this.data.hospitalId + "&totalOrderCount=" + e.count
            }) : this.setData({
                binding: !0
            });
        }
    },
    onLoad: function(t) {
        this.setData({
            hospitalId: t.hospitalId,
            deptId: t.deptId,
            deptName: t.deptName
        }), wx.setNavigationBarTitle({
            title: t.deptName
        }), this.getSchedule(), this.getDoctor();
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
        var e = this;
        e.setData({
            showError: !1,
            errorMsg: ""
        });
        var o = this.data.mobile, s = a.globalData.loginInfo.smsType, i = t.hexMD5(s + o);
        e.countdown(), wx.request({
            url: a.globalData.mircoServer + "/json/white/mobile/send/" + o + "/" + s + "/" + i,
            method: "GET",
            success: function(t) {
                !1 === t.data.hasError || e.setData({
                    showError: !0,
                    errorMsg: t.data.message || "验证码发送失败，请重试"
                });
            },
            fail: function(t) {
                e.setData({
                    showError: !0,
                    errorMsg: t.data.message || "验证码发送失败，请重试"
                });
            }
        });
    },
    bind:function(){
      var t = this;
      // a.globalData.loginInfo.loginToken = "xxxxxxxxxxx",
         a.globalData.loginInfo.state = !0, 
        t.setData({
           binding: !1,
          showError: !1,
          errorMsg: ""})
    },
    bind1:function() {
        var t = this, 
        e = this.data.mobile, o = this.data.code;


        return "" === e ? (this.setData({
            showError: !0,
            errorMsg: "请输入手机号码"
        }), this) : "" === o ? (this.setData({
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
                mobile: e,
                secret: a.globalData.loginInfo.secret,
                smsCaptcha: o,
                plat: "mircowx"
            },
            success: function(e) {
                !1 === e.data.hasError ? (a.globalData.loginInfo.loginToken = e.data.data.loginToken, 
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
                    errorMsg: e.data.message || "绑定失败，请重试"
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
        var e = setInterval(function() {
            --a ? t.setData({
                sendText: "已发送（" + a + "）"
            }) : (clearInterval(e), t.setData({
                sendText: "重新获取",
                canSendCode: !0,
                isCountDown: !1
            }));
        }, 1e3);
        return e;
    }
});