$(function () {
  const layer = layui.layer
  const form = layui.form

  loadCateList()

  // 加载分类列表
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg('获取分类列表失败了')
        const html = template('tpl-cate', res)
        $('tbody').empty().append(html)
      }
    })
  }
  let index = undefined

  $('#btnAdd').on('click', function () {
    // 打开弹窗
    index = layer.open({
      type: 1,
      title: '添加分类名称',
      area: ['500px', '260px'],
      content: $('#addDialog').html()
    })
  })

  let isEdit = false // 用来记录当前是什么状态

  // 需要通过代理的形式（你要监听的元素，是后来动态创建的）
  $('body').on('submit', '#addForm', function (e) {
    // 阻止默认提交动作
    e.preventDefault()

    if (isEdit) {
      $.ajax({
        method: 'PUT',
        url: '/my/cate/info',
        data: $(this).serialize(),
        success(res) {
          if (res.code !== 0) return layer.msg('修改分类失败')
          layer.msg('修改分类成功')
          // 2、列表需要刷新
          loadCateList()
        }
      })
    } else {
      $.ajax({
        method: 'POST',
        url: '/my/cate/add',
        data: $(this).serialize(),
        // data: form.val('addFormFilter'),
        success(res) {
          if (res.code !== 0) return layer.msg('添加分类失败')
          layer.msg('添加分类成功')
          // 2、列表需要刷新
          loadCateList()
        }
      })
    }
    // 要记得把状态置为 默认值 false
    isEdit = false
    // 1、关闭弹框
    layer.close(index)
  })

  // 需要通过代理给 编辑 按钮添加点击事件
  $('tbody').on('click', '.btnEdit', function () {
    // 用户点击修改按钮的时候，把状态置为 true
    isEdit = true

    index = layer.open({
      type: 1,
      title: '修改分类名称',
      area: ['500px', '260px'],
      content: $('#addDialog').html()
    })

    const id = $(this).attr('data-id')
    // 需要回显表单
    $.ajax({
      method: 'GET',
      url: `/my/cate/info?id=${id}`,
      success(res) {
        if (res.code !== 0) return layer.msg('获取分类详情失败')
        // 快速为表单进行赋值
        form.val('addFormFilter', res.data)
      }
    })
  })

  // 添加删除逻辑
  $('tbody').on('click', '.btnDelete', function () {
    const result = confirm('您确定要删除该分类吗？')
    const id = $(this).attr('data-id')
    if (result) {
      $.ajax({
        method: 'DELETE',
        url: `/my/cate/del?id=${id}`,
        success(res) {
          if (res.code !== 0) layer.msg('删除分类详情失败')
          layer.msg('删除分类详情成功')
          // 重新加载列表
          loadCateList()
        }
      })
    }
  })
})
