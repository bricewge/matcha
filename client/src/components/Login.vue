<template>
<visitor-form
  title="Login"
  :alert="alert"
  :form="form"
  ref="visitorForm">
  <div slot="fields">
    <v-text-field prepend-icon="person"
                  name="userName"
                  label="Username"
                  type="text"
                  v-model="userName"
                  :rules="[v => !!v || 'Username is required']"
                  ></v-text-field>
    <v-text-field prepend-icon="lock"
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                  v-model="password"
                  :rules="passwordRules"
                  ></v-text-field>
  </div>
  <v-layout slot="actions">
    <router-link to="/forgot" class="ml-1 grey--text text--darken-1">
      Forgot password?</router-link>
    <v-spacer></v-spacer>
    <v-btn type="submit"
           color="primary">Login</v-btn>
  </v-layout>
</visitor-form>
</template>

<script>
import VisitorForm from '@/components/VisitorForm'
import AuthenticationService from '@/services/AuthenticationService'
import {validPassword} from '@/util/validation'

export default {
  components: {
    VisitorForm
  },

  data () {
    return {
      userName: '',
      password: '',
      passwordRules: [validPassword],
      alert: { type: 'error', visible: false, message: '' },
      form: { calid: 'false', submit: this.login }
    }
  },

  methods: {
    async login () {
      if (!this.$refs.visitorForm.$refs.form.validate()) return
      try {
        const response = await AuthenticationService.login({
          userName: this.userName,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.alert.visible = false
      } catch (err) {
        this.alert.type = 'error'
        this.alert.message = err.response.data.message
        this.alert.visible = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
