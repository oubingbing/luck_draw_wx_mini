const http = require("./../../../utils/http.js");
const app = getApp()
let conn

Page({
  data: {
    show:false,
    id:"",
    activity:null,
    socketToken:"",
    socketDomain:"",
    showJoinButton:true
  },

  onLoad: function (options) {
    let id = options.id
    this.setData({id:id})
    this.getDetail()
    this.getSocketToken();
  },

  onReady: function () {
    
  },

  //连接socket
  connectSocket:function(){
    conn = wx.connectSocket({
      url: this.data.socketDomain+'/ws?token='+this.data.socketToken,
      header:{
        'content-type': 'application/json'
      }
    })

    conn.onError(res=>{
      console.log("socket错误提示：")
      console.log(res)
    })

    conn.onOpen(res=>{
      console.log(res)
    })

    conn.onClose(res=>{
      console.log(res)
    })

    conn.onMessage(res=>{
      let data = JSON.parse(res.data)
      if(data){
        if(data.code == 200){
          wx.hideLoading()
          let pushData = data.data
          if (pushData.code == 0){
            //加入成功
            wx.showToast({
              title: pushData.message,
              icon:"success"
            })
          }else{
            //加入失败
            wx.showToast({
              title: pushData.message,
              icon:"none"
            })
          }
          this.getDetail()
        }
      }
    })
  },

  getSocketToken:function(){
    http.get(`/socket/token`, {}, res => {
      let resDate = res.data
      if(resDate.code == 0){
        this.setData({socketToken:resDate.data.token,socketDomain:resDate.data.domain})
      }else{
        wx.showToast({
          title: '请求失败',
          icon:"none"
        })
      }
    });
  },

  getDetail:function(){
    http.get(`/activity/detail?id=${this.data.id}`, {}, res => {
      let resDate = res.data
      if(resDate.code == 0){
        let data = resDate.data
        let showJoinButton = this.data.showJoinButton
        if(data.ActivityLog == null){
          showJoinButton = true
        }else if(data.ActivityLog.status == 3){
          showJoinButton = true
        }else{
          showJoinButton = false
        }
        this.setData({
          activity:data,
          showJoinButton:showJoinButton,
          show:true
        })
      }else{
        wx.showToast({
          title: '请求失败',
          icon:"none"
        })
      }
    });
  },

  joinActivity:function(){
    if(!conn){
      this.connectSocket()
    }
    
    http.post(`/activity/join`, {id:this.data.id}, res => {
      let resDate = res.data
      if(resDate.code == 0){
        wx.showLoading({
          title: resDate.msg,
          icon:"none"
        })
      }else{
        wx.showToast({
          title: resDate.msg,
          icon:"none"
        })
      }
    });
  },

  onShareAppMessage: function () {

  }
})