import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { darkModeKey, styleKey } from '@/config.js'
import VueAwesomePaginate from "vue-awesome-paginate";
import './css/main.css'
import "vue-awesome-paginate/dist/style.css";
const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(VueAwesomePaginate)
app.use(createPinia())
app.use(router)
app.mount('#app')
