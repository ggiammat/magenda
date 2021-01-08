import router from "./renderer/router";
import store from "./store";
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./renderer/App.vue";
import { ipcRenderer } from 'electron'
import mitt from 'mitt'
import '@/assets/styles/index.css'


import MAgenda from './magenda'

MAgenda.initModules().then(() => {

  console.log('modules', MAgenda.modules)

  const emitter = mitt()

  const app = createApp(App)

  app.use(ElementPlus)
  app.use(router)
  app.use(store)

  app.config.globalProperties.emitter = emitter

  app.mount("#app")

  let res = ipcRenderer.sendSync("mag:source:init-store")
  console.log(res)
  store.commit('INIT_STORE', res.items)
})
