<template>
<visitor-form
  title="Reset your password"
  :alert="alert"
  :form="form"
  ref="visitorForm">
  <div slot="fields">
    <v-text-field
      required
      v-model="userName"
      name="userName"
      label="Username"
      :rules="[v => !!v || 'Username is required']"
      type="text"
      ></v-text-field>
    <v-text-field
      required
      v-model="email"
      name="email"
      label="Email"
      :rules="emailRules"
      type="text"
      ></v-text-field>
    <v-text-field
      required
      v-model="firstName"
      name="firstName"
      label="First name"
      :rules="[v => !!v || 'First name is required']"
      type="text"
      ></v-text-field>
    <v-text-field
      required
      v-model="lastName"
      name="lastName"
      label="Last name"
      :rules="[v => !!v || 'Last name is required']"
      type="text"
      ></v-text-field>
    <v-text-field
      required
      v-model="password"
      v-on:input="samePasswords"
      name="password"
      label="Password"
      :rules="passwordRules"
      :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
      :append-icon-cb="() => (hidePassword = !hidePassword)"
      :type="hidePassword ? 'password' : 'text'"
      ></v-text-field>
    <v-text-field
      required
      v-model="confirmPassword"
      v-on:input="samePasswords"
      name="confirmPassword"
      label="Confirm password"
      :rules="confirmPasswordRules"
      :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
      :append-icon-cb="() => (hidePassword = !hidePassword)"
      :type="hidePassword ? 'password' : 'text'"
      ></v-text-field>
  </div>
  <v-layout slot="actions">
    <small>*indicates required field</small>
    <v-spacer></v-spacer>
    <v-btn type="submit"
           color="primary">Register</v-btn>
  </v-layout>
</visitor-form>
</template>

<script>
import VisitorForm from '@/components/VisitorForm'
import AuthenticationService from '@/services/AuthenticationService'
import {validPassword, validEmail} from '@/util/validation'


export default {
  components: {
    VisitorForm
  },

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
      alert: { type: 'error', visible: false, message: '' },
      form: { calid: 'false', submit: this.register }
    }
  },

  methods: {
    async register () {
      this.samePasswords()
      if (!this.$refs.visitorForm.$refs.form.validate()) return
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
        this.alert.visible = true
      } catch (err) {
        this.alert.type = 'error'
        this.alert.message = err.response.data.message
        this.alert.visible = true
      }
    },

    // TODO Tidy this thing up. And it's duplicated code from Reset.vue...
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
