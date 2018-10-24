var t = require("../../utils/util.js"), a = getApp();

Page({
    data: {
        modalType: "",
        perfectInfo: {
            identityNo: 0,
            name: 0
        },
        invalid: {},
        doctorInfo: {},
        hospDeptId: "127548778252484000",
        doctorId: "127555724717338000",
        hospitalId: "125369370584301000",
        data: [],
        isGtSix: !1,
        shiftLength: 0,
        shiftData: [],
        isShowAllShift: !1,
        expand: {},
        totalOrder: 0,
        stringifiedHospDept: "",
        id: 0,
        hiddenLoading: !0,
        isHasShift: !1,
        getConfigLoading: !1
    },
    onShareAppMessage: function() {
        return {
            title: "挂号平台demo",
            path: "/pages/index/index"
        };
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
    showAllSchedule: function() {
        var t = this;
        t.setData({
            isShowAllShift: !t.data.isShowAllShift
        }), t.filterData();
    },
    yearAction: function(a) {
        return 0 === t.dateDiff("y", new Date(), new Date(a)) ? 0 : 1 === t.dateDiff("y", new Date(), new Date(a)) ? 1 : 2;
    },
    getMonthByMMM: function(a) {
        return {
            0: function(a) {
                return t.formatDate(new Date(a), "MMM");
            },
            1: function(a) {
                return "次年" + t.formatDate(new Date(a), "MMM");
            },
            2: function(a) {
                return t.formatDate(new Date(a), "yy") + "年" + t.formatDate(new Date(a), "MMM");
            }
        }[this.yearAction(a)](a);
    },
    getSchedule: function(e) {
        var i = this;
        i.data.expand[e.hospDeptId] && (i.setData({
            hiddenLoading: !i.data.hiddenLoading
        }), a.requestH5api({
            url: "/order/shiftcase/list.json",
            data: e,
            success: function(a) {
                if (0 == a.flag && a.items && a.items.length > 0) {
                    var e = {}, n = 0;
                    a.items.map(function(a) {
                        e[i.getMonthByMMM(a.shiftDate)] || (e[i.getMonthByMMM(a.shiftDate)] = []);
                        try {
                            a.amItems.map(function(o) {
                                o.shiftDate = a.shiftDate, o.price = (o.price / 100).toFixed(2), o.week = t.formatDate(new Date(a.shiftDate), "E"), 
                                o.interval = +t.dateDiff("d", new Date(), new Date(a.shiftDate)) + 1, o.slot = "上午", 
                                e[i.getMonthByMMM(a.shiftDate)].push(o), n++;
                            });
                        } catch (t) {}
                        try {
                            a.pmItems.map(function(o) {
                                o.shiftDate = a.shiftDate, o.price = (o.price / 100).toFixed(2), o.week = t.formatDate(new Date(a.shiftDate), "E"), 
                                o.interval = +t.dateDiff("d", new Date(), new Date(a.shiftDate)) + 1, o.slot = "下午", 
                                e[i.getMonthByMMM(a.shiftDate)].push(o), n++;
                            });
                        } catch (t) {}
                        try {
                            a.nightItems.map(function(o) {
                                o.shiftDate = a.shiftDate, o.price = (o.price / 100).toFixed(2), o.week = t.formatDate(new Date(a.shiftDate), "E"), 
                                o.interval = +t.dateDiff("d", new Date(), new Date(a.shiftDate)) + 1, o.slot = "晚上", 
                                e[i.getMonthByMMM(a.shiftDate)].push(o), n++;
                            });
                        } catch (t) {}
                    });
                    var o = [];
                    for (var s in e) e.hasOwnProperty(s) && o.push({
                        month: s === t.formatDate(new Date(), "MMM") ? "本月" : s,
                        items: e[s]
                    });
                    var d = [];
                    o.map(function(t) {
                        d.push.apply(d, t.items);
                    }), function(t) {
                        i.setData({
                            isHasShift: t.some(function(t) {
                                return 1 == t.extraState;
                            })
                        });
                    }(d), i.setData({
                        data: o,
                        shiftLength: n
                    });
                } else i.setData({
                    data: [],
                    shiftLength: 0
                });
                i.filterData();
            },
            complete: function() {
                i.setData({
                    hiddenLoading: !i.data.hiddenLoading
                });
            }
        }));
    },
    filterData: function() {
        var t = this, a = 0, e = [], i = t.data.shiftLength > 6;
        t.data.isShowAllShift ? t.data.data.map(function(t, a) {
            e[a] || (e[a] = {
                month: t.month,
                items: []
            }), t.items.map(function(t) {
                e[a].items.push(t);
            });
        }) : t.data.data.map(function(i, n) {
            i.items.map(function(o) {
                e[n] || (e[n] = {
                    month: i.month,
                    items: []
                }), t.data.shiftLength > 6 && t.data.isHasShift ? 1 == o.extraState && a++ < 6 && e[n].items.push(o) : a++ < 6 && e[n].items.push(o);
            });
        }), t.setData({
            shiftData: e,
            isGtSix: i
        });
    },
    getDoctorInfo: function() {
        var t = this;
        a.requestH5api({
            url: "/doctor/doctordetail/expertinfobyid.json",
            data: {
                doctorId: t.data.doctorId
            },
            success: function(a) {
                if (0 == a.flag) {
                    var e = t.data.deptId, i = t.data.hospitalId;
                    t.data.expand[e] = !t.data.expand[e], t.setData({
                        doctorInfo: a,
                        stringifiedHospDept: JSON.stringify(a.hospitalList),
                        expand: t.data.expand
                    }), e && i && t.getSchedule({
                        hospDeptId: e,
                        doctorId: t.data.doctorId,
                        hospitalId: t.data.hospitalId
                    });
                }
            }
        });
    },
    perfectInfo: function(t) {},
    tapSchedule: function(t) {
        var e = this;
      console.info(e.getConfigLoading+"77");
      // e.getConfigLoading=0;
        if (!e.getConfigLoading) {
          console.info(e.data);
          console.info(t);
            var i = t.currentTarget.dataset, n = i.id, o = i.status, s = i.name, d = i.price, r = i.type;
               if (e.data.id = n, 1 == o) {
            //      e.getConfigLoading = !0, 
            //    wx.showLoading({
            //     title: "加载中",
            //     mask: !0
                
            // }); 
                
                
                  console.info(1111)
                    if (1 == 0) wx.showModal({
                        title: "身份信息未完善",
                        content: "应国家卫计委要求，预约挂号必须进行实名认证，请完善相关信息后再进行操作",
                        confirmText: "去完善",
                        success: function(t) {
                            t.confirm && e.showModal("perfectInfo");
                        }
                    }); else {
                        if (e.data.doctorInfo.hospitalList.length > 1 || e.data.doctorInfo.hospitalList[0].deptList.length > 1) return wx.showModal({
                            title: "提示",
                            content: "该医生目前在多个诊室出诊，您选择的科室是：" + s + "，确定要预约吗？",
                            confirmText: "确认预约",
                            success: function(t) {
                                t.confirm && wx.navigateTo({
                                    url: "/pages/order-info/order-info?shiftCaseId=" + n
                                });
                            }
                        }), void setTimeout(function() {
                            e.getConfigLoading = !1;
                        }, 1e3);
                        n && wx.navigateTo({
                            url: "/pages/order-info/order-info?shiftCaseId=" + n
                        });
                    }
                    e.getConfigLoading = !1;
                
             }
            // if (e.data.id = n, 1 == o) e.getConfigLoading = !0, wx.showLoading({
            //     title: "加载中",
            //     mask: !0
                
            // }), a.requestH5api({
            //     url: "/order/orderconfig/getconfig.json",
                
            //     data: {
            //         shiftCaseId: n
            //     },
                
            //     success: function(t) {
            //       console.info(1111)
            //         if (1 == t.flag) wx.showModal({
            //             title: "身份信息未完善",
            //             content: "应国家卫计委要求，预约挂号必须进行实名认证，请完善相关信息后再进行操作",
            //             confirmText: "去完善",
            //             success: function(t) {
            //                 t.confirm && e.showModal("perfectInfo");
            //             }
            //         }); else {
            //             if (e.data.doctorInfo.hospitalList.length > 1 || e.data.doctorInfo.hospitalList[0].deptList.length > 1) return wx.showModal({
            //                 title: "提示",
            //                 content: "该医生目前在多个诊室出诊，您选择的科室是：" + s + "，确定要预约吗？",
            //                 confirmText: "确认预约",
            //                 success: function(t) {
            //                     t.confirm && wx.navigateTo({
            //                         url: "/pages/order-info/order-info?shiftCaseId=" + n
            //                     });
            //                 }
            //             }), void setTimeout(function() {
            //                 e.getConfigLoading = !1;
            //             }, 1e3);
            //             n && wx.navigateTo({
            //                 url: "/pages/order-info/order-info?shiftCaseId=" + n
            //             });
            //         }
            //         e.getConfigLoading = !1;
            //     },
            //     fail: function() {
            //       console.info(e.getConfigLoading)
            //         e.getConfigLoading = !1;
            //     },
            //     complete: function() {
            //         wx.hideLoading();
            //     }
            // }); 
            
            else {
                if (!r) return;
                wx.showModal({
                    content: "当前排版不可约,请重新选择 门诊类型: " + r + " 挂号费用: " + d,
                    showCancel: !1,
                    confirmText: "我知道了",
                    success: function(t) {
                        t.confirm && console.log("用户点击确定");
                    }
                });
            }
        }
    },
    expandSchdule: function(t) {
        var a = t.currentTarget.dataset.dept, e = t.currentTarget.dataset.hosp;
        this.data.expand[a] = !this.data.expand[a];
        for (var i in this.data.expand) i != a && (this.data.expand[i] = !1);
        this.setData({
            expand: this.data.expand,
            shiftData: []
        }), this.getSchedule({
            hospDeptId: a,
            doctorId: this.data.doctorId,
            hospitalId: e
        });
    },
    imgError: function(e) {
        var i = this, n = a.globalData.staticServer + "/img/character/doc-unknow.png";
        t.errImgFun(i, e.target.dataset.errImg, n);
    },
    onLoad: function(t) {
        this.setData({
            doctorId: t.doctorId,
            totalOrderCount: t.totalOrderCount,
            deptId: t.deptId,
            hospitalId: t.hospitalId
        }), this.getDoctorInfo();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});