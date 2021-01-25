
Page({
  data: {

  },

  onLoad: function (options) {

  },

  openAddressCreate:function(){
    wx.navigateTo({
      url: '/pages/personal/address_create/address_create'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})