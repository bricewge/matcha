<template>
<v-container fluid fill-height class="grey lighten-1" >
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-6">
        <v-card-title class="grey lighten-4">
          <v-toolbar-title class="text-xs-center">
            Activate account</v-toolbar-title>
        </v-card-title>
        <v-card-text>
          <h1 class="display-4">TODO</h1>
        </v-card-text>
        <v-card-actions class="mx-2 pb-3">
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
