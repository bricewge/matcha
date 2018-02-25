<template>
<v-container fluid fill-height class="grey lighten-1" >
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-6">
        <v-card-title class="grey lighten-4">
          <v-toolbar-title class="text-xs-center">
            Forgot your password?</v-toolbar-title>
        </v-card-title>
        <v-form
          v-model="validForm"
          ref="form"
          @submit.prevent="forgot"
          lazy-validation>
          <v-card-text>
            <v-text-field
              name="email"
              label="Email"
              v-model="email"
              :rules="emailRules"
              ></v-text-field>
            <v-alert
              type="error"
              v-model="error"
              dismissible
              transition="scale-transition"
              >{{ errorMessage }}</v-alert>
          </v-card-text>
          <v-card-actions class="mx-2 pb-3">
            <router-link
              to="/login"
              class="ml-3 password grey--text text--darken-1"
              >Login</router-link>
            <v-spacer></v-spacer>
            <v-btn
              type="submit"
              color="primary"
              >Send me instructions</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import {validEmail} from '@/util/validation'

export default {
  data () {
    return {
      validForm: true,
      email: '',
      emailRules: [validEmail],
      error: false,
      errorMessage : ''
    }
  },
  methods: {
    async forgot () {
      if (!this.$refs.form.validate()) return
      try {
        const response = await AuthenticationService.forgot({
          email: this.email
        })
        this.error = false
      } catch (err) {
        console.log(err)
        this.error = true
        this.errorMessage = err.response.data.message
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
