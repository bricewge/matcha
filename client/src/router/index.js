import Vue from 'vue'
import Router from 'vue-router'
import Errors from '@/components/Errors'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Forgot from '@/components/Forgot'
import Reset from '@/components/Reset'
import Account from '@/components/Account'
import Index from '@/components/Index'
import Profile from '@/components/Profile'
import Chat from '@/components/Chat'
import ChatUser from '@/components/ChatUser'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      // TODO Create the actual component
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        auth: {
          roles: 'active',
          redirect: '/login',
          forbiddenRedirect: '/account'
        }
      }
    },
    {
      path: '*',
      redirect: '/404'
    },
    {
      path: '/404',
      name: '404',
      component: Errors
    },
    {
      path: '/403',
      name: '403',
      component: Errors
    },
    {
      path: '/register',
      name: 'register',
      meta: {auth: false},
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      meta: {auth: false},
      component: Login
    },
    {
      path: '/forgot',
      name: 'forgot',
      meta: {auth: false},
      component: Forgot
    },
    {
      path: '/reset/:token',
      name: 'reset',
      meta: {auth: false},
      component: Reset
    },
    {
      path: '/profile/:userName',
      name: 'profile',
      component: Profile,
      meta: {
        auth: {
          roles: 'active',
          redirect: '/login',
          forbiddenRedirect: '/account'
        }
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: {
        auth: {
          roles: 'active',
          redirect: '/login',
          forbiddenRedirect: '/account'
        }
      }
    },
    {
      path: '/chat/:userName',
      name: 'chatUser',
      component: ChatUser,
      meta: {
        auth: {
          roles: 'active',
          redirect: '/login',
          forbiddenRedirect: '/account'
        }
      }
    },
    {
      path: '/account',
      name: 'account',
      meta: {auth: true},
      component: Account
    }
  ]
})
