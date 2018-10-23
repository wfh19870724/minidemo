var a = getApp();

Page({
    data: {
        items: [ {
            name: "0",
            value: "时间冲突了"
        }, {
            name: "1",
            value: "忘记了"
        }, {
            name: "2",
            value: "其它",
            checked: "true"
        } ],
        reason: "其它",
        radioType: 2,
        id: ""
    },
    onLoad: function(a) {
        var e = a.id;
        this.setData({
            id: e
        });
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/index/index"
        };
    },
    radioChange: function(a) {
        var e = a.detail.value;
        this.setData({
            radioType: e,
            reason: this.data.items[e].value
        });
    },
    formSubmit: function(e) {
        var t = e.detail.value.textreason;
        if (2 == this.data.radioType && "" === t) return wx.showToast({
            icon: "none",
            title: "请输入您未就诊的原因",
            duration: 2e3
        }), this;
        var i = this.data.id, o = this.data.reason;
        a.requestH5api({
            url: a.globalData.haServer + "/comment/ordercomment/save.json",
            data: {
                orderNo: i,
                hasVisit: 2,
                reason: o,
                content: t
            },
            success: function(a) {
                a && "0" == a.flag ? wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    duration: 2e3
                }) : wx.showToast({
                    icon: "none",
                    title: a.message || "提交失败"
                });
            },
            fail: function(a) {
                console.log("取消失败！");
            }
        });
    }
});