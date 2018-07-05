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

Page({
  data: {
    temp: '',
    weatherImg: 'sunny',
    forecast: []
  },
  onPullDownRefresh() {
    this.getNow();
  },
  onLoad(options) {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    });
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
  getNow(cb = () => {}) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '上海市'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
    
        const { now, forecast } = res.data.result;
        
        this.setNow(now);
        this.setHourlyWeather(forecast);

      },
      complete: (res) => {
        cb();
      }
    })
  }
})