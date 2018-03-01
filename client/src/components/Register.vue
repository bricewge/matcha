<template>

  <v-form v-model="validForm" ref="form"
          @submit.prevent="register"
          lazy-validation>
    <v-card-text>
      <v-text-field required
                    v-model="userName"
                    name="userName"
                    label="Username"
                    :rules="[v => !!v || 'Username is required']"
                    type="text"></v-text-field>
      <v-text-field required
                    v-model="email"
                    name="email"
                    label="Email"
                    :rules="emailRules"
                    type="text"></v-text-field>
      <v-text-field required
                    v-model="firstName"
                    name="firstName"
                    label="First name"
                    :rules="[v => !!v || 'First name is required']"
                    type="text"></v-text-field>
      <v-text-field required
                    v-model="lastName"
                    name="lastName"
                    label="Last name"
                    :rules="[v => !!v || 'Last name is required']"
                    type="text"></v-text-field>
      <v-text-field required
                    v-model="password"
                    v-on:input="samePasswords"
                    name="password"
                    ref="pasword"
                    label="Password"
                    :rules="passwordRules"
                    :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (hidePassword = !hidePassword)"
                    :type="hidePassword ? 'password' : 'text'"
                    ></v-text-field>
      <v-text-field required
                    v-model="confirmPassword"
                    v-on:input="samePasswords"
                    name="confirmPassword"
                    label="Confirm password"
                    :rules="confirmPasswordRules"
                    :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (hidePassword = !hidePassword)"
                    :type="hidePassword ? 'password' : 'text'"
                    ></v-text-field>
      <v-alert
        type="error"
        v-model="error"
        dismissible
        transition="scale-transition"
        >{{ errorMessage }}</v-alert>
    </v-card-text>
    <v-card-actions class="mx-2 pb-3">
      <small>*indicates required field</small>
      <v-spacer></v-spacer>
      <v-btn type="submit"
             color="primary">Register</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import {validPassword, validEmail} from '@/util/validation'


export default {
  data () {
    return {
      userName: '',
      email: '',
      emailRules: [ validEmail ],
      firstName: '',
      lastName: '',
      password: '',
      passwordRules: [ validPassword ],
      confirmPassword: '',
      confirmPasswordRules: [ ],
      hidePassword: true,
      validForm: true,
      error: null,
      errorMessage : ''
    }
  },

  methods: {
    async register () {
      this.samePasswords()
      if (!this.$refs.form.validate()) return
      try {
        const response = await AuthenticationService.register({
          userName: this.userName,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.error = false
      } catch (err) {
        this.error = true
        this.errorMessage = err.response.data.message
      }
    },

    samePasswords () {
      if (!this.confirmPassword) {
        this.confirmPasswordRules = [v => !!v || 'Confirm password is required']
      }else if (this.password !== this.confirmPassword) {
        this.confirmPasswordRules = [ v => 'Password aren\'t the same' ]
      } else {
        this.confirmPasswordRules = [ ]
      }
    }
  }
}
</script>

<style scoped>
</style>
