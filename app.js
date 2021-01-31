const config = require("./config.js");

App({
  onLaunch: function () {

    this.globalData.apiUrl = config.domain;
    this.globalData.appKey = config.alianceKey;
    this.globalData.imageUrl = config.qiniuDomain+"/";
    this.globalData.bgIimage = config.bgImage;
    this.globalData.loadAddress = false
    this.globalData.activityId = 0
    
    this.globalData.param = false;
    this.globalData.authStatus = false;
  },

  globalData: {
    appId:null,
    userInfo: null,
    apiUrl: null,
    color: '0aecc3',
    imageUrl:'',
    bgImage:'',
    param:false,
    authStatus:false,
    loadAddress:false,
    activityId:0
  }
})