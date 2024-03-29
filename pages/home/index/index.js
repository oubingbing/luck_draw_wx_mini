const util = require("./../../../utils/util.js");
const http = require("./../../../utils/http.js");
const app = getApp()

let interstitialAd = null

Page({
  data: {
    select:0,
    tabList:[],
    show_auth:false,
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    orderBy:"id",
    sort:"desc",
    activities:[],
    newMessageNumber:0,
    activityId:app.globalData.activityId,
    banner:""
  },

  onLoad: function (e) {
    wx.showLoading({
      title: '加载中...',
      icon:"none"
    })
    let path = e.path
    let id = e.id
    //if(path != "" && path != undefined){
    //  setTimeout(res=>{
    //    wx.navigateTo({
    //      url: '/'+path+"?id="+id
    //    })
    //  },1000)
    //}else{
    //  console.log("加载广告")
    //  this.getAd()
    //}

    this.showAd()

    this.getCatogry()
    this.getActivities()
    //this.getBannerAd()
    //this.getAd()
  },

    /**
   * 获取具体类型的贴子
   */
  selected(e) {
    let objType = e.target.dataset.type;
    this.setData({
      select: objType,
      activities: []
    })

    this.setData({
      pageNumber: this.data.initPageNumber
    });

    this.getActivities();
    wx.showLoading({
      title: '加载中...',
      icon:"none"
    })
  },

  onShow:function(){
    this.getCatogry()
    this.getMessage()

    if(app.globalData.activityId != 0){
      this.getDetail()
    }

    let userStorage = wx.getStorageSync('user');
    if (userStorage){
      this.setData({
        user: userStorage
      })
    }
    this.showAd()
  },

  onReady: function (option) {

  },

  getBannerAd:function(){
    http.get(`/ad/banner`, {}, res => {
      let resDate = res.data
      if(resDate.code == 0){
        if(resDate.data != ""){
          this.setData({banner:resDate.data})
        }
      }
    });
  },

  getDetail:function(){
    let id = app.globalData.activityId
    app.globalData.activityId = 0
    http.get(`/activity/detail?id=${id}`, {},res=> {
      let resDate = res.data
      if(resDate.code == 0){
        let activities = this.data.activities
        activities = activities.map(item=>{
          if(id == item.ID){
            item.JoinNum = resDate.data.JoinNum
          }
          return item
        })
        this.setData({activities:activities})
      }
    });
  },

  getCatogry:function(){
    http.get(`/activity/category`, {}, res => {
      let resDate = res.data
      if(resDate.code == 0){
        this.setData({tabList:resDate.data})
      }
    });
  },

  getMessage:function(){
    http.get(`/inbox/un_read`, {}, res => {
      let resDate = res.data
      if(resDate.code == 0){
        this.setData({newMessageNumber:resDate.data})
      }
    });
  },

  getAd:function(){
    http.get(`/ad/home`, {}, res => {
      let resDate = res.data
      if(resDate.code == 0){
        if(resDate.data != ""){
        }
      }
    });
  },

  showAd:function(){
    // 显示首页广告
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: "adunit-08366384ec43d4c9"
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  getActivities:function(){
    let pageSize = this.data.pageSize
    let pageNum = this.data.pageNumber
    let order = this.data.orderBy
    let sort = this.data.sort
    let select = this.data.select
    http.get(`/activity/page?page_size=${pageSize}&page_num=${pageNum}&order_by=${order}&sort=${sort}&type=${select}&&history=0`, {}, res => {
      wx.hideLoading()
      setTimeout(res=>{
        wx.stopPullDownRefresh();
      },1000)
      let resDate = res.data
      if(resDate.code == 0){
        let data = this.data.activities
        resDate.data.map(item=>{
          data.push(item)
        })
        this.setData({activities:data})
      }
    });
  },

  detail:function(e){
    let id = e.currentTarget.dataset.id
    app.globalData.activityId = id
    wx.navigateTo({
      url: '/pages/home/detail/detail?id='+id
    })
  },

  openMessage:function(){
    wx.navigateTo({
      url: '/pages/personal/inbox/inbox'
    })
  },

  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '一起来抽大奖啦',
      path: '/pages/home/index/index',
      imageUrl:'',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /**
   * 下拉刷新，获取最新的贴子
   */
  onPullDownRefresh: function () {
    this.setData({
      pageNumber: this.data.initPageNumber,
      activities:[]
    });
    this.getActivities();
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    this.setData({
      showGeMoreLoadin: true,
      pageNumber: this.data.pageNumber+1,
    });
    this.getActivities();
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
 * 预览图片
 */
  previewMoreImage: function (event) {
    let images = event.currentTarget.dataset.obj.map(item=>{
      return this.data.baseImageUrl+item;
    });
    let url = event.target.id;
    wx.previewImage({
      current: url,
      urls: images
    })
  },

})