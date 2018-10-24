var a = getApp(), t = require("../../utils/util.js");

Page({
    data: {
        modalType: "",
        orderInfo: {},
        formId: "",
        formDataGroup: {
            time: {
                timeList: [],
                active_index: 1
            },
            patient: {
                patientList: [],
                patientLimit: {}
            }
        },
        formData: {
            patientId: "",
            patientName: "",
            visitType: ""
        },
        patientData: {
            patientId: 0,
            name: "",
            sex: 1,
            age: "",
            isDefault: !1,
            mobile: "",
            cardNo: ""
        },
        invalid: {},
        date: new Date().getFullYear() + "-01-01",
        endDate: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
        validCode: [],
        showRuleFlag: !1,
        requireConfigs: [],
        requireEntrys: [],
        config: [],
        resendTime: 0,
        RESENDTIME: 60,
        timer: null,
        searching: !1,
        diseaseList: [],
        isFocus: !1,
        errorMessage: "系统异常",
        payType: 2,
        value: "",
        validator: {},
        noSelectVisit: !1
    },
  finish: function () {
    this.setData({
      modalType: "",
      invalid: {}
    });
  },



    onShareAppMessage: function() {
        return {
            title: "挂号平台demo",
            path: "/pages/index/index"
        };
    },
    imgError: function(e) {
        var i = this, s = a.globalData.staticServer + "/img/character/doc-unknow.png";
        t.errImgFun(i, e.target.dataset.errImg, s);
    },
    focusInput: function() {
        this.setData({
            isFocus: !0
        });
    },
    inputValidCode: function(a) {
        var t = a.detail.value.split("");
        this.setData({
            validCode: t
        }), 6 == t.length && (this.data.formData.checkCode = a.detail.value, this.orderformSubmitRequest(), 
        this.hideModal());
    },
    cancel: function() {
        this.setData({
            modalType: "",
            invalid: {}
        });
    },
    hideModal: function() {
        this.setData({
            modalType: "",
            invalid: {}
        });
    },
    showModal: function(a) {
        this.setData({
            modalType: a
        });
    },
    showRule: function() {
        this.setData({
            showRuleFlag: !this.data.showRuleFlag
        });
    },
    tapPatient: function(a) {
        var t = this, e = a.currentTarget.dataset;
        if (t.checkPatient(e)) {
            var i = e.mobile, s = e.card;
            i && s ? (this.data.formData.patientId = e.id, this.hideModal(), this.setData({
                "formData.patientName": a.currentTarget.dataset.name,
                phoneNum: a.currentTarget.dataset.mobile
            })) : wx.showToast({
                title: "请先完善该就诊人的身份证和手机号",
                icon: "none",
                duration: 2e3
            });
        }
    },
    editPatient: function(a) {
        this.showModal("edit_patient"), this.setData({
            patientData: this.data.formDataGroup.patient.patientList[a.currentTarget.dataset.index],
            invalid: {}
        });
    },
    addPatient: function() {
        this.showModal("add_patient"), this.setData({
            patientData: {
                name: "",
                sex: 1,
                isDefault: !1,
                mobile: "",
                cardNo: ""
            },
            invalid: {}
        });
    },
    setAge: function(a) {
        this.setData({
            "patientData.age": new Date().getFullYear() - a.detail.value.substring(0, 4) || 1,
            "patientData.birthday": a.detail.value
        });
    },
    setSex: function(a) {
        this.setData({
            "patientData.sex": a.detail.value
        });
    },
    patientEditFormSubmit: function(a) {
        this.validate(a.detail.value), this.data.invalid.hasError || (this.data.patientData.age = a.detail.value.age, 
        this.data.patientData.mobile = a.detail.value.mobile, this.data.patientData.cardNo = a.detail.value.cardNo, 
        this.data.patientData.isDefault = a.detail.value.isDefault ? 1 : 0, -1 != this.data.patientData.mobile.toString().indexOf("*") && delete this.data.patientData.mobile, 
        -1 != this.data.patientData.cardNo.toString().indexOf("*") ? (delete this.data.patientData.cardNo, 
        delete this.data.patientData.cardType) : this.data.patientData.cardType = 1, this.editPatientRequest(this.data.patientData));
    },
    patientAddFormSubmit: function(a) {
        this.validate(a.detail.value), this.data.invalid.hasError || (this.data.patientData = a.detail.value, 
        this.data.patientData.isDefault = +this.data.patientData.isDefault ? 1 : 0, this.data.patientData.age = +this.data.patientData.age, 
        this.data.patientData.sex = +this.data.patientData.sex, this.data.patientData.cardType = 1, 
        this.addPatientRequest(this.data.patientData));
    },
    validate: function(a) {
        var t = {
            hasError: !1
        }, e = null;
        for (var i in a) (e = this.data.validator[i]) || "" !== a[i] ? e && !new RegExp(e).test(a[i]) && (t[i] = !0, 
        t.hasError = !0) : (t[i] = !0, t.hasError = !0);
        this.setData({
            invalid: t
        });
    },
    getPatientList: function() {
        var t = this;
        // a.requestH5api({
        //     url: "/patient/list.json",
        //     success: function(a) {
        //         if (0 == a.flag && a.items && (t.setData({
        //             "formDataGroup.patient.patientList": a.items
        //         }), "" == t.data.formData.patientId)) for (var e = 0; e < a.items.length; e++) {
        //             var i = a.items[e];
        //             if ((3 == t.data.orderInfo.sexLimit || i.sex == t.data.orderInfo.sexLimit) && !(i.age < t.data.orderInfo.ageLowerLimit || i.age > t.data.orderInfo.ageTopLimit)) return void t.setData({
        //                 "formData.patientId": i.id,
        //                 "formData.patientName": i.name,
        //                 phoneNum: i.mobile
        //             });
        //         }
        //     }
        // });
    },
    checkPatient: function(a) {
        var t = this;
        return 3 != t.data.orderInfo.sexLimit && a.sex != t.data.orderInfo.sexLimit ? (wx.showToast({
            title: "选择的用户的性别不符合要求",
            icon: "none",
            duration: 2e3
        }), !1) : !(a.age < t.data.orderInfo.ageLowerLimit || a.age > t.data.orderInfo.ageTopLimit) || (wx.showToast({
            title: "选择的用户的年龄不符合要求",
            icon: "none",
            duration: 2e3
        }), !1);
    },
    getPatientLimit: function() {
        var t = this;
        // a.requestH5api({
        //     url: "/patient/getlimitinfo.json",
        //     success: function(a) {
        //         0 == a.flag && a.limitInfo && t.setData({
        //             "formDataGroup.patient.patientLimit": a.limitInfo
        //         });
        //     }
        // });
    },
    editPatientRequest: function(t) {
        var e = this;
        // a.requestH5api({
        //     url: "/patient/update.json",
        //     data: t,
        //     success: function(a) {
        //         0 == a.flag ? (e.getPatientList(), e.getPatientLimit(), e.hideModal()) : wx.showToast({
        //             title: a.message,
        //             icon: "none",
        //             duration: 2e3
        //         });
        //     }
        // });
    },
    addPatientRequest: function(t) {
        var e = this;
        // a.requestH5api({
        //     url: "/patient/add.json",
        //     data: t,
        //     success: function(a) {
        //         0 == a.flag ? (e.getPatientList(), e.getPatientLimit(), e.hideModal()) : wx.showToast({
        //             title: a.message,
        //             icon: "none",
        //             duration: 2e3
        //         });
        //     }
        // });
    },
    getSchedule: function(t) {
        var e = this;
        console.info("11111111");
        // wx.showLoading({
        //     title: "加载中",
        //     mask: !0
        // }), a.requestH5api({
        //     url: "/order/orderconfig/getconfig.json",
        //     data: {
        //         shiftCaseId: e.data.formData.shiftCaseId
        //     },
        //     success: function(a) {
        //         if (wx.hideLoading(), 0 == a.flag) {
        //             e.data.formData.hospitalId = a.hospitalId, a.requiredConfigs && 0 != a.requiredConfigs.length ? (e.data.formData.visitType = a.requiredConfigs[0].visitTypeId, 
        //             e.data.formData.visitTypeName = a.requiredConfigs[0].visitTypeName, e.setData({
        //                 formData: e.data.formData
        //             }), 1 == a.requiredConfigs.length && e.setData({
        //                 noSelectVisit: !0
        //             })) : a.requiredConfigs = [ {}, {} ];
        //             for (var t = a.requiredConfigs[0].requireEntrys || [], i = 0; i < t.length; i++) t[i].require && t[i].validator && (e.data.validator[t[i].name] = t[i].validator);
        //             for (var s = a.timeSections, i = 0; i < s.length; i++) if (s[i].avaliable) {
        //                 e.setData({
        //                     "formData.timeSection": s[i].timeSection,
        //                     "formData.timeSectionId": s[i].timeId
        //                 });
        //                 break;
        //             }
        //             e.setData({
        //                 orderInfo: a,
        //                 "formDataGroup.time.timeList": a.timeSections,
        //                 requiredConfigs: a.requiredConfigs,
        //                 requireEntrys: t
        //             }), e.getPatientList(), e.getPayType();
        //         } else wx.showToast({
        //             title: a.message,
        //             icon: "none",
        //             duration: 2e3
        //         });
        //     },
        //     fail: function() {
        //         wx.hideLoading();
        //     }
        // });
    },
    getValidCode: function(t) {
        var e = this;
        // e.resendTime > 0 ? t && t() : (e.countDown(), a.requestH5api({
        //     url: "/order/ordermsg/getcheckcode.json",
        //     data: {
        //         extend: e.data.formData.hospitalId + "_" + e.data.formData.shiftCaseId,
        //         patientId: e.data.formData.patientId
        //     },
        //     success: function(a) {
        //         0 == a.flag ? t && t() : wx.showToast({
        //             title: a.message,
        //             icon: "none",
        //             duration: 2e3
        //         });
        //     }
        // }));
    },
    orderformSubmitRequest: function() {
        var t = this;
        -1 == t.data.formData.diseaseId && (t.data.formData.diseaseId, t.data.formData.diseaseName);
        var e = t.data.formData;
        // e.formId = t.data.formId, e.orderDetailUrl = "pages/order-detail/order-detail?id=", 
        // wx.showLoading({
        //     title: "加载中"
        // }), a.requestH5api({
        //     url: "/order/submitorder/submit.json",
        //     data: e,
        //     success: function(a) {
        //         console.log(a), delete t.data.formData.checkCode, t.setData({
        //             validCode: [],
        //             value: "",
        //             errorMessage: "",
        //             "invalid.hasError": !1
        //         }), 0 == a.flag ? (t.setData({
        //             isFocus: !1
        //         }), 1 == t.data.formData.payType ? wx.navigateTo({
        //             url: "/pages/order-pay/order-pay?id=" + a.orderNo
        //         }) : wx.navigateTo({
        //             url: "/pages/order-detail/order-detail?id=" + a.orderNo
        //         })) : 11 == a.flag ? (t.setData({
        //             isFocus: !1
        //         }), wx.navigateTo({
        //             url: "/pages/order-result/order-result?orderState=3&message=" + a.message
        //         })) : 1 == a.flag ? t.setData({
        //             errorMessage: a.message,
        //             "invalid.hasError": !0
        //         }) : (t.setData({
        //             isFocus: !1
        //         }), wx.navigateTo({
        //             url: "/pages/order-result/order-result?orderState=2&message=" + a.message
        //         }));
        //     },
        //     complete: function() {
        //         wx.hideLoading();
        //     }
        // });
    },
    searchDisease: function(t) {
        var e = this;
        // e.data.searching || (e.data.searching = !0, a.requestH5api({
        //     url: "/common/searchsuggest/list.json",
        //     data: {
        //         q: t.detail.value,
        //         limit: 10,
        //         type: "disease"
        //     },
        //     success: function(a) {
        //         0 == a.flag && e.setData({
        //             diseaseList: a.items
        //         });
        //     },
        //     complete: function() {
        //         e.data.searching = !1;
        //     }
        // }));
    },
    getPayType: function() {
        var t = this;
        // a.requestH5api({
        //     url: "/pay/getpaytype.json",
        //     data: {
        //         shiftCaseId: t.data.formData.shiftCaseId,
        //         hospitalId: t.data.formData.hospitalId
        //     },
        //     success: function(a) {
        //         0 == a.flag && (t.setData({
        //             payType: a.payType
        //         }), 0 == a.payType ? t.setData({
        //             "formData.payWay": "去医院支付",
        //             "formData.payType": "0"
        //         }) : 1 == a.payType && t.setData({
        //             "formData.payWay": "线上支付",
        //             "formData.payType": "1"
        //         }));
        //     }
        // });
    },
    orderformSubmit: function(a) {
        var t = this;
        this.data.config = [];
        var e = a.detail.formId;
        "the formId is a mock one" == e ? console.log("请在真机环境获取formId") : t.setData({
            formId: e
        });
        for (var i in a.detail.value) this.data.formData[i] = a.detail.value[i];
        for (var s = 0; s < this.data.requireEntrys.length; s++) {
            var r = this.data.requireEntrys[s].name, n = this.data.requireEntrys[s].require;
            r in this.data.formData || (this.data.formData[r] = ""), this.data.config.push({
                name: r,
                value: this.data.formData[r] || ""
            }), n || delete this.data.formData[r];
        }
        this.validate(this.data.formData), this.data.invalid.hasError ? console.log(this.data.invalid) : (this.setData({
            invalid: {
                hasError: !1
            }
        }), this.data.formData.requiredDatas = this.data.config, this.getValidCode(function() {
            t.setData({
                isFocus: !0
            }), t.showModal("valid_code");
        }));
    },
    chosePatient: function() {
        this.getPatientList(), this.showModal("chose_patient");
    },
    choseTime: function(a) {
        this.showModal("chose_time");
    },
    tapTime: function(a) {
        var t = this.data.formDataGroup.time.timeList[a.currentTarget.dataset.index];
        a.currentTarget.dataset.avaliable && (this.data.formData.timeSectionId = t.timeId, 
        this.data.formData.timeSection = t.timeSection, this.setData({
            modalType: "",
            "formData.timeSection": t.timeSection,
            "formData.timeSectionId": t.timeId
        }));
    },
    choseType: function(a) {
        var t = this;
        if (!t.data.noSelectVisit && t.data.requiredConfigs) {
            var e = [], i = t.data.requiredConfigs;
            i.forEach(function(a) {
                e.push(a.visitTypeName);
            }), t.setData({
                invalid: {}
            }), wx.showActionSheet({
                itemList: e,
                success: function(a) {
                    if (!a.cancel) {
                        for (n = 0; n < t.data.requireEntrys.length; n++) {
                            var s = t.data.requireEntrys[n].name;
                            s in t.data.formData && (delete t.data.formData[s], delete t.data.formData[s + "_name"]);
                        }
                        t.data.config = [], t.data.formData.visitType = i[a.tapIndex].visitTypeId, t.data.formData.visitTypeName = e[a.tapIndex];
                        for (var r = t.data.orderInfo.requiredConfigs[a.tapIndex].requireEntrys || [], n = 0; n < r.length; n++) r[n].require && r[n].validator && (t.data.validator[r[n].name] = r[n].validator);
                        t.setData({
                            formData: t.data.formData,
                            requireEntrys: r
                        });
                    }
                }
            });
        }
    },
    chosePayWay: function(a) {
        var t = this, e = [ "去医院支付", "线上支付" ];
        0 == t.data.payType && (e = [ "去医院支付" ]), 1 == t.data.payType && (e = [ "线上支付" ]), 
        wx.showActionSheet({
            itemList: e,
            success: function(a) {
                a.cancel || (0 == t.data.payType ? t.data.formData.payType = 0 : 1 == t.data.payType ? t.data.formData.payType = 1 : t.data.formData.payType = a.tapIndex, 
                t.setData({
                    "formData.payWay": e[a.tapIndex]
                }));
            }
        });
    },
    choseConfig: function(a) {
        for (var t = this, e = a.currentTarget.dataset.index, i = [], s = 0; s < this.data.requireEntrys[e].nameValues.length; s++) {
            var r = this.data.requireEntrys[e].nameValues[s].name;
            i.push(r);
        }
        wx.showActionSheet({
            itemList: i,
            success: function(a) {
                if (!a.cancel) {
                    var i = a.tapIndex;
                    t.data.formData[t.data.requireEntrys[e].name] = t.data.requireEntrys[e].nameValues[i].value, 
                    t.data.formData[t.data.requireEntrys[e].name + "_name"] = t.data.requireEntrys[e].nameValues[i].name, 
                    t.setData({
                        formData: t.data.formData
                    });
                }
            }
        });
    },
    choseDisease: function() {
        this.setData({
            modalType: "chose_disease"
        });
    },
    tapDisease: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            "formData.diseaseName": a.currentTarget.dataset.name,
            "formData.diseaseId": -1 == t ? null : t
        }), this.hideModal();
    },
    resendCode: function() {
        this.data.resendTime > 0 || this.getValidCode();
    },
    countDown: function() {
        if (!this.data.timer) {
            var a = this;
            this.data.resendTime = this.data.RESENDTIME, this.data.timer = setInterval(function() {
                a.data.resendTime > 0 ? a.setData({
                    resendTime: --a.data.resendTime
                }) : (clearInterval(a.data.timer), a.data.timer = null);
            }, 1e3);
        }
    },
    onLoad: function(a) {
        this.data.formData.shiftCaseId = a.shiftCaseId,
         this.getPatientLimit(), 
         this.getSchedule();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});