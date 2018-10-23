var t = getApp();

Page({
    data: {
        hospDeptId: "127548778252484000",
        doctorId: "127555724717338000",
        hospitalId: "125369370584301000",
        ruleitems: [],
        hospDept: [],
        expand: {}
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/index/index"
        };
    },
    getRule: function(e) {
        var a = this;
        t.requestH5api({
            url: "/order/shiftcase/rules.json",
            data: e,
            success: function(t) {
                console.log(t), 0 == t.flag && a.setData({
                    ruleitems: t.items
                });
            }
        });
    },
    expandRule: function(t) {
        var e = t.currentTarget.dataset.dept, a = t.currentTarget.dataset.hosp;
        this.data.expand[e] = !this.data.expand[e];
        for (var o in this.data.expand) o != e && (this.data.expand[o] = !1);
        this.setData({
            expand: this.data.expand,
            ruleitems: []
        }), this.getRule({
            hospDeptId: e,
            doctorId: this.data.doctorId,
            hospitalId: a
        });
    },
    onLoad: function(t) {
        this.setData({
            hospDept: JSON.parse(t.hospDept),
            doctorId: t.doctorId
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});