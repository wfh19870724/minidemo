var a = getApp(), t = require("../../utils/util.js");

Page({
    data: {
        starTag: {},
        star: 0,
        tagList: [],
        tagString: {},
        tagLine1: 2,
        tagLine2: 3,
        modalType: "",
        searching: !1,
        diseaseList: [],
        disease: {
            diseaseName: "尚未确诊",
            diseaseId: 0
        },
        formData: {
            orderNo: "",
            hasVisit: 0,
            reason: "初诊",
            content: "",
            diseaseId: null,
            diseaseName: "",
            satisfaction: 0,
            tagIds: ""
        },
        starComment: [ "非常不满意", "不满意", "一般", "满意", "非常满意" ],
        doctorInfo: {},
        defaultComment: "",
        notChange: !0
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/index/index"
        };
    },
    imgError: function(e) {
        var s = this, i = a.globalData.staticServer + "/img/character/doc-unknow.png";
        t.errImgFun(s, e.target.dataset.errImg, i);
    },
    cancel: function() {
        this.setData({
            modalType: ""
        });
    },
    tapDisease: function(a) {
        var t = a.currentTarget.dataset;
        this.setData({
            "disease.diseaseId": t.id,
            "disease.diseaseName": t.name
        }), this.cancel();
    },
    getTagList: function() {
        var t = this;
        a.requestH5api({
            url: "/comment/ordercomment/taglist.json",
            data: {
                tagType: 0
            },
            success: function(a) {
                if (a && 0 == a.flag && a.items) {
                    for (var e = 0; e < a.items.length; e++) t.data.starTag[a.items[e].start] = a.items[e];
                    t.setData({
                        tagList: t.data.starTag[t.data.star] && t.data.starTag[t.data.star].tagList || [],
                        starTag: t.data.starTag
                    });
                }
            }
        });
    },
    choseTag: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id;
        this.data.tagList[t].active = !this.data.tagList[t].active, this.setData({
            tagList: this.data.tagList
        }), this.data.tagString[e] = !this.data.tagString[e], console.log(this.data.tagString);
    },
    tapStar: function(a) {
        var t = a.currentTarget.dataset.index;
        this.data.tagString = {}, this.setData({
            star: t,
            tagList: this.data.starTag[t] && this.data.starTag[t].tagList || [],
            "formData.satisfaction": t
        }), this.data.notChange && this.setData({
            defaultComment: this.data.starTag[t].defaultDesc,
            "formData.content": this.data.starTag[t].defaultDesc
        });
    },
    choseDiseaseInfo: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            tagLine1: t,
            "disease.diseaseId": "",
            "disease.diseaseName": ""
        }), 2 == t && this.setData({
            "disease.diseaseId": "",
            "disease.diseaseName": "尚未确诊"
        });
    },
    choseDisease: function() {
        this.setData({
            modalType: "chose_disease"
        });
    },
    chosePurpose: function(a) {
        var t = a.currentTarget.dataset.index;
        t != this.data.tagLine2 && (this.setData({
            tagLine2: t
        }), 3 == t && (this.data.formData.reason = "初诊"), 2 == t && (this.data.formData.reason = "复诊"), 
        1 == t && (this.data.formData.reason = ""));
    },
    inputReason: function(a) {
        this.data.formData.reason = a.detail.value;
    },
    inputComment: function(a) {
        this.data.formData.content = a.detail.value, this.data.notChange = !1;
    },
    searchDisease: function(t) {
        var e = this;
        e.data.searching || (e.data.searching = !0, a.requestH5api({
            url: "/common/searchsuggest/list.json",
            data: {
                q: t.detail.value,
                limit: 10,
                type: "disease"
            },
            success: function(a) {
                console.log(a), 0 == a.flag && e.setData({
                    diseaseList: a.items
                });
            },
            complete: function() {
                e.data.searching = !1;
            }
        }));
    },
    commit: function() {
        var t = this, e = [];
        for (var s in t.data.tagString) t.data.tagString[s] && e.push(s);
        t.data.formData.tagIds = e.join(","), t.data.formData.diseaseId = t.data.disease.diseaseId, 
        t.data.formData.diseaseName = t.data.disease.diseaseName, 0 == t.data.formData.diseaseId && delete t.data.formData.diseaseId, 
        "" != t.data.formData.diseaseName ? "" != t.data.formData.reason ? "" != t.data.formData.content ? 0 != t.data.formData.satisfaction ? a.requestH5api({
            url: "/comment/ordercomment/save.json",
            data: t.data.formData,
            success: function(a) {
                0 == a.flag ? (wx.showToast({
                    title: "评价成功",
                    icon: "success",
                    duration: 2e3
                }), wx.navigateBack()) : wx.showToast({
                    icon: "none",
                    title: a.message || "评价失败",
                    duration: 2e3
                });
            }
        }) : wx.showToast({
            icon: "none",
            title: "请选择星级！",
            duration: 2e3
        }) : wx.showToast({
            icon: "none",
            title: "评价内容不可空！",
            duration: 2e3
        }) : wx.showToast({
            icon: "none",
            title: "看病目的不可空！",
            duration: 2e3
        }) : wx.showToast({
            icon: "none",
            title: "请输入已确诊的疾病",
            duration: 2e3
        });
    },
    getDetail: function(t) {
        var e = this;
        a.requestH5api({
            url: a.globalData.haServer + "/order/orderinfo/mergedetail.json",
            data: {
                bizId: t,
                bizCode: 1
            },
            success: function(a) {
                0 == a.flag && a && e.setData({
                    doctorInfo: a,
                    tagLine2: 1 == a.visitType ? 2 : 3,
                    "formData.reason": 0 == a.visitType ? "初诊" : "复诊"
                });
            }
        });
    },
    onLoad: function(a) {
        if (this.data.formData.orderNo = a.id, this.getDetail(this.data.formData.orderNo), 
        a.diseaseName) {
            var t = decodeURIComponent(a.diseaseName);
            this.setData({
                tagLine1: "尚未确诊" != t ? 1 : 2,
                "disease.diseaseName": t,
                "formData.diseaseName": t
            });
        }
        if (a.visitType) {
            var e = decodeURIComponent(a.visitType);
            this.setData({
                tagLine2: 1 == e ? 2 : 3,
                "formData.reason": 0 == e ? "初诊" : "复诊"
            });
        }
        this.getTagList();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});