let Promise = require('./utils/promise').Promise

App({
  onLaunch: function (options) {
    this.deviceInfo = this.promise.getDeviceInfo();
    var that = this
    var share = {}
    share.inviter_id = parseInt(options.query.from_id)

    const path= '?path=/'+options.path
    const query = '&query='+JSON.stringify(options.query)
    
    var scene = options.scene
    var souce = options.souce
    console.log( path, query,'options.path')
    // 登录并获取third session

    wx.login({  // 用户登陆成功/已登陆
      success: res => {
        // code to exchange union id and openid
        var data = {
          code: res.code,
          scene: scene
        }
        // 收集是谁分享的
        if (share.inviter_id) {
          data.share = share
        }

        //收集是哪个渠道的
        if (souce) {
          data.souce = souce
        }

        getApp().globalData.WxRequest({
          url: 'wechat/login',
          data: data,
          success: function (data) {
            getApp().globalData.token = data.third_session
            if(data.need) {
              wx.navigateTo({
                url: '/pages/getUserInfo/getUserInfo' + path + query,
              })
            }
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    })
  },

  promise: {
    getDeviceInfo: function () { //获取设备信息
      let promise = new Promise((resolve, reject) => {
        wx.getSystemInfo({
          success: function (res) {
            resolve(res)
          },
          fail: function () {
            reject()
          }
        })
      })
      return promise
    }
  },

  globalData: {
    userInfo: null,
    mobilType: wx.getSystemInfoSync().model,
    wechatLogin: function (successCallback) {
      wx.login({
        success: res => {  // 用户登陆成功/已登陆
          // code to exchange union id and openid
          getApp().globalData.WxRequest({
            url: 'wechat/login',
            data: {
              code: res.code
            },
            success: function (data) {
              getApp().globalData.token = data.third_session
              if (data.need) {
                wx.navigateTo({
                  url: 'pages/getUserInfo/getUserInfo',
                })
              }
              if (successCallback) {
                successCallback()
              }
            },
            fail: function (err) {
              console.log(err)
            }
          })
        }
      })
    },

    wechatAuthRequireModal: function (successCallback) {
      wx.showModal({
        title: '开通授权',
        content: '打开[用户信息]授权开关，享受房产信息服务',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: (res) => {
                if (res.authSetting["scope.userInfo"]) { //如果用户重新同意了授权, 登录
                  if (successCallback) {
                    getApp().globalData.wechatLogin(successCallback)
                  } else {
                    getApp().globalData.wechatLogin()
                  }
                  getApp().globalData.wechatLogin()
                } else {
                  getApp().globalData.wechatAuthRequireModal() //如果用户重新拒绝了授权, 重新请求
                }
              }, fail: function (res) {
                getApp().globalData.wechatAuthRequireModal() //如果用户重新拒绝了授权, 重新请求
              }
            })
          } else {
            //如果用户取消了，正常展示可展示的页面
          }
        }
      })
    },

    // !! 注意但凡request必须要使用这个function而不是wx.request
    WxRequest: function (obj) {
      wx.request({
        url: 'https://console.zicp.io/' + obj.url,
        // url: 'http://localhost:3001/' + obj.url,
        method: obj.isGet && obj.isGet !== undefined ? 'get' : 'post',
        header: {
          'content-type': 'application/json',
          'Authorization': getApp().globalData.token ? getApp().globalData.token : null
        },
        data: obj.data,
        success: function (result) {
          if (result.statusCode == 200) {
            if (obj.success) {
              obj.success(result.data)
            }
          } else if (result.statusCode == 401) {
            getApp().globalData.wechatLogin(function () {
              getApp().globalData.WxRequest(obj)
            })
          } else {
            if (obj.fail) {
              obj.fail(obj.errMsg)
            }
          }
        },
        fail: function (err) {
          obj.fail(err)
          wx.showModal({
            content: '网络不给力，点击确定重试',
            success: function (res) {
              if (res.confirm) {
                getApp().globalData.WxRequest(obj)
              } else if (res.cancel) {
              }
            }
          })
        }
      })
    },
  }
})
