function e(e) {
    return (e = e.toString())[1] ? e : "0" + e;
}

module.exports = {
    formatTime: function(t) {
        var r = t.getFullYear(), n = t.getMonth() + 1, a = t.getDate(), u = t.getHours(), s = t.getMinutes(), c = t.getSeconds();
        return [ r, n, a ].map(e).join("/") + " " + [ u, s, c ].map(e).join(":");
    },
    errImgFun: function(e, t, r) {
        var n = r || "https://img.guahao.com/img/character/doc-unknow.png", a = {};
        a[t] = n, e.setData(a);
    },
    accMul: function(e, t) {
        var r = 0, n = e.toString(), a = t.toString();
        try {
            r += n.split(".")[1].length;
        } catch (e) {}
        try {
            r += a.split(".")[1].length;
        } catch (e) {}
        return Number(n.replace(".", "")) * Number(a.replace(".", "")) / Math.pow(10, r);
    },
    formatDate: function(e, t) {
        function r(e) {
            return (e < 0 || e > 9 ? "" : "0") + e;
        }
        var n = new Array("一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"), a = new Array("星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "周日", "周一", "周二", "周三", "周四", "周五", "周六");
        t += "";
        var u = "", s = 0, c = "", g = "", o = e.getYear() + "", i = e.getMonth() + 1, h = e.getDate(), l = e.getDay(), m = e.getHours(), p = e.getMinutes(), M = e.getSeconds(), f = new Object();
        for (o.length < 4 && (o = "" + (o - 0 + 1900)), f.y = "" + o, f.yyyy = o, f.yy = o.substring(2, 4), 
        f.M = i, f.MM = r(i), f.MMM = n[i - 1], f.NNN = n[i + 11], f.d = h, f.dd = r(h), 
        f.E = a[l + 7], f.EE = a[l], f.H = m, f.HH = r(m), f.h = 0 == m ? 12 : m > 12 ? m - 12 : m, 
        f.hh = r(f.h), f.K = m > 11 ? m - 12 : m, f.k = m + 1, f.KK = r(f.K), f.kk = r(f.k), 
        f.a = m > 11 ? "PM" : "AM", f.m = p, f.mm = r(p), f.s = M, f.ss = r(M); s < t.length; ) {
            for (c = t.charAt(s), g = ""; t.charAt(s) == c && s < t.length; ) g += t.charAt(s++);
            null != f[g] ? u += f[g] : u += g;
        }
        return u;
    },
    dateDiff: function(e, t, r) {
        var n = r.getTime() - t.getTime();
        switch (e.toLowerCase()) {
          case "y":
            return parseInt(r.getFullYear() - t.getFullYear());

          case "m":
            return parseInt(12 * (r.getFullYear() - t.getFullYear()) + (r.getMonth() - t.getMonth()));

          case "d":
            return parseInt(n / 1e3 / 60 / 60 / 24);

          case "w":
            return parseInt(n / 1e3 / 60 / 60 / 24 / 7);

          case "h":
            return parseInt(n / 1e3 / 60 / 60);

          case "n":
            return parseInt(n / 1e3 / 60);

          case "s":
            return parseInt(n / 1e3);

          case "l":
            return parseInt(n);
        }
    }
};