var e = require("../../utils/util.js"), t = getApp();

Page({
    data: {
        orderState: "",
        orderNo: "",
        item: {}
    },
    onLoad: function(e) {
        var t = e.orderState, a = e.orderNo, r = e.message;
        this.setData({
            orderState: t,
            orderNo: a,
            message: r
        }), this.getDetail(a);
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/index/index"
        };
    },
    getDetail: function(a) {
        var r = this;
        t.requestH5api({
            url: t.globalData.haServer + "/order/orderinfo/mergedetail.json",
            data: {
                bizId: a,
                bizCode: 1
            },
            success: function(t) {
                if (t && "0" == t.flag && t) {
                    var a = t, i = a.clinicFee;
                    i = e.accMul(i, .01), a.clinicFee = i, r.setData({
                        item: a
                    });
                } else console.log("订单数据请求失败");
            },
            fail: function(e) {
                console.log("订单数据请求失败！");
            }
        });
    },
    checkOrder: function() {
        wx.reLaunch({
            url: "/pages/my/my"
        });
    },
    backHome: function() {
        wx.reLaunch({
            url: "/pages/index/index"
        });
    }
});