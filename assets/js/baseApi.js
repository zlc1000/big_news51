// 每次发起真正的请求之后，都会经过的地方
$.ajaxPrefilter(function (config) {
  // 将key=value形式的数据，转成json格式的字符串
  const format2Json = (source) => {
    let target = {}
    source.split('&').forEach((el) => {
      let kv = el.split('=')
      target[kv[0]] = kv[1]
    })
    return JSON.stringify(target)
  }

  // 统一设置基准地址
  config.url = 'http://big-event-vue-api-t.itheima.net' + config.url

  // 统一设置请求头 Content-Type 值
  config.contentType = 'application/json'

  // 统一设置请求的参数 - post 请求
  config.data = config.data && format2Json(config.data)

  // 统一设置请求头（有条件的添加）
  // 请求路径中有 /my 这样字符串的需要添加
  // indexOf startsWith endsWith includes 包含，包括的意思
  if (config.url.includes('/my')) {
    // 经过调试，headers 属性是自定义的属性
    config.headers = {
      Authorization: localStorage.getItem('big_news_token') || ''
    }
  }

  // 统一添加错误回调  或 complete 回调
  config.error = function (err) {
    if (
      err.responseJSON?.code === 1 &&
      err.responseJSON?.message === '身份认证失败！'
    ) {
      // 进次处的话，可以认为请求有误了
      localStorage.clear()
      location.href = '/login.html'
    }
  }
})

/**
 * 仓库：https://github.com/zlc1000/big_news51.git
 *
 * home分支: git add .  -> git commit -m '完成了登录和注册功能' -> git push
 * git checkout mater -> git merge home -> git push
 * git checkout -b index -> 再继续开发首页的功能就好了
 */
