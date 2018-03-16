<template>
<visitor-background>
  <default-form
    title="Login"
    :alert="alert"
    :form="form"
    ref="defaultForm">
    <div slot="fields">
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
    </div>
    <v-layout slot="actions">
      <router-link to="/forgot" class="ml-1 grey--text text--darken-1">
        Forgot password?</router-link>
      <v-spacer></v-spacer>
      <v-btn type="submit"
             color="primary">Login</v-btn>
  </v-layout>
  </default-form>
</visitor-background>
</template>

<script>
import DefaultForm from '@/components/DefaultForm'
import VisitorBackground from '@/components/VisitorBackground'
import AuthenticationService from '@/services/AuthenticationService'
import {validPassword, nonEmptyPassword} from '@/util/validation'

export default {
  components: {
    DefaultForm,
    VisitorBackground
  },

  data () {
    return {
      userName: '',
      password: '',
      passwordRules: [nonEmptyPassword, validPassword],
      alert: { type: 'error', visible: false, message: '' },
      form: { valid: false, submit: this.login }
    }
  },

  methods: {
    async login () {
      try {
        if (!this.$refs.defaultForm.$refs.form.validate()) return
        const response = await this.$auth.login({
          data: {
            userName: this.userName,
            password: this.password,
          },
        })
        this.$socket.connect()
        this.alert.visible = false
      } catch (err) {
        this.alert.type = 'error'
        this.alert.message = err.response.data.message
        this.alert.visible = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
