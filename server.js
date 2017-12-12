const Vue = require('vue')
const express = require('express');
const server = express()
/*
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./src/index.template.html', 'utf8') // 不使用template的时候, res.end(`html内容标签`)
})
*/

const LRU = require('lru-cache'); //最近最少未使用

// 判断是否过期的逻辑
const isCacheable = req=> {
  // 实现逻辑为，检查请求是否是用户特定(user-specific)。
  // 只有非用户特定(non-user-specific)页面才会缓存
  // Array.some / any
  return true;  // 这里返回true  对每一个页面都进行缓存
}

// 缓存
const microCache = LRU({
  max: 100,
  maxAge: 10000, // 条目在10s后过期
})


// 在webpack.server配置中开启 new VueSSRServerPlugin()的选项  打包后在dist目录下面生成文件
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
// 在webpack.client配置中开启 new VueSSRClientPlugin()的选项  打包后在dist目录下面生成文件
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: require('fs').readFileSync('./src/index.template.html', 'utf8'),
  clientManifest,
  // cache: microCache // 组件级别的缓存 使用redis
})

// 静态文件目录
server.use('/dist', express.static('./dist'))


// const createApp = require('./src/app');

// 服务器使用
// main.server.js 是打包后生成的  webpack build/webpack.server.config.js

// Bundle Renderer指引 使用自动注入  不需要传递createApp 以及调用其回调
// const createApp = require('./dist/main.server.js').default

server.get('*', (req, res) => {

  const cacheable = isCacheable(req);
  if (cacheable) {
    const hit = microCache.get(req.url);
    // 如果命中的缓存的话 直接返回
    if (hit) {
      console.log('-------------缓存命中---------------')
      return res.end(hit)
    }
  }

  // 插值  传递给 createApp中 的参数值  如果不需要可以省略  重点查看createApp中是否使用
  const context = {
    title: 'vue ssr welcome',
    meta: `
      <meta name='Content-Type' value='text/html; charset=utf8'>
      <meta name='cache-control' value='no-cache'>
    `,
    url: req.url
  }

  // 流模式
  // ps: 如果依赖由组件生命周期钩子函数填充的上下文数据, 则不建议使用流模式传输
  const stream = renderer.renderToStream(context)
  // 返回的值是 Node.js stream： 
  
  let html = '';

  stream.on('data', data=> {
    html += data.toString();
  })

  stream.on('end', ()=> {
    res.end(html)

    // 同时可以在这里进行缓存
    if (cacheable) {
      microCache.set(req.url, html);
    }
  })

  stream.on('error', (error)=> {
    console.log(error.message)
  })


  // 使用createBundleRenderer 的时候 app参数不再需要传递  会自动注入 因此不需要用createApp
  /*
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
    // 是否已经缓存 如果缓存的话 将其保存到缓存中
    if (cacheable) {
      microCache.set(req.url, html);
    }
    res.end(html)
  })
  */

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
