<template>
  <v-menu
    v-if="$auth.check()"
    :close-on-content-click="false"
    :disabled="!notifications.length"
    v-model="visible"
    offset-y
    bottom
    max-height="300px"
    class="mr-3"
    >
  <v-btn
    slot="activator"
    icon
    :disabled="!notifications.length"
    @click="watchingNotifications"
    class="btn--plain">
      <v-icon v-if="unseenNotification" medium>notifications_active</v-icon>
      <v-icon v-else medium>notifications</v-icon>
  </v-btn>
    <v-card>
        <v-card-title fixed class="subheading heavy grey lighten-3">
          Notifications
        </v-card-title>
      <v-list>
        <v-list-tile
          v-for="(notif, index) in notifications"
          :key="notif.id"
          avatar
          >
          <v-list-tile-avatar>
              <img :src="notif.image">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ notif.userName }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ notif.type }} you</v-list-tile-sub-title>
          </v-list-tile-content>
            <v-list-tile-action>
              <v-btn
                @click="removeNotification(index)"
                icon>
                <v-icon color="grey lighten-1">cancel</v-icon>
              </v-btn>
            </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>

export default {
  data () {
    return {
      visible: false,
      notifications: [
        {
          id: 42,
          image: 'https://api.adorable.io/avatars/400/Gideon_Reinger12.png',
          type: 'like',
          seen: true,
          userName: 'Gideon_Reinger12'
        },
        {
          id: 1337,
          image: 'https://api.adorable.io/avatars/400/Gideon_Reinger12.png',
          type: 'match',
          seen: true,
          userName: 'Gideon_Reinger12'
        },
        {
          id: 24,
          image: 'https://api.adorable.io/avatars/400/Gideon_Reinger12.png',
          type: 'message',
          seen: false,
          userName: 'Gideon_Reinger12'
        },
        {
          id: 7,
          image: 'https://api.adorable.io/avatars/400/Gideon_Reinger12.png',
          type: 'unmatch',
          seen: false,
          userName: 'Gideon_Reinger12'
        }
      ]
    }
  },

  computed: {
    unseenNotification: function () {
      return this.notifications.some(n => !n.seen)
    }
  },

  methods: {
    removeNotification: function (index) {
      console.log(`Notification ${this.notifications[index].id} removed`)
      this.notifications.splice(index, 1)
      // TODO Send message via websocket to remove notif
    },

    watchingNotifications: function () {
      for (let i in this.notifications) {
        if (!this.notifications[i].seen) {
          this.notifications[i].seen = true
          console.log(`Notification ${this.notifications[i].id} seen`)
          // TODO Send message via websocket to remove notif
        }
      }
    }
  }
}
</script>

<style scoped>
.heavy {
  font-weight: 500;
}
</style>
