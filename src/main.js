import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
router.isReady().then(async () => {
  if (router.currentRoute.value.matched.length === 0) {
    await router.replace('/')
  }
  app.mount('#app')
})
