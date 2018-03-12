// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuetify from 'vuetify'
import { sync } from 'vuex-router-sync'
import App from './App'
import router from './router'
import 'vuetify/dist/vuetify.min.css'
import store from '@/store/index'

Vue.config.productionTip = true

Vue.use(Vuetify)

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = '/api'

Vue.router = router

Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  refreshData: {enabled: false},
  registerData: {autoLogin: true, redirect: '/account'},
  logoutData: {redirect: '/login'},
  notFoundRedirect: {path: '/'},
  rolesVar: 'activation'
})

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
