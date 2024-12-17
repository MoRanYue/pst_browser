import 'normalize.css'
import '@icon-park/vue-next/styles/index.less'
import './assets/main.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PiniaPersistPlugin from 'pinia-plugin-persist'
import i18n from './locales/locales.js'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(PiniaPersistPlugin)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(MotionPlugin)

app.mount('#app')
