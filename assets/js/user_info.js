$(function () {
  // 入口函数

  const form = layui.form
  const layer = layui.layer

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称必须是 1-6 位的非空字符！'
      }
    }
  })

  // 获取用户相关信息
  const initInfo = () => {
    $.ajax({
      // method: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.code !== 0) return layer.msg('请求用户信息失败')
        // console.log(res)
        // 1、给表单进行回显数据
        // form.val('你要指定给哪个表单', '你要指定的那个值')
        form.val('userForm', res.data)
      }
    })
  }

  initInfo()

  // 给重置按钮添加点击事件
  $('#btnReset').on('click', function (e) {
    // 阻止一下默认的重置行为
    e.preventDefault()
    // 重新刷新用户信息
    initInfo()
  })

  // 监听表单提交事件
  $('.layui-form').submit(function (e) {
    e.preventDefault()

    // 把表单数据打印出来（快速获取表单数据）
    // $(this).serialize() -> key=value&key=value
    // form.val('userForm') -> { key: value, key: value }
    // console.log(form.val('userForm'))
    $.ajax({
      method: 'PUT',
      url: '/my/userinfo',
      data: form.val('userForm'), // 问题：@ -> %40 这里进行了转义操作 （空格 -> 20%）
      success(res) {
        if (res.code !== 0) return layer.msg('更新用户信息失败')
        // 刷新一下整体页面
        // window.parent.a
        window.parent.getUserInfo()
        layer.msg('更新用户信息成功')
      }
    })
  })
})
