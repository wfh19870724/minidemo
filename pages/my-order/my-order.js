var a = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        pageno: 1,
        orderList: [],
        loading: !0,
        empty: !1,
        allLoaded: !1
    },
    onShow: function(a) {
        this.setData({
            pageno: 1,
            orderList: [],
            loading: !0,
            empty: !1
        }), this.getlist(1);
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/index/index"
        };
    },
    getlist: function(t) {
        var i = this;
        e.requestH5api({
            url: e.globalData.haServer + "/order/orderinfo/list.json",
            data: {
                pageNo: t,
                pageSize: 10
            },
            success: function(e) {
                if (e && "0" == e.flag && e.items) {
                    var t, r = e.items, o = r.length;
                    for (t = 0; t < o; t++) {
                        var n = r[t].clinicFee;
                        n = a.accMul(n, .01), r[t].clinicFee = n;
                    }
                    i.setData({
                        orderList: i.data.orderList.concat(r)
                    });
                } else console.log("订单数据请求失败");
                e.pageNo && e.pageSize && e.pageNo >= e.pageSize && i.setData({
                    allLoaded: !0
                });
            },
            fail: function(a) {
                console.log("订单数据请求失败！");
            },
            complete: function() {
                i.setData({
                    loading: !1
                }), 0 === i.data.orderList.length && i.setData({
                    empty: !0
                });
            }
        });
    },
    lower: function(a) {
        if (this.data.allLoaded) return this;
        var e = this.data.pageno;
        e++, this.setData({
            pageno: e,
            loading: !0
        }), this.getlist(e);
    },
    toDetail: function(a) {
        "待支付" == a.currentTarget.dataset.state ? wx.navigateTo({
            url: "/pages/order-pay/order-pay?id=" + a.currentTarget.dataset.orderno
        }) : wx.navigateTo({
            url: "/pages/order-detail/order-detail?id=" + a.currentTarget.dataset.orderno
        });
    },
    tocomment: function(a) {
        var e = a.currentTarget.dataset.orderno, t = a.currentTarget.dataset.diseasename, i = a.currentTarget.dataset.visit;
        wx.navigateTo({
            url: "/pages/share-comment/share-comment?id=" + e + "&diseasename=" + t + "&visitTypeDesc=" + i
        });
    },
    imgError: function(t) {
        var i = this, r = e.globalData.staticServer + "/img/character/doc-unknow.png";
        a.errImgFun(i, t.target.dataset.errImg, r);
    },
    topay: function(a) {
        var t = a.currentTarget.dataset.orderno;
        this.data.orderid = t;
        var i = "", r = this;
        wx.showLoading ? wx.showLoading({
            title: "加载中"
        }) : wx.showToast({
            title: "加载中",
            icon: "loading"
        }), e.requestH5api({
            url: e.globalData.haServer + "/pay/geth5payurl.json",
            data: {
                orderNo: t,
                type: 0
            },
            success: function(a) {
                a && "0" == a.flag ? (i = a.payUrl, r.getProps(i)) : r.payFail();
            },
            fail: function(a) {
                r.payFail();
            }
        });
    },
    getProps: function(a) {
        var e = this;
        wx.login({
            success: function(t) {
                if (t.code) {
                    var i = t.code, r = a + "&code=" + i + "&appid=wxd8cafd9679001a38";
                    wx.request({
                        url: r,
                        method: "GET",
                        success: function(a) {
                            var t = a.data.nonceStr, i = a.data.timeStamp, r = a.data.package, o = a.data.signType, n = a.data.paySign;
                            wx.requestPayment({
                                timeStamp: i,
                                nonceStr: t,
                                package: r,
                                signType: o,
                                paySign: n,
                                success: function(a) {
                                    wx.hideLoading ? wx.hideLoading() : wx.hideToast(), wx.navigateTo({
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
        wx.hideLoading ? wx.hideLoading() : wx.hideToast(), wx.navigateTo({
            url: "/pages/pay-result/pay-result?id=" + a.data.orderid + "&orderState=2"
        });
    }
});