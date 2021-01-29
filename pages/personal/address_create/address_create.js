const util = require("./../../../utils/util.js");
const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    op:1,
    address:{
      id:"",
      receiver:"",
      phone:"",
      province:"省",
      city:"市",
      district:"县区等",
      detail_address:"",
      useType:true
    }
  },

  onLoad: function (options) {
    let op = options.op
    let id = options.id
    if(op != "" && op != undefined){
      let address = this.data.address
      address.id = id
      this.setData({op:op,address:address})
    }

    if(op == 2){
      this.getDetail()
    }
  },

  getDetail:function(){
    http.get(`/address/detail?id=`+this.data.address.id, {},res=> {
      wx.hideLoading()
      let resDate = res.data
      if(resDate.code == 0){
        this.setData({address:resDate.data})
      }else{
        wx.showToast({
          title: '请求失败',
          icon:"none"
        })
      }
    });
  },

  switchChange:function(e){
    let address = this.data.address
    address.useType = e.detail.value
    this.setData({address:address})
  },

  bindName:function(e){
    let address = this.data.address
    address.receiver = e.detail.value
    this.setData({address:address})
  },

  bindPhone:function(e){
    let address = this.data.address
    address.phone = e.detail.value
    this.setData({address:address})
  },

  bindTextAreaBlur:function(e){
    let address = this.data.address
    address.detail_address = e.detail.value
    this.setData({address:address})
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

  update:function(){
    let data = this.data.address
    if(data.receiver == ""){
      wx.showToast({
        title: '收货人不能为空',
        icon:"none"
      })
      return false
    }

    if(data.phone == ""){
      wx.showToast({
        title: '手机号码不能为空',
        icon:"none"
      })
      return false
    }

    if(data.province == ""){
      wx.showToast({
        title: '省份不能为空',
        icon:"none"
      })
      return false
    }

    if(data.city == ""){
      wx.showToast({
        title: '市不能为空',
        icon:"none"
      })
      return false
    }

    if(data.detail_address == ""){
      wx.showToast({
        title: '详细地址不能为空',
        icon:"none"
      })
      return false
    }

    http.put(`/address/update`, data, res => {
      let resDate = res.data
      if(resDate.code == 0){
       wx.showToast({
         title: '保存成功',
         icon:"none"
       })
       app.globalData.loadAddress = true
       setTimeout(res=>{
        wx.navigateBack({ comeBack: true });
       },1500)
      }else{
        wx.showToast({
          title: '保存失败，请重试',
          icon:"none"
        })
      }
    });
  },

  create:function(){
    let data = this.data.address
    if(data.receiver == ""){
      wx.showToast({
        title: '收货人不能为空',
        icon:"none"
      })
      return false
    }

    if(data.phone == ""){
      wx.showToast({
        title: '手机号码不能为空',
        icon:"none"
      })
      return false
    }

    if(data.province == ""){
      wx.showToast({
        title: '省份不能为空',
        icon:"none"
      })
      return false
    }

    if(data.city == ""){
      wx.showToast({
        title: '市不能为空',
        icon:"none"
      })
      return false
    }

    if(data.detail_address == ""){
      wx.showToast({
        title: '详细地址不能为空',
        icon:"none"
      })
      return false
    }

    http.post(`/address/create`, data, res => {
      let resDate = res.data
      if(resDate.code == 0){
       wx.showToast({
         title: '保存成功',
         icon:"none"
       })
       app.globalData.loadAddress = true
       setTimeout(res=>{
        wx.navigateBack({ comeBack: true });
       },1500)
      }else{
        wx.showToast({
          title: resDate.msg,
          icon:"none"
        })
      }
    });
  },

  submit:function(){
    if(this.data.op == 1){
      this.create()
    }else{
      this.update()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})