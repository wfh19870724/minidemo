var e = getApp();

Page({
    data: {
        url: ""
    },
    onLoad: function(a) {
        var t = this;
        if (a.url) {
            var o = e.globalData.mircoServer + "/checklogin?to=" + encodeURIComponent(a.url) + "&token=" + e.globalData.loginInfo.loginToken;
            t.setData({
                url: o
            });
        } else wx.navigateBack({
            delta: 2
        });
    },
    onShareAppMessage: function() {
        return {
            title: "微医挂号平台",
            path: "/pages/webview/webview?url=" + url
        };
    }
});