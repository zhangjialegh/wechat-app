// pages/search/search.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    centerLat: 0,
    centerLong: 0,
    poiAddressList: [],
    searchAddr: '',
    showCityList: false,
    region: '北京市',
    currentCity: '',
    searchCity: '',
    cityList: [],
    hotCityList: [
      '北京市',
      '广州市',
      '成都市',
      '深圳市'
    ]
  },

  getLocation: function () {
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        that.locationToName(res.latitude, res.longitude)
      },
      fail: function (err) {
        console.log(err)
      }
    })
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
        const {currentCity} = that.data
        that.setData({
          poiAddressList: res.result.pois,
          region: res.result.address_component.city,
          currentCity: currentCity ? currentCity : res.result.address_component.city
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  // 关键词提示
  getLocationSuggest: function (name, region) {
    const that = this
    qqmapsdk.getSuggestion({
      keyword: name,
      region: region,
      success: function (res) {
        that.setData({
          poiAddressList: res.data
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  // 获取城市列表
  getCityList: function () {
    const that = this
    this.setData({
      showCityList: true
    })
    qqmapsdk.getCityList({
      success: function (res) {
        that.setData({
          cityList: res.result[1]
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  inputAddrChange: function (e) {
    // this.setData({
    //   searchAddr: e.target.value
    // })
    console.log(e.detail.value,'value')
    const region = this.data.region
    this.getLocationSuggest(e.detail.value, region)
  },

  inputCityChange: function (e) {
    // this.setData({
    //   searchAddr: e.target.value
    // })
    console.log(e.detail.value, 'value')
    this.getLocationSuggest(e.detail.value)
  },

  // 确定在哪
  selectAddress: function (e) {
    const location = e.currentTarget.dataset.location
    console.log(location,'location')
    wx.redirectTo({
      url: '/pages/map/map?lat='+location.lat+'&long='+location.lng,
    })
  },

  // 选择城市
  selectCity: function (e) {
    const city = e.currentTarget.dataset.city
    this.setData({
      showCityList: false,
      region: city.fullname
    })
    this.locationToName(city.location.lat, city.location.lng)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: '7YDBZ-EPIC3-QHH3S-YBKWX-DCZYQ-ETF2E'
    });
    this.getLocation()
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