import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Forgot from '@/components/Forgot'
import Reset from '@/components/Reset'
import Activate from '@/components/Activate'

Vue.use(Router)

// TODO Add default route

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: Forgot
    },
    {
      path: '/reset/:token',
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
