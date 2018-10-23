//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    title: ["文章111", "文章222"],
    imgUrls: ["../../../imgs/banner.png", "../../../imgs/222.png"],
    author: ["XX", "GG"],
    date: ["2018", "2017"],
    url: ["/pages/news/detail/detail","pages/news/news/news"],
    motto: 'MiHome_Store',
    userInfo: {},
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 100,
    "banner_list": [
      {
        "banner": [
          {
            "pic_url": "http://static.home.mi.com/app/shop/img?id=shop_904608692a4d8415d0de39a0a5897e80.jpeg&w=1080&h=600&crop=a_0_120_1080_480&t=webp&z=1.15&q=78",
          },
          {
            "pic_url": "http://static.home.mi.com/app/shop/img?id=shop_0f5e43035a8b8d27a4b6f315d222fd9b.jpeg&w=1080&h=600&crop=a_0_120_1080_480&t=webp&z=1.15&q=78",
          },
          {
            "pic_url": "http://static.home.mi.com/app/shop/img?id=shop_4ba3d814639ab27570f174467133619f.png&w=1080&h=600&crop=a_0_120_1080_480&t=webp&z=1.15&q=78",
          },
          {
            "pic_url": "http://static.home.mi.com/app/shop/img?id=shop_91f29509f14ea243958285aaf5d5b640.jpeg&w=1080&h=600&crop=a_0_120_1080_480&t=webp&z=1.15&q=78",
          },
          {
            "pic_url": "http://static.home.mi.com/app/shop/img?id=shop_5c752db8097555831469356f5f389078.jpeg&w=1080&h=600&crop=a_0_120_1080_480&t=webp&z=1.15&q=78",
          }
        ]
      },
      {
        "banner": [
          {
            "pic_url": "http://static.home.mi.com/app/shop/img?id=shop_3237b46c5de819816125d88e9d06b7bf.jpg&crop=a_0_120_1080_480&t=webp&z=1.15&q=78",
          },
          {
            "pic_url": "http://static.home.mi.com/app/shop/img?id=shop_c02bce3048058edb194dc3efb230d06b.jpg&crop=a_0_120_1080_480&t=webp&z=1.15&q=78",
          },
          {
            "pic_url": "http://static.home.mi.com/app/shop/img?id=shop_45b3c9ed56aef44994176b50ae5d8a69.jpg&crop=a_0_120_1080_480&t=webp&z=1.15&q=78",
          },
          {
            "pic_url": "http://static.home.mi.com/app/shop/img?id=shop_95583f54ee857e8fa5f4cf1b9f791a74.jpg&crop=a_0_120_1080_480&t=webp&z=1.15&q=78",

          }
        ]
      }
    ]
  
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      that.update()
    })
  },
  onShow: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullDownRefresh: function (e) {
    console.log("下拉刷新");
    this.onLoad();
  },
  pullUpLoad: function (e) {
    app.page += 5;
    this.setData({
      page: app.page
    })
    console.log("上拉加载" + app.page);
    this.loading();
    this.getTypeData(app.page);
  },
  check: function (e) {
    console.log(222);
    // console.log(e.target.id);
    app.cssActive = e.target.dataset.id
    app.requestUrl = e.target.id;
    this.resetData();
    this.setData({
      dataId: app.cssActive,
      title: app.title,
      imgUrls: app.imgUrls,
      author: app.author,
      date: app.date,
      requestUrl: app.requestUrl,
      page: app.page
    }),
      this.loading();
    this.getTypeData(app.page);
  },
  onLoad: function () {
    this.resetData();
    this.loading();
    this.getTypeData(app.page);
  },
  getTypeData: function (page) {
    wx.request({
      url: 'http://v.juhe.cn/toutiao/index?type=' + app.requestUrl + '&key=1c84600b999ae65c986571e77b403fab',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        // success
        //   console.log( res.data.result.data );
        var data = res.data.result.data;
        for (var i = page; i < page + 5; i++) {
          app.title.push(data[i].title);
          app.imgUrls.push(data[i].thumbnail_pic_s);
          app.author.push(data[i].author_name);
          app.date.push(data[i].date);
          app.url.push(data[i].url);
        }
        //   console.log( app.imgUrls );
        this.setData({
          title: app.title,
          imgUrls: app.imgUrls,
          author: app.author,
          date: app.date,
          page: app.page
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideToast();
      }
    })
  },
  resetData: function () {
    app.title = [];
    app.imgUrls = [];
    app.author = [];
    app.title = [];
    app.date = [];
    app.page = 0;
  },
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
})
