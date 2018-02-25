<template>
<v-container fluid fill-height class="grey lighten-1" >
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-6">
        <v-card-title class="grey lighten-4">
          <v-toolbar-title class="text-xs-center">
            Reset password</v-toolbar-title>
        </v-card-title>
        <v-form v-model="validForm" ref="form"
                @submit.prevent="reset"
                lazy-validation>
          <v-card-text>
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
            <v-spacer></v-spacer>
            <v-btn type="submit"
                   color="primary">Reset</v-btn>
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
    async reset () {
      this.samePasswords()
      if (!this.$refs.form.validate()) return
      try {
        const response = await AuthenticationService.reset({
          resetPasswordToken: this.$route.params.token,
          password: this.password
        })
        // TODO Redirect to /login
      } catch (err) {
        console.log(err)
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

<style lang="stylus" scoped>
</style>
