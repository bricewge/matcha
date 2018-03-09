<template>
<v-layout column>
  <v-flex xs12 md10 offset-md1>
    <v-card
      flat
      class="py-5"
      >
      <v-form
        @submit.prevent="filter"
        >
        <v-layout wrap row>
          <v-flex xs6>
            <v-layout row wrap>
              <v-flex xs12>
                <p class="title text-xs-center">Age</p>
              </v-flex>
              <v-flex xs2 offset-xs2>
                <v-text-field
                  mask="##"
                  label="Min"
                  ref="ageMin">
                </v-text-field>
              </v-flex>
              <v-flex xs2 offset-xs2>
                <v-text-field
                  mask="##"
                  label="Max"
                  ref="ageMax">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
        <v-flex xs6>
          Fame
        </v-flex>
        <v-flex xs5>
          <vuetify-google-autocomplete
            id="map"
            append-icon="map"
            label="Location"
            types="geocode"
            v-on:placechanged="getAddressData"
            ></vuetify-google-autocomplete>
        </v-flex>
        <v-spacer/>
        <v-flex xs5>
          <v-select
            v-model="interests"
            label="Interests"
            multiple
            append-icon
            chips
            deletable-chips
            tags
            ></v-select>
        </v-flex>
        <v-flex xs6 offset-xs4>
          <v-btn
            depressed
            type="submit"
             color="primary">
            Filter</v-btn>
          <v-btn
            depressed>
            Reset</v-btn>
      </v-flex>
      </v-layout>
    </v-form>
          </v-card>
    <v-card>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs6 md4
                  v-for="(user, key) in users"
                  :key="user.userName"
                  >
            <v-card>
              <router-link
                :to="'user/' + user.userName"
                >
              <v-card-media
                :src="user.picture0"
                height="200px"
                >
              </v-card-media>
              </router-link>
              <v-card-title primary-title>
                <div>
                  <div class="headline" v-text="user.userName"/>
                  <span class="grey--text">
                    {{ sexIcon(user.sex) }} {{ user.firstName }} {{ user.lastName }}
                  </span>
                </div>
              </v-card-title>
              <v-card-actions>
                <span class="black--text">
                  <v-icon color="black">whatshot</v-icon>
                  {{ user.fame }}
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  @click="like(user, key)"
                  >
                  <v-icon v-show="user.liked">
                    favorite
                  </v-icon>
                  <v-icon v-show="!user.liked">
                    favorite_border
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-flex>
</v-layout>
</template>

<script>
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

export default {
  components: {
    VuetifyGoogleAutocomplete
  },

  data () {
    return {
      users: [],
      interests: []
    }
  },

  async mounted () {
    const users = await this.axios.get('users')
    this.users = users.data
    console.log(users)
  },

  methods: {
    sexIcon: function (sex) {
      return sex === 'Male' ? '♂' : '♀'
    },

    like: function (user, key) {
      this.users[key].liked = !this.users[key].liked
    },

    getAddressData (addressData, placeResultData, id) {
      console.log(addressData)
      }
  }
}
</script>

<style scoped>
</style>
