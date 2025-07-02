import './assets/leaflet.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(router)

app.use(GoogleLogin, {
  clientId: '12875774872-pc2373qu2msupp6vcadc98djt6vlm436.apps.googleusercontent.com'
})

app.mount('#app')
