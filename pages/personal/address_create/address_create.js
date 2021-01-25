const util = require("./../../../utils/util.js");
const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    address:{
      receiver:"",
      phone:"",
      province:"省",
      city:"市",
      district:"县区等",
      detailAddress:"",
      useType:true
    }
  },

  onLoad: function (options) {

  },

  switch1Change:function(e){

  },

  bindTextAreaBlur:function(e){
    console.log(e)
  },

  bindRegionChange:function(e){
    let region = e.detail.value
    let data = this.data.address
    data.province = region[0]
    data.city = region[1]
    data.district = region[2]
    this.setData({
      address:data
    })
  },

  submit:function(){
    let data = this.data.address
    console.log(data)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})