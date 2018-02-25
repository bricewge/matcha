<template>
<v-container fluid fill-height class="grey lighten-1" >
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-6">
        <v-card-title class="grey lighten-4">
          <v-toolbar-title class="text-xs-center">
            Login</v-toolbar-title>
        </v-card-title>
        <v-card-text>
          <v-form v-model="validForm" ref="form" lazy-validation>
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
          </v-form>
          <v-alert
            type="error"
            v-model="error"
            dismissible
            transition="scale-transition"
            >{{ errorMessage }}</v-alert>
        </v-card-text>
        <v-card-actions class="mx-2 pb-3">
          <router-link to="/forgot" class="ml-3 grey--text text--darken-1">Forgot password?</router-link></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="login"
                 color="primary">Login</v-btn>
        </v-card-actions>
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
        await AuthenticationService.login({
          userName: this.userName,
          password: this.password
        })
        this.error = false
      } catch (err) {
        console.log(err.response)
        this.error = true
        this.errorMessage = err.response.data.message
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
