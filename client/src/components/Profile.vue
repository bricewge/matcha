<template>
<v-layout row>
  <v-flex xs12 sm8 offset-sm2>
    <v-card class="mt-4">
      <v-card-media>
        <v-carousel :cycle="false" :lazy="true" hide-controls>
          <v-carousel-item :src="user.picture0"></v-carousel-item>
          <v-carousel-item v-if="user.picture1" :src="user.picture1">
          </v-carousel-item>
          <v-carousel-item v-if="user.picture2" :src="user.picture2">
          </v-carousel-item>
          <v-carousel-item v-if="user.picture3" :src="user.picture3">
          </v-carousel-item>
          <v-carousel-item v-if="user.picture4" :src="user.picture4">
          </v-carousel-item>
        </v-carousel>
      </v-card-media>
      <v-card-title primary-title>
        <div>
          <div class="headline">{{ user.userName }}</div>
          <span class="grey--text">
            {{ sexSign(user.sex) }} {{ user.firstName }} {{user.lastName }}
          </span>
        </div>
        <v-spacer/>
        <v-tooltip bottom>
          <v-icon medium slot="activator" color="black">whatshot</v-icon>
          <span>Fame</span>
        </v-tooltip>
        <div class="title">{{ user.fame }}</div>
      </v-card-title>
      <v-list two-line>
        <v-list-tile>
          <p>{{ user.age }} years old</p>
          <v-spacer/>
          <p>Looking for: {{ sexualPreference(user.sexualPreference)}}</p>
        </v-list-tile>
        <v-list-tile>
          <p>Last connection: {{ user.lastConnexion }}</p>
          <v-spacer/>
          <div>
            <p>Latitude: {{ user.location.latitude }}</p>
            <p>Latitude: {{ user.location.longitude }}</p>
          </div>
        </v-list-tile>
      </v-list>
      <v-card-text>
        <p>{{ user.biography }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn icon class="ml-3 my-1" @click="fake">
        <v-tooltip bottom>
          <v-icon large slot="activator" color="grey">
            report
          </v-icon>
          <span>Report as fake</span>
        </v-tooltip>
        </v-btn>
        <v-btn icon class="mx-2 my-1"  @click="block">
        <v-tooltip bottom>
          <v-icon
            large
            slot="activator"
            :color="user.blocked ? 'red' : 'black'"
            >
            block
          </v-icon>
          <span>{{ user.blocked ? 'Unblock' : 'Block' }}</span>
        </v-tooltip>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon class="mx-3 my-1" @click="like">
        <v-tooltip bottom>
          <v-icon
            large
            slot="activator"
            :color="user.liked ? 'red' : 'black'"
            v-if="user.liked"
            >
            {{ user.liked ? 'favorite' : 'favorite_border' }}
          </v-icon>
          <span>{{ user.liked ? 'Unlike' : 'Like' }}</span>
        </v-tooltip>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</v-layout>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      pictures: []
    }
  },

  async mounted () {
    const user = await this.axios.get(`/users/${this.$route.params.userName}`)
    console.log(user.data, this)
    this.user = user.data
    // TODO Remove, this is to fake data
    this.user.liked = true
    this.user.blocked = true
    // The separeate counter avoid getting some nulls in the v-for
    let picturesCount = 0
    for (let i = 0; i < 5; i++) {
      if (user.data['picture' + i]) {
        this.$set(this.pictures,
                  picturesCount,
                  {
                    src: user.data['picture' + i],
                    show: !picturesCount
                  })
        picturesCount++
      }
    }
    // NOTE Test of address lookup
    let geocoder = new google.maps.Geocoder;
    let latlng = {lat: this.user.location.latitude,
                  lng: this.user.location.longitude}
    geocoder.geocode({'location': latlng},
                     function(results, status) {
                       if (status !== 'OK') return
                       console.log(results, status)
                     })
  },

  methods: {
    sexSign: function (sex) {
      return sex === 'm' ? '♂' : '♀'
    },

    sexualPreference: function (preference) {
      let res = ''
      if (!preference) return res
      preference = preference.split(',')
      for (let index in preference) {
        res += this.sexSign(preference[index])
      }
      return res
    },

    like: async function () {
      if (!this.user.liked) {
        await this.axios.post(`/like/${this.$route.params.userName}`)
      } else {
        await this.axios.delete(`/like/${this.$route.params.userName}`)
      }
      this.user.liked = !this.user.liked
      console.log(this.user.liked)
    },

    block: async function () {
      // TODO Block the user
    },

    fake: async function () {
      // TODO Report as fake
    }
  }
}
</script>

<style scoped>
</style>
