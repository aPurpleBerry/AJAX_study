/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */

/* 需不需要封装？
因为只有登录注册页面需要收集手机号和验证码 所以不需要*/
document.querySelector('.btn').addEventListener('click',
() => {
  const loginForm = document.querySelector('.login-form')
  const loginData = serialize(loginForm, {hash:true, empt:true}) 
  axios({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: loginData
  }).then(result => {
    console.log(result);
    myAlert('true','登录成功')

    //登录成功后保存token
    localStorage.setItem('token',result.data.token)
    setTimeout(() => {
      // 为了延迟跳转，让警告框停留
      location.href = '../content/index.html'
    }, 1500);

  }).catch(error =>{
    console.dir(error);
    myAlert('false','登录失败')
  })
})


