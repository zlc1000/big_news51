$(function () {
  // 需要从 layui对象身上取到 form
  const form = layui.form
  const layer = layui.layer

  // 点击去注册
  $('#go2Reg').on('click', function () {
    $('.login-wrap').hide()
    $('.reg-wrap').show()
  })

  // 点击去登录
  $('#go2Login').on('click', function () {
    $('.reg-wrap').hide()
    $('.login-wrap').show()
  })

  form.verify({
    // 添加自定义规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 确认密码框
    repwd: function (value) {
      // 拿到密码框和再次确认密码作比较
      // 属性选择器：$('[name=xxx]').val()
      if ($('#password').val() !== value) {
        return '两次密码不一致，请重新输入'
      }
    }
  })

  // 给注册表单添加提交事件（会刷新浏览器）
  // $('#formReg').submit(function () {})
  $('#formReg').on('submit', function (e) {
    // 阻止默认提交动作
    e.preventDefault()

    // 发请求了 ajax
    // 经过分析：1、修改 Content-Type 2、需要将参数转成 json 格式
    $.ajax({
      method: 'POST',
      url: '/api/reg',
      data: format2Json($(this).serialize()),
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
        $('#go2Login').click()
        // $('#go2Login').trigger('click')
        layer.msg('注册成功')
        // 打开登录表单(模拟点击操作：1、click 2、trigger('click') 3、triggerHandler('click'))
      }
    })
  })

  $('#formLogin').submit(function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
        // 需要干嘛呢？
        // 跳转到主页
        // location.href = '/home.html'
        // token 意思是令牌的意思（下一次去请求有权限的接口的时候“带着”）
        localStorage.setItem('big_news_token', res.token)

        // 固定的写法：Bearer token字符串、Bearer 译为持票人拿着token去请求

        location.href = '/home.html'
      }
    })
  })
})
// 说明一下；video里面的请求地址不用了，用新的 http://big-event-vue-api-t.itheima.net
// 原来的：Content-Type: 'application/x-www-form-urlencoded' -> key1=value1&key2=value2
// 现在的：Content-Type需要指定：'application/json' -> '{ "key1": "value1", "key2": "value2" }'

// username=qd51&password=qd51qd51&repassword=qd51qd51
// '{ "username": "qd51", "password": "qd51qd51", "repassword": "qd51qd51" }'

// let str1 = 'username=qd51&password=qd51qd51&repassword=qd51qd51'
// console.log(format2Json(str1))
