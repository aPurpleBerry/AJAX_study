/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */
const creator = '老张' //以后每一次查询 都是这个来查
function getBookList() {
  axios({
    url:'http://hmajax.itheima.net/api/books',
    method: 'get', // 可以不写
    params: {
      // creator: creator 简写
      creator
    }
  }).then(result => {
    // 1.1 获取数据
    console.log(result);
    const bookList = result.data.data
    console.log(bookList);

    // 1.2 渲染数据
    const trStr = bookList.map((item, index) => {
      const{id,bookname,author,publisher} = item
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${bookname}</td>
          <td>${author}</td>
          <td>${publisher}</td>
          <td data-id=${item.id}>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>
      `
    }).join('')
    document.querySelector('.list').innerHTML = trStr
  })
}

// 网络加载运行,获取并渲染列表一次
getBookList()

// 目标2:新增图书
// 2.1 新增弹框->显示和隐藏
// 2.2收集表单数据，并提交到服务器保存
// 2.3刷新图书列表

const addModalDom = document.querySelector('.add-modal')
const addModal = new bootstrap.Modal(addModalDom)

document.querySelector('.add-btn').addEventListener
('click',() => {
  // 一个form表单里的所有元素都有name属性 
  const addForm = document.querySelector('.add-form')
  const bookObj = serialize(addForm, {hash:true, empty:true})
  console.log(bookObj);

  // 提交服务器
  axios({
    url: 'http://hmajax.itheima.net/api/books',
    method: 'post',
    data: {
      ...bookObj,
      creator
    }
  }).then(result => {
    console.log(result);
    getBookList()
    //重置表单
    addForm.reset()

    addModal.hide()
  })


})

/**
*目标3:删除图书
*3.1删除元素绑定点击事件->获取图书id*3.2调用删除接口
*3.3刷新图书列表
*3.1删除元素->点击（事件委托）
*/

/**
*目标4:编辑图书
*4.1编辑弹框->显示和隐藏
*4.2获取当前编辑图书数据->回显到编辑表单中
*4.3提交保存修改，并刷新列表
*/
const editDom = document.querySelector('.edit-modal')
const editModal = new bootstrap.Modal(editDom)
const list = document.querySelector('.list')
list.addEventListener('click', e => {
  // console.log(e.target.tagName);
  // 删除和编辑 都是span 不能用tagName区分
  if(e.target.classList.contains('del')) {
    // console.log('点击删除元素');
    const theId = e.target.parentNode.dataset.id
    console.log(theId);
    //自定义属性 data-id是绑定在 删除\编辑 的父元素

    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`,
      method: 'delete'
    }).then(result => {
      console.log(result);
      getBookList()
    })
  } else if(e.target.classList.contains('edit')){
    console.log('edit');
    const theId = e.target.parentNode.dataset.id

    axios({
      url: `http://hmajax.itheima.net/api/books/${theId}`
    }).then(result => {
      console.log(result.data.data);
      const bookObj = result.data.data
      // document.querySelector('.edit-form .bookname').value = 
      // bookObj.bookname
      // 数据对象属性,和标签类名一致

      //优化 遍历数据对象
      const keys = Object.keys(bookObj)
      keys.forEach(key => {
        document.querySelector(`.edit-form .${key}`).value = 
        bookObj[key]
      })
    })

    editModal.show()
  }
})


// 编辑 
// [修改按钮] 
document.querySelector('.edit-btn').addEventListener('click',
()=>{
  const editForm = document.querySelector('.edit-form')
  const {id, bookname, author, publisher} = serialize(editForm, {hash:true, empty:true})
  // 隐藏的表单域 保存正在编辑的图书ID 
  // <input type="hidden" class="id" name="id" value="363809">
  
  axios({
    url: `http://hmajax.itheima.net/api/books/${id}`,
    method: 'put',
    data: {
      bookname,
      author,
      publisher,
      creator
    }
  }).then(result => {
    
    console.log(result);

    editModal.hide()
    getBookList()
  })
})
