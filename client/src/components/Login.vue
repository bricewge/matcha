<template>
<v-container fluid fill-height class="grey lighten-1" >
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-6">
        <v-card-title class="grey lighten-4">
          <v-toolbar-title class="text-xs-center">
            Login</v-toolbar-title>
        </v-card-title>
        <v-form v-model="validForm"
                ref="form"
                @submit.prevent="login"
                lazy-validation>
          <v-card-text>
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
            <v-alert
              type="error"
              v-model="error"
              dismissible
              transition="scale-transition"
              >{{ errorMessage }}</v-alert>
          </v-card-text>
          <v-card-actions class="mx-2 pb-3">
            <router-link to="/forgot" class="ml-3 grey--text text--darken-1">
              Forgot password?</router-link>
            <v-spacer></v-spacer>
            <v-btn type="submit"
                   color="primary">Login</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import {validPassword} from '@/util/validation'

export default {
  data () {
    return {
      validForm: true,
      userName: '',
      password: '',
      passwordRules: [validPassword],
      error: false,
      errorMessage : ''
    }
  },

  methods: {
    async login () {
      if (!this.$refs.form.validate()) return
      try {
        const response = await AuthenticationService.login({
          userName: this.userName,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.error = false
      } catch (err) {
        this.error = true
        this.errorMessage = err.response.data.message
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
