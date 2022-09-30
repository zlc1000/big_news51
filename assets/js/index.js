let layer = layui.layer

$(function () {
  // 目的：确保 dom 渲染完毕之后去请求数据
  getUserInfo()
})

const getUserInfo = () => {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    headers: {
      Authorization: localStorage.getItem('big_news_token') || ''
    },
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
    $('.user-box img').css('src', res.user_pic)
  } else {
    $('.layui-nav-img').hide()
    // 显示文字头像，取username属性的第一个字母
    // 取 nickname 和 username
    const name = res.data.nickname || res.data.username
    // const char = name.charAt(0).toUpperCase()
    const char = name[0].toUpperCase()
    $('.text-avatar').html(char)
  }
  $('.text').html(`欢迎&nbsp;&nbsp;${res.data.username}`)
}

// 问题：你在切换分支的时候：git checkout home
// 如果你切的分支名称和你工程里面某个文件夹的名称一致了，人家给一个报警提示
// git checkout home --      (说明：命令后面加一个 --)

// 获取用户信息，报错状态码 401，就是token问题（要么你没给，要么就是过期了）
