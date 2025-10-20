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
    // Disable prefetch for better performance control
    config.plugins.delete('prefetch')

    // SEO: Set page title
    config.plugin('html').tap(args => {
      args[0].title = 'Panenka Tahminler - Futbol Maç Tahminleri ve Analiz | Günlük Iddaa Tahminleri'
      return args
    })

    // Image optimization
    config.module
      .rule('images')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 10 * 1024 // 10kb
        }
      })
  }
})