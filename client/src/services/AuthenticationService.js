import Api from '@/services/Api'

export default {
  forgot (credentials) {
    return Api().post('auth/forgot', credentials)
  },
  reset (credentials) {
    return Api().post('auth/reset', credentials)
  }
}
