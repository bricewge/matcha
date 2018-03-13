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
  <notifications/>
  <v-btn flat class="btn--plain"
         router to="register"
         v-if="!$auth.check() && $route.name !== 'register'"
         >Sign In</v-btn>
  <v-btn flat class="btn--plain"
         router to="login"
         v-if="!$auth.check() && $route.name === 'register'"
         >Login</v-btn>
  <v-menu
    v-if="$auth.check()"
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
      <v-icon
        large
        v-if="!$auth.user().picture0"
        >account_circle</v-icon>
      <img
        v-if="$auth.user().picture0"
        :src="$auth.user().picture0"
        alt="Profile picture">
    </v-avatar>
    <v-card>
      <router-link class="link-hidden" to="profile">
        <v-card-title class="grey lighten-3">
          <v-layout row align-center>
            <v-flex>
              <div class="subheading account-name">
                {{ userNameCapitalize }}
              </div>
              <span>{{ $auth.user().email }}</span>
            </v-flex>
          </v-layout>
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

<script>
import Notifications from '@/components/Notifications'
import { mapState } from 'vuex'

function capitalize (string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase()
}

export default {
  components: {
    Notifications
  },

  data () {
    return {
      menu: false,
      items: [
        { title: 'Chat', icon: 'chat', action: 'chat' },
        { title: 'Settings', icon: 'settings', action: 'account' },
        { title: 'Log out', icon: 'lock', action: 'logout' }
      ]
    }
  },

  methods: {
    itemAction: function (item) {
      if (item.action === 'logout') {
        this.menu = false
        this.$auth.logout()
      } else {
        this.$router.push(item.action)
      }
    }
  },

  computed: {
    ...mapState(['user']),
    userNameCapitalize: function () {
      return capitalize(this.$auth.user().userName)
    }
  }
}
</script>

<style scoped>
.account-name {
  font-weight: 500;
}
</style>
