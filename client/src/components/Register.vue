<template>
<v-container fluid fill-height class="grey lighten-1" >
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-6">
        <v-card-title class="grey lighten-4">
          <v-toolbar-title class="text-xs-center">
            Register</v-toolbar-title>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field required
                          name="userName"
                          label="Username"
                          type="text"></v-text-field>
            <v-text-field required
                          name="login"
                          label="Login"
                          type="text"></v-text-field>
            <v-text-field required
                          name="firstName"
                          label="First name"
                          type="text"></v-text-field>
            <v-text-field required
                          name="lastName"
                          label="Last name"
                          type="text"></v-text-field>
            <v-text-field required
                          name="password"
                          label="Password"
                          hint="At least 8 characters"
                          :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (hidePassword = !hidePassword)"
                          :type="hidePassword ? 'password' : 'text'"
                          ></v-text-field>
            <v-text-field required
                          name="confirmPassword"
                          label="Confirm password"
                          :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (hidePassword = !hidePassword)"
                          :type="hidePassword ? 'password' : 'text'"
                          ></v-text-field>
                </v-form>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="register"
                       color="primary">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
</v-container>
</template>

<!-- TODO Manage error -->
<!-- TODO Disable buttom until all input is valid -->
<!-- TODO Don't repeat password show/hide code -->
<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  data () {
    return {
      userName: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      hidePassword: true,
      error: null
    }
  },
  methods: {
    async register () {
      try {
        await AuthenticationService.register({
          userName: this.userName,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
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
