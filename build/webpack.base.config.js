var path = require('path')
var webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// webpack.config.js
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// CSS 提取应该只用于生产环境
// 这样我们在开发过程中仍然可以热重载
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  // entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    // filename: '[name].js'
  },
  module: {
    rules: [{
        test: /\.css$/,
        // 重要：使用 vue-style-loader 替代 style-loader
        use: isProduction ?
          ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'vue-style-loader'
          }) :
          ['vue-style-loader', 'css-loader']
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {},
          // other vue-loader options go here
          // enable CSS extraction
          extractCSS: isProduction
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin({
      filename: 'common.[chunkhash].css'
    })
  ])
}
