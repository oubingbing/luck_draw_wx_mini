const util = require("./../../../utils/util.js");
const http = require("./../../../utils/http.js");
const app = getApp()

let interstitialAd = null

Page({

  data: {
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    orderBy:"id",
    sort:"desc",
    inboxList:[],
    showGeMoreLoadin:false,
    banner:''
  },

  onLoad: function (options) {
    this.getInbox()
    //this.getAd()
    this.showAd("adunit-aed442de4ea3f8dc")
    this.getBannerAd()
  },

  onReady:function(){
  },

  onShow:function(){
    this.getAd()
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

  detail:function(e){
    let id = e.currentTarget.dataset.id
    let obj = e.currentTarget.dataset.obj
    this.readMessage(id)
    wx.navigateTo({
      url: '/pages/home/detail/detail?id='+obj
    })
  },

  getAd:function(){
    http.get(`/ad/inbox`, {}, res => {
      let resDate = res.data
      if(resDate.code == 0){
        if(resDate.data != ""){
          this.showAd(resDate.data)
        }
      }
    });
  },

  showAd:function(ad){
    // 显示首页广告
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: ad
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

  readMessage:function(id){
    http.put(`/inbox/read`, {id:id},res=> {
      wx.hideLoading()
      let resDate = res.data
      if(resDate.code == 0){
        let list = this.data.inboxList
        list = list.map(item=>{
          if(item.Id == id){
            item.ReadAt = "123"
          }
          return item
        })
        this.setData({inboxList:list})
      }else{
        wx.showToast({
          title: '请求失败',
          icon:"none"
        })
      }
    });
  },

  getInbox:function(){
    wx.showLoading({
      title: '加载中...',
      icon:"none"
    })
    http.get(`/inbox/page?page_size=${this.data.pageSize}&page_num=${this.data.pageNumber}&order_by=${this.data.orderBy}&sort=${this.data.sort}`, {},res=> {
      wx.hideLoading()
      let resDate = res.data
      if(resDate.code == 0){
        let list = this.data.inboxList
        resDate.data.map(item=>{
          list.push(item)
        })
        this.setData({
          inboxList:list,
          pageNumber:this.data.pageNumber+1
        })
      }else{
        wx.showToast({
          title: '请求失败',
          icon:"none"
        })
      }
    });
  },

    /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    this.setData({
      showGeMoreLoadin: true,
      pageNumber: this.data.pageNumber+1,
    });
    this.getInbox();
  },

  onShareAppMessage: function () {

  }
})