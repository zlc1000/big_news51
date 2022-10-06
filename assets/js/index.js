let layer = layui.layer

$(function () {
  // 目的：确保 dom 渲染完毕之后去请求数据
  getUserInfo()
})

// var const 的区别？
// 由 var 或者 function 关键字声明的变量会默认存在 window 全局变量上，但是 let / const 不会
// 口诀：禁止使用 var

function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success(res) {
      if (res.code !== 0) return layer.msg(res.message)
      // 按需渲染头像
      renderAvatar(res)
    }
  })
}

const renderAvatar = (res) => {
  if (res.user_pic) {
    $('.text-avatar').hide()
    $('.user-box img').css('src', res.user_pic).show()
  } else {
    $('.layui-nav-img').hide()
    // 显示文字头像，取username属性的第一个字母
    // 取 nickname 和 username
    const name = res.data.nickname || res.data.username
    // const char = name.charAt(0).toUpperCase()
    const char = name[0].toUpperCase()
    $('.text-avatar').css('display', 'flex').html(char).show()
  }
  $('.text').html(`欢迎&nbsp;&nbsp;${res.data.username}`)
}

// 实现退出操作
$('#btnLogout').on('click', function () {
  // layer.confirm
  // const result = confirm('您确认要退出吗？')
  // if (result) {
  //   // 1、token 需要移除
  //   localStorage.removeItem('big_news_token')
  //   // localStorage.clear()
  //   // 2、页面需要跳转到登录页
  //   location.href = '/login.html'
  // }
  layer.confirm(
    '您确认要退出吗？',
    { icon: 3, title: '提示' },
    function (index) {
      // 1、token 需要移除
      localStorage.removeItem('big_news_token')
      // localStorage.clear()
      // 2、页面需要跳转到登录页
      location.href = '/login.html'
      // close 是固定写法，关闭弹框的时候
      layer.close(index)
    }
  )
})

// 问题：你在切换分支的时候：git checkout home
// 如果你切的分支名称和你工程里面某个文件夹的名称一致了，人家给一个报警提示
// git checkout home --      (说明：命令后面加一个 --)

// 获取用户信息，报错状态码 401，就是token问题（要么你没给，要么就是过期了）

// 首页是已经处于登录状态的人，才能够访问到的（权限）
