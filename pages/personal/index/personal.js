
const app = getApp();
const http = require("./../../../utils/http.js");

Page({
  data: {
    user: '',
    param: app.globalData.param,
    showLoginButton: app.globalData.authStatus
  },
  onLoad: function () {
    this.checkAuth();
    let userStorage = wx.getStorageSync('user');
    console.log(userStorage)
    if (userStorage){
      this.setData({
        user: userStorage
      })
    }
    this.setData({ param: app.globalData.param })
    this.getPersonalInfo()
  },

  onShow: function () {
    this.checkLogin();
  },

  checkLogin:function(){
    http.get(`/user/check_login`, {}, res => {
      if (res.data.error_code == '5000') {
        app.globalData.authStatus = true;
        this.setData({
          showLoginButton : true
        })
      }
    });
  },

  /**
   * 是否授权
   */
  checkAuth:function(){
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            showLoginButton: true
          });
          app.globalData.authStatus = true;
        } else {
          that.getPersonalInfo()
        }
      }
    })

  },

  /**
   * 获取个人信息
   */
  getPersonalInfo() {
    http.get(`/user/info`, {}, res => {
      console.log(res.data.data);
      this.setData({
        user: res.data.data
      })
      wx.setStorageSync('user', res.data.data);
    });
  },

  updateInfo: function () {
    wx.navigateTo({
      url: '/pages/personal/set_profile/set_profile'
    })
  },

  /**
 * 监听用户点击授权按钮
 */
  getAuthUserInfo: function (data) {
    this.setData({
      showLoginButton: false
    });
    http.login(null, null, null, res => {
      this.getPersonalInfo();
    });
  },
})