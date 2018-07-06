const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
};

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
};

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
let qqmapsdk;
Page({
  data: {
    temp: '',
    weatherImg: 'sunny',
    forecast: [],
    todayTemp: "",
    todayDate: "",
    city: "广州市",
    locationTipsText: "点击获取当前位置"
  },
  onPullDownRefresh() {
    this.getNow();
  },
  onLoad(options) {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    });
    qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    });
  },
  onTapLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: ({ longitude, latitude}) => {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: (res) => {
            const locality = "上海市" ||res.result.address_component.locality;
            this.setData({
              city: locality,
              locationTipsText: ""
            });
            this.getNow();
          }
        });
      }
    })
  },
  onDayWeatherTapped() {
    // Routing to a new page
    wx.navigateTo({
      url: `/pages/list/list?city=${this.data.city}`
    })
  },
  setNow(result) {
    const { temp, weather } = result;
    this.setData({
      temp: temp + '°',
      weather: weatherMap[weather],
      weatherImg: weather
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourlyWeather(result) {
    let forecast = [];
    const nowHour = new Date().getHours();
    for (let i = 0; i < 8; i++) {
      forecast.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + result[i].weather + '-icon.png',
        temp: result[i].temp + '°'
      })
    }
    this.setData({ forecast })
  },
  setToday(result) {
    let date = new Date()
    this.setData({
      todayTemp: `${result.minTemp}° - ${result.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  getNow(cb = () => {}) {
    console.log("new city", this.data.city);
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
    
        const { now, forecast, today } = res.data.result;
        
        this.setNow(now);
        this.setHourlyWeather(forecast);
        this.setToday(today);

      },
      complete: (res) => {
        cb();
      }
    })
  }
})