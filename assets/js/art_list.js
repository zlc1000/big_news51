$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage

  // 定义过滤器
  template.defaults.imports.formatTime = (time) => {
    let date = new Date(time)
    let y = date.getFullYear()
    let m = (date.getMonth() + 1 + '').padStart(2, '0')
    let d = (date.getDate() + '').padStart(2, '0')
    let h = (date.getHours() + '').padStart(2, '0')
    let mm = (date.getMinutes() + '').padStart(2, '0')
    let ss = (date.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${mm}:${ss}`
  }

  let qs = {
    pagenum: 1, // 当前页码值（表示当前是第几页）
    pagesize: 2, // 当前每页显示多少条
    cate_id: '', // 当前选择的文章分类
    state: '' // 当前文章所处的状态，可选值：已发布，操作 都是字符串类型
  }

  loadCateList()

  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg('获取分类列表失败了')
        const html = template('tpl-cate', res)
        $('[name=cate_id]').html(html)
        // layui 本身的特性，需要多走一步
        form.render() // render 渲染的意思
      }
    })
  }

  // 加载文章列表
  loadArticleList()

  function loadArticleList() {
    $.ajax({
      method: 'GET',
      url: `/my/article/list?pagenum=${qs.pagenum}&pagesize=${qs.pagesize}&cate_id=${qs.cate_id}&state=${qs.state}`,
      success(res) {
        if (res.code !== 0) return layer.msg('获取文章列表失败')
        const str = template('tpl-list', res)
        $('tbody').empty().append(str)

        // 做分页效果；总数是必要条件
        renderPager(res.total)
      }
    })
  }

  $('#choose-form').on('submit', function (e) {
    e.preventDefault()
    // 只需要处理一下参数，再直接调用获取列表的方法
    qs.cate_id = $('[name=cate_id]').val()
    qs.state = $('[name=state]').val()

    loadArticleList()
  })

  // 渲染分页功能
  function renderPager(total) {
    // layerui 提供的分页组件 total pagenum: 1 pagesize: 2 这些条件加起来，组件内部可以计算出有多少页
    laypage.render({
      elem: document.getElementById('pagerWrapper'),
      count: total, // 总数
      limit: qs.pagesize, // 每页显示多少条
      curr: qs.pagenum, // 当前是第几页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // layout 就是布局的意思
      limits: [2, 3, 5, 10],
      jump(obj, first) {
        // jump回调触发的时机：1、初次渲染分页组件的时候  2、主动切换页码值的时候
        // jump 本身就是跳跃、跳转的意思
        // 最新的第几页和最新的每页显示多少条(curr limit)
        qs.pagenum = obj.curr
        qs.pagesize = obj.limit

        // 如果直接进行调用的话，会导致死循环的问题
        // 应该是用户主动切换页码值的时候去加载列表
        // if (!first) {
        //   loadArticleList()
        // }
        if (typeof first === 'undefined') {
          loadArticleList()
        }
      }
    })
  }

  $('tbody').on('click', '.btnDelete', function () {
    const result = confirm('您确定要删除该文章吗？')

    let len = $('.btnDelete').length

    if (result) {
      // prop attr 都是用来根据属性名称获取属性值的
      // 固、自有属性 <img src>、开发者自行添加的属性
      const id = $(this).attr('abc')
      $.ajax({
        method: 'DELETE',
        url: `/my/article/info?id=${id}`,
        success(res) {
          if (res.code !== 0) return layer.msg('删除文章失败')
          layer.msg('删除文章成功')

          // 判断一下，如果当前是最后一条数据的话，需要将 pagenum - 1
          // 获取删除按钮元素的个数
          if (len === 1) {
            // 如果当前都已经是第一页，就不要减了，默认是第一页就好了
            qs.pagenum = qs.pagenum === 1 ? 1 : qs.pagenum - 1
          }
          loadArticleList()
        }
      })
    }
  })
})

// 1009反馈
// 隐藏域：<input type="hidden" name="cate_id|id|userId" /> 展现形式：不在页面中显示 作用：根据 name 属性，存储对应的数据
// 场景：一般只用于存储数据，不需要展示出来的数据
// 通过 params 携带参数  - 展现形式就是在 url 地址后面拼接  /list?pagenum=1&pagesize=10
// 通过 data 携带参数 - /list 在请求体里面携带参数
// vue基础-vue项目-v3基础 setup - 项目实战 - 小程序 - ts 就是添加了一个类型 + react
// 个人信息模块，后面就很顺了
