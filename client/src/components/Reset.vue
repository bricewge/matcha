<template>
<v-container fluid fill-height class="grey lighten-1" >
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-6">
        <v-card-title class="grey lighten-4">
          <v-toolbar-title class="text-xs-center">
            Reset password</v-toolbar-title>
        </v-card-title>
        <v-card-text>
          <v-form v-model="validForm" ref="form" lazy-validation>
            <v-text-field name="userName"
                          label="TODO"
                          type="text"
                          v-model="userName"
                          :rules="[v => !!v || 'Username is required']"
                          ></v-text-field>
          </v-form>
          <v-alert
            type="error"
            v-model="error"
            dismissible
            transition="scale-transition"
            >
            {{ errorMessage }}
          </v-alert>
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
export default {
  data () {
    return {
      validForm: true,
      userName: '',
      password: '',
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
        console.log(response.data)
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
