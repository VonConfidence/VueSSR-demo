const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
module.exports = merge(baseConfig, {
  entry: './src/entry-client.js',
  output: {
    // path: path.resolve(__dirname, './dist'),
    // publicPath: '/dist/',
    filename: '[name].client.js'
  },
  plugins: [
    /*
    // 将依赖模块提取到 vendor chunk 以获得更好的缓存，是很常见的做法。
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // 一个模块被提取到 vendor chunk 时……
        return (
          // 如果它在 node_modules 中
          /node_modules/.test(module.context) &&
          // 如果 request 是一个 CSS 文件，则无需外置化提取
          !/\.css$/.test(module.request)
        )
      }
    }),
    // 提取 webpack 运行时和 manifest
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      // Popper: 'popper.js'
    })
    */

    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),

    new webpack.DefinePlugin({
      'process.env':{
        VUE_ENV: '"client"'
      }
    })

  ]
})
