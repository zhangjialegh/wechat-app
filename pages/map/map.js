// pages/map/map.js
const app = getApp()
const globalData = app.globalData
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      id: 0,
      latitude: 39.9219,
      longitude: 116.44355,
      width: 50,
      height: 50
    }],
    latitude:0,
    longitude:0,
    centerLat: 0,
    centerLong: 0,
    mapContext: null,
    locationAddress: '',
    addressData: {}
  },
  createMapContext: function () {
    const that = this
    this.mapContext.getCenterLocation({
      success: function (res) {
        that.updateMarkerCenter(res.latitude,res.longitude)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  getLocation: function () {
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          centerLat: res.latitude,
          centerLong: res.longitude,
        })
        that.locationToName(res.latitude, res.longitude)
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },

  initLocation: function (lat, lng) {
    this.setData({
      longitude: lng,
      latitude: lat,
      centerLat: lat,
      centerLong: lng,
    })
    this.locationToName(lat, lng)
  },

  // 逆地址解析
  locationToName: function (lat, long) {
    const that = this
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: long
      },
      get_poi: 1,
      success: function (res) {
        that.setData({
          addressData: res.result,
          locationAddress: res.result.formatted_addresses.recommend
        })
        console.log(res.result.formatted_addresses.recommend,'address')
      },
      fail: function (res) {
            console.log(res);
      },
      complete: function (res) {
            console.log(res);
      }
    });
  },
  
  // 地址解析
  nameToLocation: function (addr) {
    const that = this
    qqmapsdk.geocoder({
      address: addr,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  // 地点搜索
  nameSearch: function (type) {
    const that = this
    qqmapsdk.search({
      keyword: type,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },


  openLocation: function () {
    wx.openLocation({
      latitude: '',
      longitude: '',
      scale: '',
      name: '',
      address: '',
      success: function (res) { 

      },
      fail: function (res) { 

      }
    })
  },

  updateMarkerCenter: function (lat,long) {
    // this.setData({
    //   markers: [{
    //       id: 0,
    //       latitude: lat,
    //       longitude: long,
    //       width: 50,
    //       height: 50
    //     }]
    // })
    this.locationToName(lat, long)
  },

  mapregionchange: function (e) {
    if(e.type=="end") {
      this.createMapContext()
    }
  },

  mapupdated: function (options) {
    // console.log(options, 'update')
  },

  tapmap: function (options) {
    console.log(options,'map')
  },

  returnlocation: function () {
    this.mapContext.moveToLocation()
  },
  selecAddress: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  addRecord: function () {
    const that = this
    globalData.WxRequest({
      url: 'address/record',
      isGet: false,
      data: this.data.addressData,
      success: function (data) {
        wx.showToast({
          title: '地点标记成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail: function (err) {
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: '7YDBZ-EPIC3-QHH3S-YBKWX-DCZYQ-ETF2E'
    });
    console.log(options,'addr options')
    if (JSON.stringify(options) != "{}") {
      this.initLocation(options.lat, options.long)
    } else {
      this.getLocation()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapContext = wx.createMapContext('map', this)
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