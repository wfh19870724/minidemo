var t = getApp();

Page({
    data: {
        modalType: "",
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
        patientData: {
            id: 0,
            name: "",
            sex: 1,
            age: "",
            isDefault: !1,
            mobile: "",
            cardNo: ""
        },
        invalid: {},
        date: new Date().getFullYear() + "-01-01",
        endDate: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
    },
    onShareAppMessage: function() {
        return {
            title: "挂号平台demo",
            path: "/pages/index/index"
        };
    },
    inputValidCode: function(t) {
        this.setData({
            validCode: t.detail.value.split("")
        });
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
    showModal: function(t) {
        this.setData({
            modalType: t
        });
    },
    deletePatient: function() {
        var t = this;
        wx.showModal({
            title: "",
            content: "确定要删除" + t.data.patientData.name + "的信息吗？",
            success: function(a) {
                a.confirm && t.deletePatientRequest({
                    id: t.data.patientData.id
                });
            }
        });
    },
    editPatient: function(t) {
        this.showModal("edit_patient"), this.setData({
            birthday: null,
            patientData: this.data.formDataGroup.patient.patientList[t.currentTarget.dataset.index]
        });
    },
    addPatient: function() {
        this.showModal("add_patient"), this.setData({
            patientData: {
                name: "",
                sex: 1,
                isDefault: !1,
                cardNo: "",
                mobile: ""
            }
        });
    },
    setAge: function(t) {
        this.setData({
            "patientData.age": new Date().getFullYear() - t.detail.value.substring(0, 4) || 1,
            birthday: t.detail.value
        });
    },
    setSex: function(t) {
        this.setData({
            "patientData.sex": t.detail.value
        });
    },
    patientAddFormSubmit: function(t) {
        if (console.log(t.detail.value), this.validatePatient(t.detail.value), !this.data.invalid.hasError) {
            var a = this.data.patientData.id;
            t.detail.value.id = a, this.data.patientData = t.detail.value, this.data.patientData.isDefault = +this.data.patientData.isDefault ? 1 : 0, 
            this.data.patientData.age = +this.data.patientData.age, this.data.patientData.sex = +this.data.patientData.sex, 
            this.data.patientData.birthday = this.data.birthday || null, "add_patient" == this.data.modalType ? (this.data.patientData.cardType = 1, 
            this.addPatientRequest(this.data.patientData)) : (-1 != this.data.patientData.mobile.toString().indexOf("*") && delete this.data.patientData.mobile, 
            -1 != this.data.patientData.cardNo.toString().indexOf("*") ? delete this.data.patientData.cardNo : this.data.patientData.cardType = 1, 
            this.editPatientRequest(this.data.patientData));
        }
    },
    validatePatient: function(t) {
        var a = {
            hasError: !1
        };
        for (var e in t) "" === t[e] && (a[e] = !0, a.hasError = !0);
        this.setData({
            invalid: a
        });
    },
    getPatientList: function() {
        var a = this;
        t.requestH5api({
            url: "/patient/list.json",
            success: function(t) {
                0 == t.flag && a.setData({
                    "formDataGroup.patient.patientList": t.items || []
                });
            }
        });
    },
    getPatientLimit: function() {
        var a = this;
        t.requestH5api({
            url: "/patient/getlimitinfo.json",
            success: function(t) {
                console.log(t), 0 == t.flag && t.limitInfo && a.setData({
                    "formDataGroup.patient.patientLimit": t.limitInfo
                });
            }
        });
    },
    editPatientRequest: function(a) {
        var e = this;
        t.requestH5api({
            url: "/patient/update.json",
            data: a,
            success: function(t) {
                1 != t.flag ? (e.getPatientList(), e.getPatientLimit(), e.hideModal()) : wx.showToast({
                    title: t.message || "失败",
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    },
    addPatientRequest: function(a) {
        var e = this;
        t.requestH5api({
            url: "/patient/add.json",
            data: a,
            success: function(t) {
                console.log(t), 1 != t.flag ? (e.getPatientList(), e.getPatientLimit(), e.hideModal()) : wx.showToast({
                    title: t.message || "失败",
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    },
    deletePatientRequest: function(a) {
        var e = this;
        t.requestH5api({
            url: "/patient/delete.json",
            data: a,
            success: function(t) {
                1 != t.flag ? (e.getPatientList(), e.getPatientLimit(), e.hideModal()) : wx.showToast({
                    title: t.message || "失败",
                    icon: "none",
                    duration: 2e3
                });
            }
        });
    },
    onLoad: function(t) {
        this.getPatientList(), this.getPatientLimit();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});