<template>
<v-layout align-center justify-center>
  <v-flex xs12 sm10 md8 class="mt-3">
    <v-card>
      <v-card-title class="grey lighten-3">
        <v-toolbar-title class="text-xs-center">
          Chat
        </v-toolbar-title>
      </v-card-title>
      <v-list>
        <v-list-tile
          avatar
          v-for="user in users"
          :key="user.Username"
          @click="$router.push('/chat/' + user.userName)">
          <v-list-tile-avatar>
            <img :src="user.picture0">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="user.userName"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <span class="mx-auto">
              <v-icon color="black">whatshot</v-icon>
              {{ user.fame }}
            </span>
            </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-flex>
</v-layout>
</template>

<script>
export default {
  data () {
    return {
      users: [ ]
    }
  },

  async mounted () {
    try {
      let matchs = await this.axios.get('/matchs')
      this.users = matchs.data
      // console.log(this.users)
    } catch (err) { }
  },

  computed: {
  },

  methods: {
  },

  sockets: {
    newMessage: function (msg) {
      // console.log('New message', msg)
      this.messages.push(nmsg)
    }
  }
}
</script>

<style scoped>
</style>
