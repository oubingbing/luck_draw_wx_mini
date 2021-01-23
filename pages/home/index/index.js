const util = require("./../../../utils/util.js");
const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    show_auth:false,
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    orderBy:"id",
    sort:"desc",
    activities:[]
  },

  onLoad: function (e) {
    wx.showLoading({
      title: '加载中...',
      icon:"none"
    })
    let path = e.path
    let id = e.id
    if(path != "" && path != undefined){
      setTimeout(res=>{
        wx.navigateTo({
          url: '/'+path+"?id="+id
        })
      },1000)
    }

    this.getActivities()
  },

  onShow: function (option) {

  },

  getActivities:function(){
    let pageSize = this.data.pageSize
    let pageNum = this.data.pageNumber
    let order = this.data.orderBy
    let sort = this.data.sort
    http.get(`/activity/page?page_size=${pageSize}&page_num=${pageNum}&order_by=${order}&sort=${sort}`, {}, res => {
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
    wx.navigateTo({
      url: '/pages/home/detail/detail?id='+id
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