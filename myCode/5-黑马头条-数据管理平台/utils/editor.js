// 富文本编辑器

// 创建编辑器函数，创建工具栏函数
const { createEditor, createToolbar } = window.wangEditor

//编辑器配置对象
const editorConfig = {
    // 展位提示文字
    placeholder: '发布文章内容...',
    // 编辑器变化时的回调函数
    onChange(editor) {
      const html = editor.getHtml() // 获取富文本编辑器的标签内容
      // console.log('editor content', html)
      // 也可以同步到 <textarea>

      // 为了后续快速手机整个表单内容做铺垫
      document.querySelector('.publish-content').value = html
    }
}

const editor = createEditor({
    selector: '#editor-container',
    // 默认内容
    html: '<p><br></p>',
    config: editorConfig,
    mode: 'default', // or 'simple' 
    //  'default'全部功能，'simple' 简洁功能
})

const toolbarConfig = {}

const toolbar = createToolbar({
    // 为21行创建的编辑器 创建工具栏
    editor,
    // 工具栏创建的位置
    selector: '#toolbar-container',
    // 工具栏的配置对象
    config: toolbarConfig,
    mode: 'default', // or 'simple'
})