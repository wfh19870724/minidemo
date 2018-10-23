var a = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        timeout: "",
        item: {},
        orderid: "",
        loading: !0,
        timeouted: !1
    },
    onLoad: function(a) {
        var e = a.id;
        this.setData({
            orderid: e
        });
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/index/index"
        };
    },
    getDetail: function() {
        var t = this.data.orderid, i = this;
        e.requestH5api({
            url: e.globalData.haServer + "/order/orderinfo/mergedetail.json",
            data: {
                bizId: t,
                bizCode: 1
            },
            success: function(e) {
                if (e && "0" == e.flag && e) {
                    var t = e, o = t.clinicFee;
                    o = a.accMul(o, .01), t.clinicFee = o;
                    var r = t.expire, n = t.cardNo;
                    n = n.replace(/(\d{4})\d{10}(\d{4})/, "$1**********$2"), t.cardNo = n;
                    var d = t.mobile;
                    d = d.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"), t.mobile = d, i.setData({
                        item: t,
                        loading: !1
                    });
                    var s = t.orderStatus;
                    1 != s && 2 != s && 3 != s && 5 != s || i.setData({
                        isCancel: !0
                    }), 4 == s && i.setData({
                        isEvaluate: !0
                    }), i.countDown(r, t.serverTime, t.createdTime);
                } else console.log("订单数据请求失败");
            },
            fail: function(a) {
                console.log("订单数据请求失败！");
            }
        });
    },
    pay: function() {
        var a = this.data.orderid, t = "", i = this;
        wx.showLoading ? wx.showLoading({
            title: "加载中"
        }) : wx.showToast({
            title: "加载中",
            icon: "loading"
        }), e.requestH5api({
            url: e.globalData.haServer + "/pay/geth5payurl.json",
            data: {
                orderNo: a,
                type: 0
            },
            success: function(a) {
                a && "0" == a.flag ? (t = a.payUrl, i.getProps(t)) : i.payFail();
            },
            fail: function(a) {
                i.payFail();
            }
        });
    },
    getProps: function(a) {
        var e = this;
        wx.login({
            success: function(t) {
                if (t.code) {
                    var i = t.code, o = a + "&code=" + i + "&appid=wxd8cafd9679001a38";
                    wx.request({
                        url: o,
                        method: "GET",
                        success: function(a) {
                            var t = a.data.nonceStr, i = a.data.timeStamp, o = a.data.package, r = a.data.signType, n = a.data.paySign;
                            wx.requestPayment({
                                timeStamp: i,
                                nonceStr: t,
                                package: o,
                                signType: r,
                                paySign: n,
                                success: function(a) {
                                    wx.hideLoading ? wx.hideLoading() : wx.hideToast(), wx.redirectTo({
                                        url: "/pages/pay-result/pay-result?id=" + e.data.orderid + "&orderState=1"
                                    });
                                },
                                fail: function(a) {
                                    "requestPayment:fail cancel" == a.errMsg ? wx.hideLoading ? wx.hideLoading() : wx.hideToast() : e.payFail();
                                }
                            });
                        },
                        fail: function(a) {
                            e.payFail();
                        }
                    });
                }
            }
        });
    },
    payFail: function() {
        var a = this;
        wx.hideLoading ? wx.hideLoading() : wx.hideToast(), wx.redirectTo({
            url: "/pages/pay-result/pay-result?id=" + a.data.orderid + "&orderState=2"
        });
    },
    formatNewDate: function(a) {
        var e = a.replace(/-/g, ":").replace(" ", ":");
        return e = e.split(":"), e = new Date(e[0], e[1] - 1, e[2], e[3], e[4], e[5]);
    },
    countDown: function(e, t, i) {
        function o() {
            if (s > 0) {
                var a = Math.floor(s % 60), e = Math.floor(s / 60 % 60);
                e <= 9 && (e = "0" + e), a <= 9 && (a = "0" + a), r.setData({
                    timeout: e + ":" + a
                }), s--;
            } else clearInterval(l), r.setData({
                timeouted: !0,
                timeout: "00:00"
            });
        }
        var r = this, n = r.formatNewDate(i), d = r.formatNewDate(t), s = e - a.dateDiff("s", n, d);
        o();
        var l = setInterval(o, 1e3);
    },
    onShow: function() {
        this.setData({
            loading: !0
        }), this.getDetail();
    }
});