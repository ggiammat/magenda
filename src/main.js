import router from "./router";
import store from "./store";
import { createApp } from "vue";
import ElementPlus from "element-plus";
import App from "./App.vue";
import "element-plus/lib/theme-chalk/index.css";

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount("#app")