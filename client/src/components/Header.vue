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
    <v-avatar
      color="primary"
      :size=36
      slot="activator">
      <span class="white--text headline">{{ userNameFirstLetter }}</span>
    </v-avatar>
    <v-card>
      <router-link class="link-hidden" to="profile">
        <v-card-title class="grey lighten-3">
          <v-avatar size="40px">
            <img :src="user.profilePicture" alt="Profile picture">
          </v-avatar>
          <v-spacer />
          <div>
            <div class="subheading account-name">
              {{ firstNameCapitalize }} {{ lastNameUpperCase }}
            </div>
            <span>{{ user.email }}</span>
          </div>
        </v-card-title>
      </router-link>
      <v-list>
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click="itemAction(item)">
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
import { mapState } from 'vuex'

function capitalize (string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase()
}

export default {
  data () {
    return {
      menu: null,
      items: [
        // { title: 'My profile', icon: 'account_box', action: 'profile' },
        { title: 'Chat', icon: 'chat', action: 'chat' },
        { title: 'Settings', icon: 'settings', action: 'settings' },
        { title: 'Log out', icon: 'lock', action: 'logout' }
      ]
    }
  },

  methods: {
    itemAction: function (item) {
      if (item.action === 'logout') {
        console.log('Log me out!')
      } else {
        this.$router.push(item.action)
      }
    }
  },

  computed: {
    ...mapState(['user']),
    userNameFirstLetter: function () {
      return this.user.userName[0].toUpperCase()
    },
    firstNameCapitalize: function () {
      return capitalize(this.user.firstName)
    },
    lastNameUpperCase: function () {
      return this.user.lastName.toUpperCase()
    }
  }
}
</script>

<style scoped>
.account-name {
  font-weight: 500;
}
</style>
