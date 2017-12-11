const Vue = require('vue')
const express = require('express');
const server = express()
/*
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./src/index.template.html', 'utf8') // 不使用template的时候, res.end(`html内容标签`)
})
*/

// 在webpack.server配置中开启 new VueSSRServerPlugin()的选项  打包后在dist目录下面生成文件
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
// 在webpack.client配置中开启 new VueSSRClientPlugin()的选项  打包后在dist目录下面生成文件
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: require('fs').readFileSync('./src/index.template.html', 'utf8'),
  clientManifest,
})

server.use('/dist', express.static('./dist'))


// const createApp = require('./src/app');

// 服务器使用
// main.server.js 是打包后生成的  webpack build/webpack.server.config.js

// Bundle Renderer指引 使用自动注入  不需要传递createApp 以及调用其回调
// const createApp = require('./dist/main.server.js').default

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

  // 使用createBundleRenderer 的时候 app参数不再需要传递  会自动注入 因此不需要用createApp
  renderer.renderToString(context, (err, html) => {
    // 异常处理
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
      return;
    }
    res.end(html)
  })

  // // createApp 实际上是 entry-server 中的函数 打包后
  // createApp(context).then(app => {
  //   renderer.renderToString(app, context, (err, html) => {  
  //     // 异常处理
  //     if (err) {
  //       if (err.code === 404) {
  //         res.status(404).end('Page not found')
  //       } else {
  //         res.status(500).end('Internal Server Error')
  //       }
  //       return ;
  //     }
  //     res.end(html)
  //   })
  //   // Vue的实例对象
  //   /*// 另一种创建形式
  //   const app = new Vue({
  //     data: {
  //       url: req.url
  //     },
  //     template: `<div>访问的 URL 是： {{ url }}
  //       <h2>SEO Optimization</h2>
  //     </div>`
  //   })
  //   */

  //   /*  // 在不传递参数template的时候 使用下面的这种方法
  //   res.end(`
  //     <!DOCTYPE html>
  //     <html lang="en">
  //       <head><title>Hello</title></head>
  //       <body>${html}</body>
  //     </html>
  //   `)*/
  //   // Vue里面的内容会自动输入到 <!--vue-ssr-outlet--> 注释里面进行替换

  // }).catch(error=> {
  //   console.log(error.message)
  // })

})
server.listen(8080)
