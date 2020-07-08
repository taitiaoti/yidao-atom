// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
//本地环境
// var baseUrl = 'http://192.168.0.46:9999'
// var baseUrl = 'http://192.168.0.116:4091'

//测试环境
// var baseUrl = 'http://119.23.26.153:9999'
//线上环境
// var baseUrl = 'http://39.108.108.99:9999'
var baseUrl = 'http://route.edawtech.com'

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    host: 'localhost',
    assetsPublicPath: '/',
    proxyTable: {
      '/auth': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': '/auth'
        }
      },
      '/admin': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/shop': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/shop': '/shop'
        }
      },
      '/charge': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/charge': '/charge'
        }
      },
      '/benefit': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/benefit': '/benefit'
        }
      },
      '/purchase': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/purchase': '/purchase'
        }
      },
      '/jd': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/jd': '/jd'
        }
      }
    },
    cssSourceMap: false
  }
}
