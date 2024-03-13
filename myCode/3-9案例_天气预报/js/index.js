/**
 * 目标1：默认显示-北京市天气
 *  1.1 获取北京市天气数据
 *  1.2 数据展示到页面
 */

// 目标一  获取天气数据:1 默认页面 2 每次搜索
function getWeather(cityCode) {
  myAxios({
    url: 'http://hmajax.itheima.net/api/weather',
    params: {
      city: cityCode
    }
  }).then(result => {
    console.log(result);
    const wObj = result.data


    // 展示数据到页面 ----从上到下 从左到右看
    // （1）日期 发现公历日期农历日期在同一个div里 所以使用模板字符串
    const dateStr = `<span class="dateShort">${wObj.date}</span>
    <span class="calendar">农历&nbsp;
      <span class="dateLunar">${wObj.dateLunar}</span>
    </span>`
    document.querySelector('.title').innerHTML = dateStr

    // （2）城市名字
    document.querySelector('.area').innerHTML = wObj.area

    // （3）banner 当天的气温
    const nowStr = `<div class="tem-box">
    <span class="temp">
      <span class="temperature">${wObj.temperature}</span>
      <span>°</span>
    </span>
  </div>
  <div class="climate-box">
    <div class="air">
      <span class="psPm25">${wObj.psPm25}</span>
      <span class="psPm25Level">${wObj.psPm25Level}</span>
    </div>
    <ul class="weather-list">
      <li>
        <img src="${wObj.weatherImg}" class="weatherImg" alt="">
        <span class="weather">${wObj.weather}</span>
      </li>
      <li class="windDirection">${wObj.windDirection}</li>
      <li class="windPower">${wObj.windPower}</li>
    </ul>
  </div>`
  document.querySelector('.weather-box').innerHTML = nowStr
  

  // （4）当天天气
  const twObj = wObj.todayWeather
  const todayStr = `<div class="range-box">
  <span>今天：</span>
  <span class="range">
    <span class="weather">${twObj.weather}</span>
    <span class="temNight">${twObj.temNight}</span>
    <span>-</span>
    <span class="temDay">${twObj.temDay}</span>
    <span>℃</span>
  </span>
</div>
<ul class="sun-list">
  <li>
    <span>紫外线</span>
    <span class="ultraviolet">${twObj.ultraviolet}</span>
  </li>
  <li>
    <span>湿度</span>
    <span class="humidity">${twObj.humidity}</span>%
  </li>
  <li>
    <span>日出</span>
    <span class="sunriseTime">${twObj.sunriseTime}</span>
  </li>
  <li>
    <span>日落</span>
    <span class="sunsetTime">${twObj.sunsetTime}</span>
  </li>
</ul>`
  document.querySelector('.today-weather').innerHTML = todayStr
  
  //（5）七日天气预报
  const dayForecast = wObj.dayForecast
  const dfStr = dayForecast.map(item => {
    return `<li class="item">
    <div class="date-box">
      <span class="dateFormat">${item.dateFormat}</span>
      <span class="date">${item.date}</span>
    </div>
    <img src="${item.weatherImg}" alt="" class="weatherImg">
    <span class="weather">${item.weather}</span>
    <div class="temp">
      <span class="temNight">${item.temNight}</span>-
      <span class="temDay">${item.temDay}</span>
      <span>℃</span>
    </div>
    <div class="wind">
      <span class="windDirection">${item.windDirection}</span>
      <span class="windPower">${item.windPower}</span>
    </div>
  </li>`
  }).join('')
  document.querySelector('.week-wrap').innerHTML = dfStr
})
} 

// 默认进入网页 就要获取天气数据
getWeather('110100')

// 目标二 搜索

document.querySelector('.search-city').addEventListener('input',
(e) => {
  console.log(e.target.value);
  myAxios({
    url: 'http://hmajax.itheima.net/api/weather/city',
    params: {
      city: e.target.value
    }
  }).then(result => {
    console.log(result)
    const liStr = result.data.map(item => {
      return `<li class="city-item" data-code="${item.code}">${item.name}</li>`
    }).join('')
    console.log(liStr)
    // console.log(document.querySelector('.search-list'));
    document.querySelector('.search-list').innerHTML = liStr
    // console.log(document.querySelector('.search-list'));

  })
})

// 目标三 给每一个小li绑定标签
document.querySelector('.search-list').addEventListener('click',
e => {
  if(e.target.classList.contains('city-item')) {
    // 只有点击城市li 才会走到这里
    console.log(e.target);
    const cityCode = e.target.dataset.code
    console.log(cityCode);
    getWeather(cityCode)
  }
})