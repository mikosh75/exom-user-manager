import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import AuthService from './msal'

Vue.prototype.$AuthService = new AuthService()

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')