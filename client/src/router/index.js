import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Forgot from '@/components/Forgot'
import Reset from '@/components/Reset'
import Activate from '@/components/Activate'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: Forgot
    },
    {
      path: '/reset',
      name: 'reset',
      component: Reset
    },
    {
      path: '/activate',
      name: 'activate',
      component: Activate
    }
  ]
})
