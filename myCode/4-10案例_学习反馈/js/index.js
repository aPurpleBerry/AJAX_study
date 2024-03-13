/**
 * 目标1：完成省市区下拉列表切换
 *  1.1 设置省份下拉菜单数据
 *  1.2 切换省份，设置城市下拉菜单数据，清空地区下拉菜单
 *  1.3 切换城市，设置地区下拉菜单数据
 */

// 1.1 设置省份下拉菜单数据
axios({
  url:'http://hmajax.itheima.net/api/province'
}).then(result => {
  // console.log(result);
  // console.log(result.data.list);
  //把所有省份变成下拉菜单数据的一部分
  const pStr =  result.data.list.map(pname => {
    return `<option value="${pname}">${pname}</option>`
  }).join('')
  console.log(pStr);
  document.querySelector('.province').innerHTML = `<option value="">省份</option>`+pStr
})

// 1.2 切换省份，设置城市下拉菜单数据，清空地区下拉菜单
document.querySelector('.province').addEventListener('change',
async e => {
  // console.log(e);
  // console.log(e.target);
  // console.log(e.target.value);
  const res = await axios({
    url: 'http://hmajax.itheima.net/api/city',
    params: {pname: e.target.value}
  })
  
  //把所有城市变成下拉菜单数据的一部分
  const cStr = res.data.list.map(cname => {
    return `<option value="${cname}">${cname}</option>`
  }).join('')
  document.querySelector('.city').innerHTML =`<option value="">城市</option>`+ cStr

  // 省份切换之后 城市要变换，地区要清空
  document.querySelector('.area').innerHTML = `<option value="">地区</option>`

})

//1.3 切换城市，设置地区下拉菜单数据
document.querySelector('.city').addEventListener('click',
async e => {
  console.log(e.target.value);
  const res = await axios({
    url:'http://hmajax.itheima.net/api/area',
    params: {
      pname: document.querySelector('.province').value,
      cname: e.target.value
    }
  })

  // console.log(res);
  const aStr = res.data.list.map(area =>{
    return `<option value="${area}">${area}</option>`
  }).join('')
  console.log(aStr);
  document.querySelector('.area').innerHTML = `<option value="">地区</option>`+ aStr
})

document.querySelector('.submit').addEventListener('click',
async () => {
  // 依靠插件收集表单信息
  const form1 = document.querySelector('.info-form')
  const data = serialize(form1,{hash:true, empty:true})
  console.log(data)

  const res = await axios({
    url:'http://hmajax.itheima.net/api/feedback',
    method: 'POST',
    data
  })
  console.log(res);
})