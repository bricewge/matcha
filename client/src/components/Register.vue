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
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
                          name="userName"
                          v-model="userName"
                          :rules="userNameRules"
                          required
                          label="Username"
                          type="text"
                          ></v-text-field>
            <v-text-field
                          name="email"
                          v-model="email"
                          :rules="emailRules"
                          required
                          label="Email"
                          type="text"
                          ></v-text-field>
            <v-text-field
                          name="firstName"
                          v-model="firstName"
                          :rules="firstNameRules"
                          required
                          label="First name"
                          type="text"
                          ></v-text-field>
            <v-text-field
                          name="lastName"
                          v-model="lastName"
                          :rules="lastNameRules"
                          required
                          label="Last name"
                          type="text"
                          ></v-text-field>
            <v-text-field
                          name="password"
                          required
                          label="Password"
                          hint="At least 8 characters"
                          :counter="8"
                          :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (hidePassword = !hidePassword)"
                          :type="hidePassword ? 'password' : 'text'"
                          ></v-text-field>
            <v-text-field
                          name="confirmPassword"
                          required
                          label="Confirm password"
                          :counter="8"
                          :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (hidePassword = !hidePassword)"
                          :type="hidePassword ? 'password' : 'text'"
                          ></v-text-field>
                </v-form>
                <small>*Indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="register"
                       :disabled="!valid"
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
// import axios from 'axios'

export default {
  data () {
    return {
      userName: '',
      userNameRules: [
        v => !!v || 'userName is required'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      firstName: '',
      firstNameRules: [
        v => !!v || 'First Name is required'
      ],
      lastName: '',
      lastNameRules: [
        v => !!v || 'Last Name is required'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length > 7) || 'Password must be 8 characters or more'
      ],
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
