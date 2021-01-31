const http = require("./../../../utils/http.js");
const app = getApp()
let conn
let videoAd = null

let that = ""
Page({
  data: {
    show:false,
    id:"",
    activity:null,
    socketToken:"",
    socketDomain:"",
    showJoinButton:false,
    showMember:false,
    members:[],
    finishAd:false,
    getPhone:false
  },

  onLoad: function (options) {
    let id = options.id
    this.setData({id:id})
    this.getDetail(true)

    let userStorage = wx.getStorageSync('user');
    if(userStorage != "" && userStorage != undefined){
      this.getSocketToken()
    }
    that = this
  },

  onReady: function () {

  },

  getUserPhone:function(e){
    var iv = e.detail.iv
    var encryptedData = e.detail.encryptedData
    var code = "";
    wx.login({
      success: res => {
        console.log(res);
        code = res.code
        http.post(`/user/get_phone`, {iv:iv,encrypted_data:encryptedData,code:code}, res => {
          wx.hideLoading()
          let resDate = res.data
          if(resDate.code == 0){
            let userStorage = wx.getStorageSync('user');
            if(userStorage != "" && userStorage != undefined){
              userStorage.phone = resDate.data
              wx.setStorageSync('user', userStorage);
            }
            this.setData({getPhone:false})
            wx.showToast({
              title: "授权成功",
              icon:"none"
            })
          }else{
            wx.showToast({
              title: resDate.msg,
              icon:"none"
            })
          }
        });
      }
    })
  },

  btnGetPhone:function(e){
    this.setData({getPhone:false})
  },

  loadAd:function(ad){
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: ad
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {
        console.log(err)
        wx.showToast({
          title: '视频广告加载失败，请重试',
          icon:"none",
          duration:2500
        })
      })
      videoAd.onClose((res) => {
        console.log(res)
        if(res.isEnded){
          this.data.finishAd = true
          this.joinActivity()
        }else{
          this.data.finishAd = false
          wx.showToast({
            title: '完成观看广告后才能参加组团抽奖哟',
            icon:"none",
            duration:2500
          })
        }
      })
    }
  },

  showAd:function(){
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },

  attempJoin:function(){
    wx.showToast({
      title: '观看广告后即可参加',
      icon:"none",
      duration:2000
    })

    let userStorage = wx.getStorageSync('user');
    if(userStorage != "" && userStorage != undefined){
      if(this.data.activity.OpenAd == 1 && this.data.activity.Ad != ""){
        this.showAd()
      }else{
        this.joinActivity()
      }
    }else{
      wx.showToast({
        title: '请先登录后再操作',
        icon:"none"
      })
      setTimeout(res=>{
        wx.switchTab({
          url: '/pages/personal/index/personal'
        })
      },1500)
    }
  },

  //隐藏参与者页面
  btnHideMember:function(){
    this.setData({showMember:false})
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
          let pushData = data.data
          console.log("推送的消息")
          console.log(pushData)
          if (pushData.code == 0){
            //加入成功
            this.data.showJoinButton = false
            setTimeout(res=>{
              wx.showToast({
                title: pushData.message,
                icon:"success",
                duration:2000
              })
            },500)
            this.getDetail(false)
            
          }else{
            //加入失败
            wx.showToast({
              title: pushData.message,
              icon:"none"
            })
          }
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

      }
      if(!conn){
        this.connectSocket()
      }
    });
  },

  getMember:function(){
    http.get(`/activity/member?activity_id=${this.data.id}`, {}, res => {
      wx.hideLoading()
      let resDate = res.data
      if(resDate.code == 0){
        this.setData({showMember:true,members:resDate.data})
      }else{
        wx.showToast({
          title: resDate.msg,
          icon:"none"
        })
      }
    });
  },

  getDetail:function(showLoad){
    console.log("get detail")
    if(showLoad){
      wx.showLoading({
        title: '加载中...',
        icon:"none"
      })
    }
    
    http.get(`/activity/detail?id=${this.data.id}`, {},function(res) {
      if(showLoad){
        wx.hideLoading()
      }
      let resDate = res.data
      if(resDate.code == 0){
        let data = resDate.data
        let showJoinButton = that.data.showJoinButton
        if(data.ActivityLog == null){
          showJoinButton = true
        }else if(data.ActivityLog.status == 3){
          showJoinButton = true
        }else{
          showJoinButton = false
        }

        let ac = that.data.activity
        if(ac != null && ac != undefined){
          ac.ActivityLog = data.ActivityLog
          ac.JoinNum = data.JoinNum
        }else{
          ac = data
        }

        that.setData({
          activity:ac,
          show:true,
          showJoinButton:showJoinButton
        })

        if(ac.Type == 3){
          let userStorage = wx.getStorageSync('user');
        if (userStorage != "" &&userStorage != undefined){
          if(userStorage.phone == "" || userStorage.phone == undefined){
            that.setData({getPhone:true})
          }
        }
        }
        
        //是否开启广告
        console.log(data.Ad)
        if(data.OpenAd == 1 && data.Ad != ""){
          that.loadAd(data.Ad)
        }
      }else{
        wx.showToast({
          title: '请求失败',
          icon:"none"
        })
      }
    });
  },

  joinActivity:function(){
    wx.showLoading({
      title: '提交中...',
      icon:"none"
    })

    setTimeout(res=>{
      that.getSocketToken()
    },1000)
    
    http.post(`/activity/join`, {id:this.data.id}, res => {
      wx.hideLoading()
      let resDate = res.data
      if(resDate.code == 0){
        setTimeout(res=>{
          wx.showToast({
            title: resDate.msg,
            icon:"success",
            duration:3000
          })
        },500)
        setTimeout(r=>{
          that.getDetail(false)
        },3000)
      }else{
        wx.showToast({
          title: resDate.msg,
          icon:"none",
          duration:3000
        })
      }
    });
  },

  hidePhone:function(){

  },

  onShareAppMessage: function () {
    let title = "一起来抽大奖啦"
    let image = "/image/personal-bg.jpg"
    if(this.data.activity.ShareTitle != ""){
      title = this.data.activity.ShareTitle
    }

    if(this.data.activity.ShareImageSli.length > 0){
      image = this.data.activity.ShareImageSli[0]
    }

    return {
      title: title,
      path: '/pages/home/index/index?path=pages/home/detail/detail&id='+this.data.id,
      imageUrl:image,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})