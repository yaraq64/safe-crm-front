const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/foo-bar/*': {
        target: 'https://foo.bar',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
