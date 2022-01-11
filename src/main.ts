import '@/assets/tw.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
createApp(App).use(pinia).use(router).mount('#app')
