// pages/getUserInfo/getUserInfo.js
const app = getApp()
const globalData = app.globalData
const {getRedirectUri} = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    redirect: '/pages/index/index'
  },

  bindgetuserinfo(res) {
    console.log(res,'res')
    const that = this
    if (res.detail.errMsg == 'getUserInfo:ok') {
      console.log(res)
      globalData.WxRequest({
        url: 'user/update',
        isGet: false,
        data: res.detail.userInfo,
        success: function (res) {
          console.log(res, that.data.redirect,'that.data.redirect')
          const {redirect} = that.data
          if (redirect.includes('pages/index/index') || redirect.includes('pages/map/map') || redirect.includes('pages/mine/mine')){
            wx.switchTab({
              url: that.data.redirect,
            })
          } else {
            wx.redirectTo({
              url: that.data.redirect,
            })
          }
        },
        fail: function (err) {
          console.log(err, 'failure')
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      redirect: getRedirectUri(options)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})