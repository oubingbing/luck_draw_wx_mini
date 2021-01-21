const http = require("./../../../utils/http.js");
const app = getApp()

Page({
  data: {
    id:"",
    activity:null
  },

  onLoad: function (options) {
    let id = options.id
    this.setData({id:id})
    this.getDetail()
  },

  onReady: function () {

  },

  getDetail:function(){
    http.get(`/activity/detail?id=${this.data.id}`, {}, res => {
      let resDate = res.data
      if(resDate.code == 0){
        this.setData({activity:resDate.data})
      }else{
        thiswx.showToast({
          title: '请求失败',
          icon:"none"
        })
      }
    });
  },

  onShareAppMessage: function () {

  }
})