<template>
  <v-toolbar app fixed clipped-left dark color="blue darken-3">
    <v-toolbar-title class="ml-3 mr-5 hidden-xs-and-down">
                     <router-link to="/" class="link-hidden">Matcha</router-link></v-toolbar-title>
    <v-text-field
      flat
      solo-inverted
      prepend-icon="search"
      label="Search"
      class="hidden-sm-and-down"
      ></v-text-field>
    <v-spacer></v-spacer>
    <v-btn icon disabled class="btn--plain">
      <v-icon>notifications</v-icon>
    </v-btn>
    <v-btn flat class="btn--plain"
           router to="register"
           v-if="!$store.state.isUserLoggedIn"
           >Sign In</v-btn>
    <v-btn flat class="btn--plain"
           router to="login"
           v-if="$store.state.isUserLoggedIn"
           >Log out</v-btn>
    <v-avatar color="primary"
              :size=36
              v-if="$store.state.isUserLoggedIn">
      <span class="white--text headline">J</span>
    </v-avatar>
  </v-toolbar>
</template>

<!-- TODO Logout should logout and redirect to login -->
<!-- TODO Logout should be under a popup on the login account -->
<!-- TODO If the user has a profile picture display it -->
<script>
export default {
}
</script>

<style scoped>
</style>
