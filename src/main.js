import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {permission, role} from './directives/permission'

const app = createApp(App)

app.use(router)
app.directive('permission', permission)
app.directive('role', role)
app.mount('#app')