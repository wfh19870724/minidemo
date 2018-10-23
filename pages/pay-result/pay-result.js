var a = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        orderid: "",
        orderState: "",
        item: {},
        loading: !0
    },
    onLoad: function(a) {
        var e = a.id, t = a.orderState;
        this.setData({
            orderState: t,
            orderid: e
        }), this.getDetail(e);
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/index/index"
        };
    },
    repay: function() {
        var a = this.data.orderid, t = "", i = this;
        wx.showLoading({
            title: "加载中"
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
                    console.log("开始请求payUrl：" + o), wx.request({
                        url: o,
                        method: "GET",
                        success: function(a) {
                            var t = a.data.nonceStr, i = a.data.timeStamp, o = a.data.package, n = a.data.signType, r = a.data.paySign;
                            console.log("成功获取支付参数"), wx.requestPayment({
                                timeStamp: i,
                                nonceStr: t,
                                package: o,
                                signType: n,
                                paySign: r,
                                success: function(a) {
                                    e.setData({
                                        orderState: 1
                                    }), e.getDetail(e.data.orderid);
                                },
                                fail: function(a) {
                                    "requestPayment:fail cancel" == a.errMsg ? wx.hideLoading ? wx.hideLoading() : wx.hideToast() : e.payFail();
                                }
                            });
                        },
                        fail: function(a) {
                            console.log("失败获取支付参数：" + a + "," + a.mesage), e.payFail();
                        }
                    });
                }
            }
        });
    },
    payFail: function() {
        wx.hideLoading();
    },
    getDetail: function(t) {
        var i = this;
        e.requestH5api({
            url: e.globalData.haServer + "/order/orderinfo/mergedetail.json",
            data: {
                bizId: t,
                bizCode: 1
            },
            success: function(e) {
                if (e && "0" == e.flag && e) {
                    var t = e, o = t.clinicFee;
                    o = a.accMul(o, .01), t.clinicFee = o, i.setData({
                        item: t,
                        loading: !1
                    });
                } else console.log("订单数据请求失败");
            },
            fail: function(a) {
                console.log("订单数据请求失败！");
            }
        });
    },
    checkOrder: function() {
        wx.reLaunch ? wx.reLaunch({
            url: "/pages/my/my"
        }) : wx.navigateBack({
            delta: 5
        });
    }
});