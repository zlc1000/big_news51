$(function () {
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

  // 需要从 layui对象身上取到 form
  const form = layui.form
  const layer = layui.layer

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

  // 将key=value形式的数据，转成json格式的字符串
  const format2Json = (source) => {
    let target = {}
    source.split('&').forEach((el) => {
      let kv = el.split('=')
      target[kv[0]] = kv[1]
    })
    return JSON.stringify(target)
  }

  // 给注册表单添加提交事件（会刷新浏览器）
  // $('#formReg').submit(function () {})
  $('#formReg').on('submit', function (e) {
    // 阻止默认提交动作
    e.preventDefault()

    // 发请求了 ajax
    // 经过分析：1、修改 Content-Type 2、需要将参数转成 json 格式
    $.ajax({
      method: 'POST',
      url: 'http://big-event-vue-api-t.itheima.net/api/reg',
      contentType: 'application/json',
      // data: JSON.stringify({
      //   // 可以将对象转成json格式的字符串
      //   username: $('#formReg [name=username]').val(),
      //   password: $('#formReg [name=password]').val(),
      //   repassword: $('#formReg [name=repassword]').val()
      // }),
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
})
// 说明一下；video里面的请求地址不用了，用新的 http://big-event-vue-api-t.itheima.net
// 原来的：Content-Type: 'application/x-www-form-urlencoded' -> key1=value1&key2=value2
// 现在的：Content-Type需要指定：'application/json' -> '{ "key1": "value1", "key2": "value2" }'

// username=qd51&password=qd51qd51&repassword=qd51qd51
// '{ "username": "qd51", "password": "qd51qd51", "repassword": "qd51qd51" }'

// let str1 = 'username=qd51&password=qd51qd51&repassword=qd51qd51'
// console.log(format2Json(str1))
