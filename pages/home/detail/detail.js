const http = require("./../../../utils/http.js");
const app = getApp()
let conn
let videoAd = null

Page({
  data: {
    show:false,
    id:"",
    activity:null,
    socketToken:"",
    socketDomain:"",
    showJoinButton:true,
    showMember:false,
    members:[],
    finishAd:false
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      icon:"none"
    })
    let id = options.id
    this.setData({id:id})
    this.getDetail()

    let userStorage = wx.getStorageSync('user');
    if(userStorage != "" && userStorage != undefined){
      this.getSocketToken()
    }
  },

  onReady: function () {
    
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

  getDetail:function(){
    http.get(`/activity/detail?id=${this.data.id}`, {}, res => {
      wx.hideLoading()
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
        //是否开启广告
        console.log(data.Ad)
        if(data.OpenAd == 1 && data.Ad != ""){
          this.loadAd(data.Ad)
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
      title: '加载中...',
      icon:"none"
    })
    if(!conn){
      this.connectSocket()
    }
    
    http.post(`/activity/join`, {id:this.data.id}, res => {
      wx.hideLoading()
      let resDate = res.data
      if(resDate.code == 0){
        wx.showLoading({
          title: resDate.msg,
          icon:"none",
          duration:3000
        })
      }else{
        wx.showToast({
          title: resDate.msg,
          icon:"none",
          duration:3000
        })
      }
    });
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