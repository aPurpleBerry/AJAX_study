// axios 公共配置
// 基地址
axios.defaults.baseURL = 'http://geek.itheima.net'

// 这个JS文件 每个页面都引入了
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log('===请求拦截器===');
  // console.log(config);
  // 统一携带token令牌字符串在请求头上
  const token = localStorage.getItem('token')
  token && (config.headers.Authorization = `Bearer ${token}`)
  // console.log(config);
  // console.log('===请求拦截器===');
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  const result = response.data
  return result;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么，例如：判断响应状态为 401 代表身份验证失败
  console.dir(error);
  if (error?.response?.status === 401) {
    alert('登录状态过期，请重新登录')
    localStorage.clear()//清空本地缓存
    window.location.href = '../login/index.html'// 回到登陆页面
  }
  return Promise.reject(error);
});