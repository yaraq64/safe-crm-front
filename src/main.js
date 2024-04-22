import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from '@/store/user'
import $bus from '@/plugins/events'
import $formatter from '@/plugins/formatter'
import Vue3Toasity from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/foo' : 'https://foo.bar',
  withCredentials: true
})

import 'normalize.css'
import '@/assets/fonts/index.scss'
import '@/assets/scss/app.scss'

const vueApp = createApp(App)
vueApp.config.globalProperties.$axios = axiosInstance
vueApp.config.globalProperties.$bus = $bus
vueApp.config.globalProperties.$formatter = $formatter

vueApp.use(router).use(Vue3Toasity).mount('#app')

store.dispatch('checkUser', { axios: axiosInstance })
