var t = require("../../utils/util.js"), a = require("../../utils/utilMd5.js"), e = getApp();

Page({
    data: {
        address: "全国",
        sortid: "1",
        showHome: !0,
        homePageNo: 1,
        areaId: "all",
        homeHospitalList: [],
        homeloading: !0,
        suggestList: [],
        historyList: [],
        hospitalList: [],
        doctorList: [],
        showHistory: !1,
        showSuggest: !1,
        showResults: !1,
        showDoctor: !1,
        isEmpty: !1,
        loadingHospital: !1,
        loadingDoctor: !1,
        latitude: "",
        longitude: "",
        dpageNo: 1,
        hpageNo: 1,
        q: "",
        iptValue: "",
        showDeleteVal: !1,
        noHospital: !1,
        noDoctor: !1,
        haoyuan: 2,
        binding: !1,
        sendText: "获取验证码",
        canSendCode: !1,
        isCountDown: !1,
        mobile: "",
        code: "",
        showError: !1,
        errorMsg: "",
        entryActivity: {
            x: 320,
            y: 320,
            direction: "all",
            url: "/pages/webview/webview?url=https://hd.guahao.com/n/24270?=xiaochengxu",
            icon: "/imgs/activity-zhongqiu.gif"
        },
        entryShow: !1,
        authModal: !0
    },
    onLoad: function(t) {
        var a = this;
        a.toHome(), a.authLogin();
    },
    onShow: function() {
        var t = this;
        t.getAddress(), t.hideAuthModal();
    },
    onShareAppMessage: function() {
        return {
            title: "挂号平台demo",
            path: "/pages/index/index"
        };
    },
    authLogin: function() {
        var t = this;
        return !!e.globalData.loginInfo.loginToken || (e.loginInit(function() {
            t.showAuthModal();
        }), !1);
    },
    showAuthModal: function() {
        this.setData({
            authModal: !0
        });
    },
    hideAuthModal: function() {
        this.setData({
            authModal: !1
        });
    },
    bindGetUserInfo: function(t) {
        t && t.detail && "getUserInfo:ok" == t.detail.errMsg && e.wyLogin(t.detail);
    },
    sort: function(t) {
        var a = this, e = t.currentTarget.dataset.sortid;
        a.setData({
            sortid: e
        }), a.getHospitals();
    },
    getHospitals: function() {
        var t = this;
        t.setData({
            homeHospitalList: [],
            homePageNo: 1,
            homeloading: !0
        });
        var a = "default";
        "2" == t.data.sortid ? a = "distance" : "3" == t.data.sortid && (a = "order"), e.requestH5api({
            url: e.globalData.haServer + "/hospital/hospitalsearch/list.json",
            data: {
                pageNo: t.data.homePageNo,
                pageSize: 10,
                area: t.data.areaId,
                latitude: t.data.latitude,
                longitude: t.data.longitude,
                sort: a,
                haoyuan: t.data.haoyuan
            },
            success: function(a) {
                if (a && "0" == a.flag && a.items.length > 0) {
                    for (var e = a.items, o = e.length, s = 0; s < o; s++) {
                        var i = e[s].orderCount;
                        i = i > 1e4 ? (i / 1e4).toFixed(1) + "万" : i, e[s].orderCount = i;
                        var r = e[s].featureDeptList || [];
                        r = r.length > 2 ? r.slice(0, 2) : r, e[s].featureDeptList = r;
                    }
                    t.setData({
                        homeHospitalList: e,
                        homeloading: !1
                    });
                } else console.log("首页数据请求失败");
            },
            fail: function(t) {
                console.log("首页数据请求失败！");
            },
            complete: function() {
                t.setData({
                    homeloading: !1
                });
            }
        });
    },
    getAddress: function() {
        var t = this;
        e.getAddress(function(a) {
            var e = a.areaName, o = a.provinceName, s = a.areaId;
            (s = "all" === s ? "" : s) !== t.data.areaId && (t.setData({
                latitude: a.latitude,
                longitude: a.longitude,
                address: "不限" == e ? o : e,
                areaId: s
            }), t.getHospitals());
        });
    },
    toSearch: function() {
        this.setData({
            showHome: !1
        }), this.showHistory();
    },
    toHome: function() {
        this.setData({
            showHome: !0
        }), this.clearSearch();
    },
    clearSearch: function() {
        this.setData({
            suggestList: [],
            historyList: [],
            hospitalList: [],
            doctorList: [],
            showHistory: !1,
            showSuggest: !1,
            showResults: !1,
            showDoctor: !1,
            isEmpty: !1,
            loadingHospital: !1,
            loadingDoctor: !1,
            dpageNo: 1,
            hpageNo: 1,
            q: "",
            iptValue: "",
            showDeleteVal: !1,
            noHospital: !1,
            noDoctor: !1
        });
    },
    searchInput: function(t) {
        var a = this, o = t.detail.value;
        a.setData({
            showSuggest: !0,
            showResults: !1,
            isEmpty: !1
        }), "" === o ? (a.setData({
            suggestList: [],
            showSuggest: !1,
            showDeleteVal: !1
        }), a.showHistory()) : (a.setData({
            showDeleteVal: !0
        }), e.requestH5api({
            url: e.globalData.haServer + "/common/searchsuggest/list.json",
            data: {
                q: o,
                limit: 10,
                type: "doctor,hospital",
                area: a.data.areaId
            },
            success: function(t) {
                t && "0" == t.flag && t.items ? a.setData({
                    suggestList: t.items,
                    showHistory: !1
                }) : console.log("提示语请求失败");
            },
            fail: function(t) {
                console.log("提示语请求失败!" + t);
            }
        }));
    },
    deleteVal: function() {
        this.setData({
            iptValue: "",
            suggestList: [],
            showSuggest: !1,
            showResults: !1,
            showDeleteVal: !1
        }), this.showHistory();
    },
    searchFocus: function(t) {
        "" !== t.detail.value && this.setData({
            showDeleteVal: !0
        });
    },
    searchConfirm: function(t) {
        var a = t.detail.value;
        if ("" == a) return this;
        this.onSearch(a);
    },
    showHistory: function() {
        var t = this;
        try {
            var a = wx.getStorageSync("search-history");
            a ? t.setData({
                historyList: a,
                showHistory: !0
            }) : t.setData({
                historyList: [],
                showHistory: !1
            });
        } catch (t) {}
    },
    clearHistory: function() {
        var t = this;
        wx.removeStorage({
            key: "search-history",
            success: function(a) {
                t.showHistory();
            }
        });
    },
    setHistory: function(t) {
        try {
            var a = wx.getStorageSync("search-history");
            if (a) {
                for (var e = a.length, o = 0; o < e; o++) if (a[o] == t) {
                    a.splice(o, 1);
                    break;
                }
                a.length >= 10 && a.pop(), a.unshift(t);
            } else a = [ t ];
            wx.setStorage({
                key: "search-history",
                data: a
            });
        } catch (t) {}
    },
    onHistory: function(t) {
        var a = t.currentTarget.dataset.name;
        if ("" == a) return this;
        this.setData({
            iptValue: a
        }), this.onSearch(a);
    },
    onSuggest: function(t) {
        var a = t.currentTarget.dataset.name;
        if ("" == a) return this;
        this.setData({
            iptValue: a
        }), this.onSearch(a);
    },
    onSearch: function(t) {
        var a = this;
        a.setData({
            q: t,
            dpageNo: 1,
            hpageNo: 1
        }), a.doSearch(t), a.setHistory(t);
    },
    doSearch: function(t) {
        function a() {
            s.setData({
                doctorList: [],
                loadingDoctor: !1,
                noDoctor: !0
            }), 2 === ++r && s.setData({
                isEmpty: !0
            });
        }
        function o() {
            s.setData({
                hospitalList: [],
                loadingHospital: !1,
                noHospital: !0
            }), 2 === ++r && s.setData({
                isEmpty: !0
            });
        }
        var s = this, i = s.data.areaId;
        s.setData({
            showHistory: !1,
            showSuggest: !1,
            showResults: !0,
            isEmpty: !1,
            loadingHospital: !0,
            loadingDoctor: !0,
            hospitalList: [],
            doctorList: [],
            noHospital: !1,
            noDoctor: !1,
            areaId: i
        }), e.requestH5api({
            url: e.globalData.haServer + "/common/keywordanalysis/detail.json",
            data: {
                q: t
            },
            success: function(t) {
                t && "0" == t.flag && t.item ? "doctor" === t.item.type ? s.setData({
                    showDoctor: !0
                }) : s.setData({
                    showDoctor: !1
                }) : console.log("关键词分析失败");
            },
            fail: function(t) {
                console.log("关键词分析失败!");
            }
        });
        var r = 0, n = s.data.dpageNo;
        e.requestH5api({
            url: e.globalData.haServer + "/doctor/doctorsearch/list.json",
            data: {
                q: t,
                pageNo: n,
                pageSize: 10,
                area: i,
                sort: "haoyuan",
                contract: 4
            },
            success: function(t) {
                if (t && "0" == t.flag) if (t.items && t.items.length > 0) {
                    for (var e = t.items, o = e.length, i = 0; i < o; i++) {
                        e[i].hospitalDep = e[i].hospitalName + "  " + e[i].departmentName;
                        var r = e[i].score;
                        if ("0" == r) e[i].noScore = !0; else {
                            var n = (r = r.toString()).split(".");
                            e[i].scoreLeft = n[0], e[i].scoreRight = n[1] ? n[1] : "0", e[i].noScore = !1;
                        }
                    }
                    s.setData({
                        doctorList: e,
                        loadingDoctor: !1
                    });
                } else a(); else console.log("请求医生失败"), a();
            },
            fail: function(t) {
                console.log("请求医生失败!"), a();
            }
        });
        var l = s.data.hpageNo;
        e.requestH5api({
            url: e.globalData.haServer + "/hospital/hospitalsearch/list.json",
            data: {
                q: t,
                pageNo: l,
                pageSize: 10,
                longitude: s.data.longitude,
                latitude: s.data.latitude,
                area: i,
                haoyuan: s.data.haoyuan
            },
            success: function(t) {
                if (t && "0" == t.flag) if (t.items && t.items.length > 0) {
                    for (var a = t.items, e = a.length, i = 0; i < e; i++) {
                        var r = a[i].orderCount;
                        r = r > 1e4 ? (r / 1e4).toFixed(1) + "万" : r, a[i].orderCount = r;
                        var n = a[i].featureDeptList || [];
                        n = n.length > 2 ? n.slice(0, 2) : n, a[i].featureDeptList = n;
                    }
                    s.setData({
                        hospitalList: a,
                        loadingHospital: !1
                    });
                } else o(); else console.log("请求医院失败"), o();
            },
            fail: function(t) {
                console.log("请求医院失败!"), o();
            }
        });
    },
    onTab: function(t) {
        var a = this;
        "0" == t.currentTarget.dataset.rtype ? a.setData({
            showDoctor: !1
        }) : a.setData({
            showDoctor: !0
        });
    },
    onReachBottom: function() {
        this.data.showHome ? this.moreHomeHospital() : this.data.showDoctor ? this.moreDoctor() : this.moreHospital();
    },
    moreHomeHospital: function() {
        var t = this, a = t.data.homePageNo, e = t.data.homeHospitalList;
        a++;
        t.setData({
            homePageNo: a,
            homeloading: !0
        });
        var o = "default";
        "2" == t.data.sortid ? o = "distance" : "3" == t.data.sortid && (o = "order"), this.requestMore("/hospital/hospitalsearch/list.json", a, t.data.haoyuan, o, function(a) {
            if (a.items && a.items.length > 0) {
                for (var o = a.items, s = o.length, i = 0; i < s; i++) {
                    var r = o[i].orderCount;
                    r = r > 1e4 ? (r / 1e4).toFixed(1) + "万" : r, o[i].orderCount = r;
                    var n = o[i].featureDeptList || [];
                    n = n.length > 2 ? n.slice(0, 2) : n, o[i].featureDeptList = n;
                }
                t.setData({
                    homeHospitalList: e.concat(o)
                });
            }
            t.setData({
                homeloading: !1
            });
        });
    },
    moreHospital: function() {
        var t = this, a = t.data.hpageNo, e = t.data.hospitalList;
        a++;
        t.setData({
            hpageNo: a,
            loadingHospital: !0
        }), this.requestMore("/hospital/hospitalsearch/list.json", a, t.data.haoyuan, "", function(a) {
            if (a.items && a.items.length > 0) {
                for (var o = a.items, s = o.length, i = 0; i < s; i++) {
                    var r = o[i].orderCount;
                    r = r > 1e4 ? (r / 1e4).toFixed(1) + "万" : r, o[i].orderCount = r;
                    var n = o[i].featureDeptList || [];
                    n = n.length > 2 ? n.slice(0, 2) : n, o[i].featureDeptList = n;
                }
                t.setData({
                    hospitalList: e.concat(o)
                });
            }
            t.setData({
                loadingHospital: !1
            });
        });
    },
    moreDoctor: function() {
        var t = this, a = t.data.dpageNo, e = t.data.doctorList;
        a++;
        t.setData({
            dpageNo: a,
            loadingDoctor: !0
        }), this.requestMore("/doctor/doctorsearch/list.json", a, "", "", function(a) {
            if (a.items && a.items.length > 0) {
                for (var o = a.items, s = o.length, i = 0; i < s; i++) {
                    o[i].hospitalDep = o[i].hospitalName + o[i].departmentName;
                    var r = o[i].score;
                    if ("0" == r) o[i].noScore = !0; else {
                        var n = (r = r.toString()).split(".");
                        o[i].scoreLeft = n[0], o[i].scoreRight = n[1] ? n[1] : "0", o[i].noScore = !1;
                    }
                }
                t.setData({
                    doctorList: e.concat(o)
                });
            }
            t.setData({
                loadingDoctor: !1
            });
        });
    },
    requestMore: function(t, a, o, s, i) {
        var r = this, n = r.data.q, l = r.data.areaId, h = o;
        e.requestH5api({
            url: e.globalData.haServer + t,
            data: {
                q: n,
                pageNo: a,
                pageSize: 10,
                longitude: r.data.longitude,
                latitude: r.data.latitude,
                area: l,
                haoyuan: h,
                sort: s || "default"
            },
            success: function(t) {
                t && t && "0" == t.flag ? "function" == typeof i && i(t) : console.log("请求失败");
            },
            fail: function(t) {
                console.log("请求失败!");
            }
        });
    },
    imgError: function(a) {
        var o = this, s = e.globalData.staticServer + "/img/character/doc-unknow.png";
        t.errImgFun(o, a.target.dataset.errImg, s);
    },
    hospitalImgError: function(a) {
        var o = this, s = e.globalData.staticServer + "/img/character/hos.png";
        o.data.showHome ? t.errImgFun(o, a.target.dataset.homeErrImg, s) : t.errImgFun(o, a.target.dataset.errImg, s);
    },
    jumpOrderByDoctor: function(t) {
        if (this.authLogin()) {
            var a = t.currentTarget.dataset;
            e.globalData.loginInfo.state ? wx.navigateTo({
                url: "/pages/select-schedule/select-schedule?doctorId=" + a.id + "&deptId=" + a.departmentid + "&hospitalId=" + a.hospitalid + "&totalOrderCount=" + a.count
            }) : this.setData({
                binding: !0
            });
        }
    },
    toHospitalPage: function(t) {
        var a = t.currentTarget.dataset.hospitalId, e = t.currentTarget.dataset.name;
        wx.navigateTo({
            url: "../dept-switch/dept-switch?hospitalId=" + a + "&name=" + e
        });
    },
    closebind: function() {
        this.setData({
            binding: !1,
            showError: !1,
            errorMsg: ""
        });
    },
    mobileIpt: function(t) {
        var a = t.detail.value;
        this.setData({
            mobile: a
        }), 11 !== a.length || this.data.isCountDown ? this.setData({
            canSendCode: !1
        }) : this.setData({
            canSendCode: !0
        });
    },
    codeIpt: function(t) {
        var a = t.detail.value;
        this.setData({
            code: a
        });
    },
    sendcode: function() {
        if (!this.data.canSendCode) return !1;
        var t = this;
        t.setData({
            showError: !1,
            errorMsg: ""
        });
        var o = this.data.mobile, s = e.globalData.loginInfo.smsType, i = a.hexMD5(s + o);
        t.countdown(), wx.request({
            url: e.globalData.mircoServer + "/json/white/mobile/send/" + o + "/" + s + "/" + i,
            method: "GET",
            success: function(a) {
                !1 === a.data.hasError || t.setData({
                    showError: !0,
                    errorMsg: a.data.message || "验证码发送失败，请重试"
                });
            },
            fail: function(a) {
                t.setData({
                    showError: !0,
                    errorMsg: a.data.message || "验证码发送失败，请重试"
                });
            }
        });
    },
    bind: function() {
        var t = this, a = this.data.mobile, o = this.data.code;
        return "" === a ? (this.setData({
            showError: !0,
            errorMsg: "请输入手机号码"
        }), this) : "" === o ? (this.setData({
            showError: !0,
            errorMsg: "请输入验证码"
        }), this) : (this.setData({
            showError: !1,
            errorMsg: ""
        }), void wx.request({
            url: e.globalData.psServer + "/json/white/miniprogrom/bind",
            method: "GET",
            header: {
                appid: "mini-app"
            },
            data: {
                mobile: a,
                secret: e.globalData.loginInfo.secret,
                smsCaptcha: o,
                plat: "mircowx"
            },
            success: function(a) {
                !1 === a.data.hasError ? (e.globalData.loginInfo.loginToken = a.data.data.loginToken, 
                e.globalData.loginInfo.state = !0, t.setData({
                    binding: !1,
                    showError: !1,
                    errorMsg: ""
                }), wx.showToast({
                    title: "绑定成功",
                    icon: "success",
                    duration: 2e3
                })) : t.setData({
                    showError: !0,
                    errorMsg: a.data.message || "绑定失败，请重试"
                });
            },
            fail: function() {
                t.setData({
                    showError: !0,
                    errorMsg: res.data.message || "绑定失败，请重试"
                });
            }
        }));
    },
    countdown: function() {
        var t = this, a = 60;
        t.setData({
            sendText: "已发送（" + a + "）",
            canSendCode: !1,
            isCountDown: !0
        });
        var e = setInterval(function() {
            --a ? t.setData({
                sendText: "已发送（" + a + "）"
            }) : (clearInterval(e), t.setData({
                sendText: "重新获取",
                canSendCode: !0,
                isCountDown: !1
            }));
        }, 1e3);
        return e;
    }
});