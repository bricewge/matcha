import Vue from 'vue'
import Vuex from 'vuex'
// import actions from './actions'
// import mutations from './mutations'
// import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      if (state.token) {
          state.isUserLoggedIn = true
      } else {
        state.isUserLoggedIn = false
      }
    },
    setUser (state, user) {
      state.user = user
      // if (user.hasOwnProperty('activation')
      //     && user.activation === 'active') {
      //   state.isUserLoggedIn = true
      // } else {
      //   state.isUserLoggedIn = false
      // }
    }
  },
  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    }
  }
})
