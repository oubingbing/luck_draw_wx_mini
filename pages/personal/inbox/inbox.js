const util = require("./../../../utils/util.js");
const http = require("./../../../utils/http.js");
const app = getApp()

Page({

  data: {
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    orderBy:"id",
    sort:"desc",
    inboxList:[],
    showGeMoreLoadin:false
  },

  onLoad: function (options) {
    this.getInbox()
  },

  detail:function(e){
    let id = e.currentTarget.dataset.id
    let obj = e.currentTarget.dataset.obj
    this.readMessage(id)
    wx.navigateTo({
      url: '/pages/home/detail/detail?id='+obj
    })
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