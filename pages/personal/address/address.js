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
    addressList:[]
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      icon:"none"
    })
    this.getAddressList()
  },

  onShow:function(){
    if(app.globalData.loadAddress == true){
      this.setData({
        addressList:[],
        pageNumber:this.data.initPageNumber
      })
      this.getAddressList()
    }
  },

  delete:function(e){
    let id = e.target.dataset.id
    http.httpDelete(`/address/delete`, {id:id},res=> {
      let resDate = res.data
      if(resDate.code == 0){
        wx.showToast({
          title: '删除成功',
          icon:"none"
        })
        let data = this.data.addressList
        data = data.filter(item=>{
          if(item.Id != id){
            return item
          }
        })
        this.setData({addressList:data})
      }else{
        wx.showToast({
          title: '请求失败',
          icon:"none"
        })
      }
    });
  },

  getAddressList:function(){
    http.get(`/address/page?page_size=${this.data.pageSize}&page_num=${this.data.pageNumber}&order_by=${this.data.orderBy}&sort=${this.data.sort}`, {},res=> {
      wx.hideLoading()
      let resDate = res.data
      if(resDate.code == 0){
        let list = this.data.addressList
        resDate.data.map(item=>{
          list.push(item)
        })
        this.setData({
          addressList:list,
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

  openAddressCreate:function(){
    wx.navigateTo({
      url: '/pages/personal/address_create/address_create?op=1'
    })
  },

  openAddressUpdate:function(e){
    wx.navigateTo({
      url: '/pages/personal/address_create/address_create?op=2&id='+e.target.dataset.id
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})