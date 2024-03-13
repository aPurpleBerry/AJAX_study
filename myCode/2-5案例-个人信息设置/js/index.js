/**
 * 目标1：信息渲染
 *  1.1 获取用户的数据
 *  1.2 回显数据到标签上
 * */
const creator = '播仔'

axios({
  url:'http://hmajax.itheima.net/api/settings',
  method: 'get',
  params: {
    creator: creator
  }
}).then(result => {
  console.log(result.data.data);
  const myData = result.data.data
  /*
  { avatar: 'http://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/ajax/17091966131820.1682236562271513.webp', 
    nickname: 'itheima', 
    email: 'itheima1@itcast.cn', 
    desc: '我是播仔.', 
    gender: 1}
   */

  // 获得从后端发送的数据 就要显示在网页中 
  // [回显]
  // 注意点 form表单的值 不是innerHTML 而是value
  // 方法一 查询 之后赋值,但是这种方式很麻烦.
  // 而且我们可以看到仔HTML中,Form表单里元素的class标签 和myData的名字一样,想到可以遍历=> 防止以后FORM表单元素很多的情况
  // document.querySelector('.form-item #email').value = myData.email
  // 方法二
  console.log(Object.keys(myData));
  Object.keys(myData).map(item => {
    if(item === 'avatar') {
      document.querySelector('.avatar-box .prew').src = myData[item]
    } else if(item === 'gender') {
      // console.log('========');
      // 男0 女1
      // console.log(document.querySelector(`[value='${myData[item]}']`));
      document.querySelector(`[value='${myData[item]}']`).checked = true
      // console.log(myData[item]);

      /**
       * 方法二
       * querySelectorAll(.gender)
       * 然后根据 数组下标对应
       */

    } else {
      document.querySelector(`.form-item .${item}`).value = myData[item]
    }
  })
})


/**
*目标2:修改头像
*2.1 获取头像文件
*2.2提交服务器并更新头像
**/

document.querySelector('.avatar-box .upload').addEventListener('change',
(e) => {
  console.log(e.target.files[0]);

  const fd = new FormData()
  fd.append('avatar', e.target.files[0])
  fd.append('creator', creator)

  axios({
    url: `http://hmajax.itheima.net/api/avatar`,
    method: 'put',
    data: fd
  }).then(result => {
    console.log(result);
    console.log(result.data.data.avatar);

    document.querySelector('.prew').src = result.data.data.avatar
  })
})

/*
目标3:提交表单
3.1收集表单信息
3.2提交到服务器保存
保存修改->点击
*/
document.querySelector('.submit').addEventListener('click',
() => {
  const userForm = document.querySelector('.user-form')
  const userObj = serialize(userForm,{hash:true,empty:true})
  userObj.creator = creator
  // 根据 接口文档 性别数字 要变成数字类型
  userObj.gender = +userObj.gender
  console.log(userObj);
  axios({
    url:'http://hmajax.itheima.net/api/settings',
    method: 'PUT',
    data: userObj
  }).then(result => {
    console.log(result);
    /*目 标4:结果提示
    *4.1 创建toast对象
    *4.2调用show方法->显示提示框*/

    const toastDom = document.querySelector('.my-toast')
    const toast = new bootstrap.Toast(toastDom)
    toast.show()
  })
})

