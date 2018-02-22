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
           >Sign In</v-btn>
  </v-toolbar>
</template>

<script>
  export default {
  }
</script>

<style scoped>
</style>
