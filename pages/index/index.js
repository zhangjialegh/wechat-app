// pages/index/index.js
const app = getApp()
const globalData = app.globalData

Page({

  /**
   * 页面的初始数据
   */
  data:{
    globalData: null,
    open: -1,
    lastCursor: 0,
    pageSize: 20,
    topicList: []
  },

  deltaTime(T) {
    const delta = Date.now() - new Date(T).getTime() 
    return Math.abs(Math.round(delta / 1000 / 60))
  },

  formatInterval(res) {
    const data = res.map((item) => {
      const delta = (Date.now() - new Date(item.publish_time).getTime()) / 1000
      let inteval = Math.round(delta / 60)
      let time = inteval+'分钟前'
      if (inteval >= 60) {
        inteval = Math.round(delta / 60 / 60)
        time = inteval + '小时前'
        if (inteval >= 24) {
          inteval = Math.round(delta / 60 / 60 / 24)
          time = inteval + '天前'

          if (inteval >= 30) {
            inteval = Math.round(delta / 60 / 60 / 24 / 30)
            time = inteval + '月前'
            if (inteval >= 12) {
              inteval = Math.round(delta / 60 / 60 / 24 / 30 / 12)
              time = inteval + '年前'
            }
          }
        }
      }

      

      

     

      item['inteval'] = time
      return item
    })

    return data
  },

  toggleTop(e) {
    const {order} = e.currentTarget.dataset
    const {open} = this.data
    console.log(e,'e')
    if (order == open) {
      this.setData({
        open: -1,
      })
    } else {
      this.setData({
        open: order,
      })
    }
  },
  getTopic(isFresh) {
    const that = this
    wx.showLoading({
      title: 'Loading...',
    })
    globalData.WxRequest({
      url: 'news/topic',
      isGet: true,
      data: {
        lastCursor:  isFresh ? 0 : that.data.lastCursor,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        wx.hideLoading()
        if (that.data.lastCursor && !isFresh) {
          that.setData({
            topicList: that.data.topicList.concat(that.formatInterval(res.data)),
            lastCursor: that.data.lastCursor + that.data.pageSize
          })
        } else {
          that.setData({
            topicList: that.formatInterval(res.data),
            lastCursor: isFresh ? 0 + that.data.pageSize : that.data.lastCursor + that.data.pageSize
          })
        }
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: err.message,
        })
      }
    })
  },

  showDialog() {
    // this.dialog.showDialog();
    wx.redirectTo({
      url: '/pages/map/map',
    })
  },

  //取消事件
  _cancelEvent() {
    console.log('你点击了取消');
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {
    console.log('你点击了确定');
    this.dialog.hideDialog();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopic()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.dialog = this.selectComponent("#dialog");
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
    this.getTopic(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getTopic()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})