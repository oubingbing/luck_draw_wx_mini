const util = require("./../../../utils/util.js");
const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    show_auth:false,
    userInfo: {},
  },

  onLoad: function (e) {


  },

  onShow: function (option) {

   
  },

  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    return {
      title: 'hi，同学，有人跟你表白了',
      path: '/pages/home/index/index',
      imageUrl:'http://img.qiuhuiyi.cn/share1.jpg',
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
      posts:[]
    });
    this.getPost();
  },

  /**
   * 上拉加载更多
   */
  onReachBottom: function () {
    this.setData({
      showGeMoreLoadin: true
    });
    this.getPost();
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