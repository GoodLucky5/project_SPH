const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,//关闭eslint语法检查
  //配置代理跨域
  devServer: {
    proxy: {
      "/api"://涉及到跨域问题，凡是带api的请求通过代理服务器发送请求，即哪些请求需要代理
      {
        target: "http://gmall-h5-api.atguigu.cn",
        // pathRewrite: { '^/api': '' },
        //本项目中所有的请求地址如/api/product/getBaseCategoryList都是带有api字眼的，所以这里
      }
    }
  },
  //关闭打包生成map文件
  productionSourceMap:false
})
