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
  config.data = format2Json(config.data)
})

/**
 * 仓库：https://github.com/zlc1000/big_news51.git
 *
 * home分支: git add .  -> git commit -m '完成了登录和注册功能' -> git push
 * git checkout mater -> git merge home -> git push
 * git checkout -b index -> 再继续开发首页的功能就好了
 */
