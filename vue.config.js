module.exports = {
  pluginOptions: {
    electronBuilder: {
      comment: 'to enable electron.remote',
      nodeIntegration: true,
      comment2: 'https://stackoverflow.com/questions/60414763/ecmascript-class-properties-not-possible-in-vue-electron-application',
      chainWebpackMainProcess: config => {
        config.module
          .rule("compile")
          .test(/\.js$/)
          .exclude.add(/(node_modules|dist_electron)/)
          .end()
          .use("babel")
          .loader("babel-loader")
          .options({
            presets: ["@vue/cli-plugin-babel/preset"]
          })
      }
    }
  }
}
