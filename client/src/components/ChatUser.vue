<template>
<v-layout align-center justify-center>
  <v-flex xs12 sm10 md8 class="mt-3">
    <v-card>
      <v-card-title class="grey lighten-3">
        <v-toolbar-title class="text-xs-center">
          Chat with
          <router-link
            :to="'/profile/' + user.userName"
            >
          {{ user.userName }}
          </router-link>
        </v-toolbar-title>
      </v-card-title>
      <v-list>
        <v-list-tile
          v-for="(msg, index) in messages"
          :key="index"
          avatar
          >
          <v-list-tile-avatar>
            <v-avatar class="mr-2">
              <img
                :src="user.userName === msg.toUserName ? $auth.user().picture0 : user.picture0"
                >
            </v-avatar>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title
              v-text="msg.message"
              ></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-form
        @submit.prevent="sendMessage">
        <v-text-field
          v-model="message"
          solo
          dark
          append-icon="send"
          :append-icon-cb="sendMessage"
          label="Send a message"
        >
      </v-text-field>
        </v-form>
    </v-card>
  </v-flex>
</v-layout>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      messages: [ ],
      message: ''
    }
  },

  async mounted () {
    try {
      let user = await this.axios.get('/users/' + this.$route.params.userName)
      this.user = user.data
      let messages = await this.axios.get('/messages/' + this.$route.params.userName)
      this.messages = messages.data
      // console.log(this.messages, user, this.$auth.user())
    } catch (err) {
      // console.log(err)
      this.$router.push('/403')
    }
  },

  computed: {
  },

  methods: {
    sendMessage: async function () {
      // console.log('Send message:', this.message)
      const newMsg = {
        fromUserName: this.$auth.user().userName,
        toUserName: this.$route.params.userName,
        message: this.message
      }
      this.$socket.emit('newMessage', newMsg)
      this.messages.push(newMsg)
      this.message = ''
    }
  },

  sockets: {
    newMessage: function (msg) {
      // console.log('New message', msg)
      this.messages.push(msg)
    }
  }
}
</script>

<style scoped>
</style>
