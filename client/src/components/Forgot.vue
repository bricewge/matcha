<template>
<visitor-form
  title="Forgot your password?"
  :alert="alert"
  :form="form"
  ref="visitorForm">
  <v-layout slot="fields">
    <v-text-field
      name="email"
      label="Email"
      v-model="email"
      :rules="emailRules"
      ></v-text-field>
  </v-layout>
  <v-layout slot="actions">
    <router-link
      to="/login"
      class="ml-3 password grey--text text--darken-1"
      >Login</router-link>
    <v-spacer></v-spacer>
    <v-btn
      type="submit"
      color="primary"
      >Send me instructions</v-btn>
  </v-layout>
</visitor-form>
</template>

<script>
import VisitorForm from '@/components/VisitorForm'
import AuthenticationService from '@/services/AuthenticationService'
import {validEmail} from '@/util/validation'

export default {
  components: {
    VisitorForm
  },

  data () {
    return {
      email: '',
      emailRules: [validEmail],
      alert: { type: 'error', visible: false, message: '' },
      form: { calid: 'false', submit: this.forgot }
    }
  },

  methods: {
    async forgot () {
      if (!this.$refs.visitorForm.$refs.form.validate()) return
      try {
        const response = await AuthenticationService.forgot({
          email: this.email
        })
        this.alert.type = 'success'
        this.alert.message = response.data.message
        this.alert.visible = true
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
