const Vue = require('vue')
const express = require('express');
const server = express()
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./src/index.template.html', 'utf8') // 不使用template的时候, res.end(`html内容标签`)
})

server.use('/dist', express.static('./dist'))


// const createApp = require('./src/app');

// 服务器使用
// main.server.js 是打包后生成的  webpack build/webpack.server.config.js
const createApp = require('./dist/main.server.js').default

server.get('*', (req, res) => {
  // 插值  传递给 createApp中 的参数值  如果不需要可以省略  重点查看createApp中是否使用
  const context = {
    title: 'vue ssr welcome',
    meta: `
      <meta name='Content-Type' value='text/html; charset=utf8'>
      <meta name='cache-control' value='no-cache'>
    `,
    url: req.url
  }

  // createApp 实际上是 entry-server 中的函数 打包后
  createApp(context).then(app => {
    // 第二个参数context 可以不传递  重点查看renderer模板中index.template.html是否使用了
    renderer.renderToString(app, context, (err, html) => {
      if (err) {
        if (err.code === 404) {
          res.status(404).end('Page not found')
        } else {
          res.status(500).end('Internal Server Error')
        }
        return ;
      }
      res.end(html)
    })
    // Vue的实例对象
    /*// 另一种创建形式
    const app = new Vue({
      data: {
        url: req.url
      },
      template: `<div>访问的 URL 是： {{ url }}
        <h2>SEO Optimization</h2>
      </div>`
    })
    */

    /*  // 在不传递参数template的时候 使用下面的这种方法
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)*/
    // Vue里面的内容会自动输入到 <!--vue-ssr-outlet--> 注释里面进行替换

  }).catch(error=> {
    console.log(error.message)
  })
})
server.listen(8080)
