var a = getApp();

Page({
    data: {
        provinceArray: [ {
            provinceId: "all",
            provinceName: "全国",
            areas: [ {
                areaId: "all",
                areaName: "不限",
                parentId: "all"
            } ]
        } ],
        cityArray: [],
        selectProvinceId: "",
        selectProvinceName: "",
        selectCityId: "",
        autoCityId: ""
    },
    onLoad: function(e) {
        var t = this;
        a.requestH5api({
            url: a.globalData.haServer + "/common/area/allarealist.json",
            success: function(a) {
                if (a && "0" == a.flag) {
                    for (var e = a.provinces, r = e.length, o = 0; o < r; o++) e[o].areas.unshift({
                        areaId: e[o].provinceId,
                        areaName: "不限",
                        parentId: e[o].provinceId
                    });
                    t.setData({
                        provinceArray: t.data.provinceArray.concat(a.provinces)
                    }), t.autoAddress();
                } else console.log("省市数据请求失败");
            },
            fail: function(a) {
                console.log("省市数据请求失败！");
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/index/index"
        };
    },
    autoAddress: function() {
        var e = this;
        a.getAddress(function(a) {
            var t = a.provinceId, r = a.provinceName, o = a.areaId, n = (a.areaName, a.autoCityId);
            e.setData({
                selectProvinceId: t,
                selectProvinceName: r,
                cityArray: e.getProvince(t).areas,
                selectCityId: o,
                autoCityId: n
            });
        });
    },
    getProvince: function(a) {
        var e = this.data.provinceArray, t = e.length, r = 0;
        for (r = 0; r < t; r++) if (e[r].provinceId == a) return e[r];
        return null;
    },
    chooseProvince: function(a) {
        var e = this, t = a.currentTarget.dataset.id, r = a.currentTarget.dataset.name, o = a.currentTarget.dataset.index;
        console.log(t), e.setData({
            selectProvinceId: t,
            selectProvinceName: r,
            cityArray: e.data.provinceArray[o].areas
        });
    },
    chooseCity: function(e) {
        var t = this, r = e.currentTarget.dataset.id, o = e.currentTarget.dataset.name;
        a.globalData.locationInfo.provinceId = t.data.selectProvinceId, a.globalData.locationInfo.provinceName = t.data.selectProvinceName, 
        a.globalData.locationInfo.areaId = r, a.globalData.locationInfo.areaName = o, a.globalData.locationInfo.setted = !0, 
        wx.navigateBack();
    }
});