const { defineConfig } = require('@vue/cli-service')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,

  // Production optimizations
  productionSourceMap: false,

  // SEO: Use history mode for clean URLs
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    },
    plugins: process.env.NODE_ENV === 'production' ? [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ] : [],
    performance: {
      hints: 'warning',
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    },
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.football-data.org/v4',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        onProxyReq: (proxyReq) => {
          // API token'ını header'a ekle
          proxyReq.setHeader('X-Auth-Token', 'da36449677ec43788ace1567963c8e32')
        }
      }
    }
  },

  chainWebpack: config => {
    // Preload/Prefetch optimization
    config.plugin('preload').tap(options => {
      options[0] = {
        rel: 'preload',
        as(entry) {
          if (/\.css$/.test(entry)) return 'style'
          if (/\.woff$/.test(entry)) return 'font'
          if (/\.png$/.test(entry)) return 'image'
          return 'script'
        },
        include: 'initial',
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      }
      return options
    })

    // Image optimization
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))
  }
})