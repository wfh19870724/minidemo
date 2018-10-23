var t = getApp();

Page({
    data: {
        deptList: [],
        childDeptList: [],
        selectIndex: 0
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: t.name || ""
        }), this.setData({
            hospitalId: t.hospitalId || "125336754304601000"
        }), this.getDept();
    },
    onShareAppMessage: function() {
        return {
            title: "挂号平台demo",
            path: "/pages/index/index"
        };
    },
    getDept: function() {
        var e = this;
        t.requestH5api({
            url: "/hospital/department/listbyhospitalid.json",
            data: {
                hospitalId: e.data.hospitalId,
                deptHaoYuan: 1
            },
            success: function(t) {
                t && 0 == t.flag && t.depts && t.depts.length > 0 && e.setData({
                    deptList: t.depts,
                    childDeptList: t.depts[0].childs
                });
            }
        });
    },
    chooseDept: function(t) {
        var e = t.currentTarget.dataset.index;
        this.setData({
            childDeptList: this.data.deptList[e].childs,
            selectIndex: e
        });
    },
    chooseChildDept: function(t) {
        var e = this, a = t.currentTarget.dataset.id, s = t.currentTarget.dataset.name;
        wx.navigateTo({
            url: "/pages/search-schedule/search-schedule?hospitalId=" + e.data.hospitalId + "&deptId=" + a + "&deptName=" + s
        });
    }
});