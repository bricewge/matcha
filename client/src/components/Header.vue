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
    v-if="$store.state.isUserLoggedIn"
    :close-on-content-click="false"
    v-model="menu"
    offset-y
    bottom
    class="mr-3"
    >
    <v-avatar color="primary"
              :size=36
              slot="activator">
      <span class="white--text headline">J</span>
    </v-avatar>
    <v-card>
        <v-list >
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="" alt="Profile">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Username</v-list-tile-title>
              <v-list-tile-sub-title>Email</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
    <v-list>
      <v-list-tile v-for="item in items" :key="item.title" @click="">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    </v-card>
  </v-menu>
</v-toolbar>
</template>

<!-- TODO Logout should logout and redirect to login -->
<!-- TODO If the user has a profile picture display it -->
<script>
export default {
    data () {
        return {
            menu: null,
            items: [
                { title: 'My profile', icon: 'account_box', action: 'profile' },
                { title: 'Settings', icon: 'settings', action: 'settings' },
                { title: 'Log out', icon: 'lock', action: 'logout' }
            ]
        }
    }
}
</script>

<style scoped>
</style>
