import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import AuthService from './msal'
import isAuthenticated from './jslib'

Vue.prototype.$AuthService = new AuthService()
Vue.prototype.$isAuthenticated = new isAuthenticated()

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')