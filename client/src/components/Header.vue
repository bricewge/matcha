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
  <v-menu
    :close-on-content-click="false"
    bottom
    v-model="menu"
    class="mr-3"
    >
    <v-avatar color="primary"
              :size=36
              v-if="$store.state.isUserLoggedIn"
              slot="activator">
      <span class="white--text headline">J</span>
    </v-avatar>
    <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="" alt="Profile">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Firstname Lastname</v-list-tile-title>
              <v-list-tile-sub-title>Email</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
      <v-btn flat class="btn--plain"
             router to="login"
             v-if="$store.state.isUserLoggedIn"
             >Log out</v-btn>
    </v-card>
  </v-menu>
</v-toolbar>
</template>

<!-- TODO Logout should logout and redirect to login -->
<!-- TODO Logout should be under a popup on the login account
     https://vuetifyjs.com/en/components/menus#example-popover -->
<!-- TODO If the user has a profile picture display it -->
<script>
export default {
}
</script>

<style scoped>
</style>
