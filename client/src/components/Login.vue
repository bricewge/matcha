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
          <v-form>
            <v-text-field prepend-icon="person"
                          name="userName"
                          label="Username"
                          type="text"></v-text-field>
            <v-text-field prepend-icon="lock"
                          name="password"
                          label="Password"
                          id="password"
                          type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="login"
                 color="primary">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<!-- TODO Manage error -->
<!-- TODO Disable buttom until username and password (> 8 characters) are typed -->
<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  data () {
    return {
      userName: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
      try {
        await AuthenticationService.login({
          userName: this.userName,
          password: this.password
        })
      } catch (err) {
        this.error = err.response.data.message
      }
    }
  }
}
</script>

<style scoped>
</style>
