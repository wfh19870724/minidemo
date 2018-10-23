var e = require("../../utils/util.js"), a = getApp();

Page({
    data: {
        isCancel: !1,
        isEvaluate: !1,
        item: {},
        orderid: "",
        loading: !0,
        payType: "alipay"
    },
    onLoad: function(e) {
        var a = e.id;
        this.getDetail(a), this.setData({
            orderid: a
        });
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/index/index"
        };
    },
    getDetail: function(t) {
        var i = this;
        this.setData({
            loading: !0
        }), a.requestH5api({
            url: a.globalData.haServer + "/order/orderinfo/mergedetail.json",
            data: {
                bizId: t,
                bizCode: 1
            },
            success: function(a) {
                if (a && "0" == a.flag && a) {
                    var t = a, s = t.clinicFee;
                    s = e.accMul(s, .01), t.clinicFee = s;
                    var o = t.cardNo;
                    o = o.replace(/(\d{4})\d{10}(\d{4})/, "$1**********$2"), t.cardNo = o;
                    var n = t.mobile;
                    n = n.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"), t.mobile = n, i.setData({
                        item: t,
                        loading: !1
                    });
                    var d = t.orderStatus;
                    0 == d || 1 == d ? i.setData({
                        isCancel: !0
                    }) : i.setData({
                        isCancel: !1
                    }), 2 == d ? i.setData({
                        isEvaluate: !0
                    }) : i.setData({
                        isEvaluate: !1
                    });
                } else console.log("订单数据请求失败");
            },
            fail: function(e) {
                console.log("订单数据请求失败！");
            }
        });
    },
    cancel: function() {
        var e = this;
        wx.showActionSheet({
            itemList: [ "查看预约规则（取消过多将无法预约）", "取消预约" ],
            success: function(a) {
                if (console.log(a.tapIndex), 0 === a.tapIndex) {
                    var t = [ {
                        hospitalId: e.data.item.hospitalId,
                        hospitalName: e.data.item.hospitalName,
                        deptList: [ {
                            deptId: e.data.item.hospDeptId,
                            deptName: e.data.item.hospDeptName
                        } ]
                    } ];
                    t = JSON.stringify(t), wx.navigateTo({
                        url: "/pages/order-rule2/order-rule2"
                    });
                } else 1 === a.tapIndex && e.doCancel();
            }
        });
    },
    doCancel: function() {
        var e = this, t = this.data.orderid;
        if (!t) return this;
        a.requestH5api({
            url: a.globalData.haServer + "/order/cancelorder/cancel.json",
            data: {
                orderNo: t
            },
            success: function(a) {
                a && "0" == a.flag ? wx.showToast({
                    title: "预约已取消",
                    icon: "success",
                    duration: 2e3,
                    success: function() {
                        e.getDetail(t);
                    }
                }) : a && "1" == a.flag ? wx.showToast({
                    title: a.message || "订单不存在"
                }) : wx.showToast({
                    title: a.message || "取消失败"
                });
            },
            fail: function(e) {
                console.log("取消失败！");
            }
        });
    },
    evaluate: function() {
        var e = this;
        wx.showActionSheet({
            itemList: [ "我已就诊", "我未就诊" ],
            success: function(a) {
                if (console.log(a.tapIndex), 0 === a.tapIndex) {
                    var t = "";
                    e.data.item.mainSuit && e.data.item.mainSuit.diseaseName && (t = e.data.item.mainSuit.diseaseName), 
                    wx.navigateTo({
                        url: "/pages/share-comment/share-comment?id=" + e.data.orderid + "&diseaseName=" + (t || "尚未确诊") + "&visitType=" + (e.data.item.visitType || "")
                    });
                } else 1 === a.tapIndex && wx.navigateTo({
                    url: "/pages/unvisit/unvisit?id=" + e.data.orderid
                });
            }
        });
    }
});