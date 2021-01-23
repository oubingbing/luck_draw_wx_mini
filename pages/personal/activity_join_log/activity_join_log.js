const util = require("./../../../utils/util.js");
const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    select: 1,
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    orderBy:"id",
    sort:"desc",
    activityLogs:[]
  },

  onLoad: function (e) {
    this.getActivityLogs()
  },

    /**
   * 获取具体类型的贴子
   */
  selected(e) {
    let objType = e.target.dataset.type;
    this.setData({
      select: objType,
      activityLogs: []
    })

    this.setData({
      pageNumber: this.data.initPageNumber
    });

    this.getActivityLogs();
  },

  getActivityLogs:function(){
    wx.showLoading({
      title: '加载中...',
      icon:"none"
    })
    let pageSize = this.data.pageSize
    let pageNum = this.data.pageNumber
    let order = this.data.orderBy
    let sort = this.data.sort
    http.get(`/activity/join_log?page_size=${pageSize}&page_num=${pageNum}&order_by=${order}&sort=${sort}&status=${this.data.select}`, {}, res => {
      wx.hideLoading()
      let resDate = res.data
      if(resDate.code == 0){
        let data = this.data.activityLogs
        resDate.data.map(item=>{
          data.push(item)
        })
        this.setData({activityLogs:data})
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

})