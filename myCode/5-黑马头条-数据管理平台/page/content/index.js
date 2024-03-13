/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
const aObj = {
  staus:'', //文章状态: 1-待审核, 2-审核通过， 不传为全部
  channel_id:'', // 不传为全部
  page:'1', 
  per_page: '2' 
}

// 文章总条数
let totalCount = 0

// page per_page是分页功能
async function getAllArticle() {
  const res = await axios({
    url: '/v1_0/mp/articles',
    method: 'GET',
    params: aObj
  })
  console.log(res);
  console.log(res.data.results);
  const aStr = res.data.results.map(item => {
    return `<tr>
    <td>
      <img src=${item.cover.type === 1? item.cover.images[0]:"https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500"} alt="">
    </td>
    <td>${item.title}</td>
    <td>
      ${item.staus === 1? `<span class="badge text-bg-primary">待审核</span>`
      :`<span class="badge text-bg-success">审核通过</span>`}
    </td>
    <td>
      <span>${item.pubdate}</span>
    </td>
    <td>
      <span>${item.read_count}</span>
    </td>
    <td>
      <span>${item.comment_count}</span>
    </td>
    <td>
      <span>${item.like_count}</span>
    </td>
    <td data-id="${item.id}">
      <i class="bi bi-pencil-square edit"></i>
      <i class="bi bi-trash3 del"></i>
    </td>
  </tr>`
  }).join('')
  document.querySelector('.art-list').innerHTML = aStr

  // 总页数
  totalCount = res.data.total_count
  document.querySelector('.total-count').innerHTML = `共${totalCount}条`
}
getAllArticle()
/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */

// 经过分析发现这个可以复用
async function setChannleList() {
  const res = await axios({
    url: '/v1_0/channels'
  })
  // console.log(res);
  const cStr = res.data.channels.map(item => {
    return `<option value="${item.id}">${item.name}</option>`
  }).join('')
  
  document.querySelector('.form-select').innerHTML = `<option value="" selected="">请选择文章频道</option>`+cStr
}
setChannleList() // 网页运行之后 默认调用一次

document.querySelectorAll('.form-check-input').forEach(item => {
  item.addEventListener('change',e => {
    aObj.staus = e.target.value
  })
})

document.querySelector('.form-select').addEventListener('change',
e => {
  console.log(e.target.value);
})

document.querySelector('.sel-btn').addEventListener('click',
e => {
  getAllArticle()
})
/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */

// 点击下一页，做临界值判断
document.querySelector('.next').addEventListener('click',e => {
  if(aObj.page < Math.ceil(totalCount / aObj.per_page)) {
    aObj.page++
    getAllArticle()
    document.querySelector('.page-now').innerHTML = `第${aObj.page}页`
  }
})
// 点击下一页
document.querySelector('.last').addEventListener('click',e => {
  if(aObj.page > 1) {
    aObj.page--
    getAllArticle()
    document.querySelector('.page-now').innerHTML = `第${aObj.page}页`
  }
})
/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */

// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去

document.querySelector('.art-list').addEventListener('click', async e => {
  if(e.target.classList.contains('del')) {
    const aID = e.target.parentNode.dataset.id
    const res = await axios({
      url: `/v1_0/mp/articles/${aID}`,
      method: 'DELETE'
    })

    // 删除最后一页的最后一条，需要自动向前翻页
    const children = document.querySelector('.art-list').children
    if(children.length === 1 && aObj.page != 1) {
      aObj.page--
      document.querySelector('.page-now').innerHTML = `第${aObj.page}页`
    }

    getAllArticle()
    console.log(res);
  }
})

// 点击编辑 获取文章ID 跳转到发布文章页面传递ID
document.querySelector('.art-list').addEventListener('click', async e => {
  if(e.target.classList.contains('edit')) {
    const aID = e.target.parentNode.dataset.id
    // ..回到父级的父级
    location.href = `../publish/index.html?id=${aID}`
  }
})