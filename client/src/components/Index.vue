<template>
<v-container fluid grid-list-md>
  <div class="text-xs-center py-2">
    <v-select
      v-model="sort"
      @input="sortBy"
      :items="sorts"
      item-value="text"
      return-object
      :prepend-icon="sortIcon"
      :prepend-icon-cb="toggleOrder"
      label="Sort by"
      ></v-select>
    <v-text-field
      label="Test search"
      v-model="search"
      ></v-text-field>
  </div>
  <v-data-iterator
    content-tag="v-layout"
    row
    wrap
    :items="users"
    :rows-per-page-items="rowsPerPageItems"
    :pagination.sync="pagination"
    :search="search"
    >
    <template slot="no-data">
      <v-layout align-center justify-center>
        <v-progress-circular
          indeterminate
          :size="50"
          color="secondary"
          ></v-progress-circular>
      </v-layout>
    </template>
    <v-flex
      slot="item"
      slot-scope="props"
      xs12 sm6 md4 lg3
      >
      <v-card>
        <router-link
          :to="'user/' + props.item.userName"
          >
          <v-card-media
            :src="props.item.picture0"
            height="200px"
            >
          </v-card-media>
        </router-link>
        <v-card-title>
          <div>
            <div class="headline" v-text="props.item.userName"/>
            <span class="grey--text">
              {{ sexSign(props.item.sex) }} {{ props.item.firstName }} {{ props.item.lastName }}
            </span>
          </div>
        </v-card-title>
        <v-card-actions>
          <span class="mx-auto black--text">
            <v-icon color="black">whatshot</v-icon>
            <span>{{ props.item.fame || 0}}</span>
          </span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="like(props.item, props.index)"
            >
            <v-icon color="red" v-show="props.item.liked">
              favorite
            </v-icon>
            <v-icon v-show="!props.item.liked">
              favorite_border
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-data-iterator>
</v-container>
</template>

<!-- TODO Filter by age, fame, localisation, tags -->
<script>
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'
import geolib from 'geolib'

function compare (a,b) {
  if (a.fame < b.fame)
    return -1;
  if (a.fame > b.fame)
    return 1;
  return 0;
}


export default {
  components: {
    VuetifyGoogleAutocomplete
  },

  data () {
    return {
      users: [],
      interests: [],
      rowsPerPageItems: [4, 6, 12],
      pagination: {
        sortBy: 'fame',
        descending: true,
        rowsPerPage: 4
      },
      sort: 'Fame',
      sorts: [
        { text: 'Age', sort: 'age'},
        { text: 'Fame', sort: 'fame'},
        { text: 'Location', sort: 'distance'},
        { text: 'Interests', sort: 'interestsInCommon'}
      ],
      sortIcon: 'arrow_downward',
      search: '',
      filterTest: () => {}
    }
  },

  async mounted () {
    const users = await this.axios.get('users')
    for (let i in users.data) {
      let user = users.data[i]
      if (user.userName === this.$auth.user().userName) continue
      let latitude = user.location.x
      let longitude = user.location.y
      user.distance = geolib.getDistance(
        this.$auth.user().location,
        {latitude: latitude, longitude, longitude}
      )
      this.users.push(user)
    }
    console.log(this.users)
  },

  methods: {
    sexSign: function (sex) {
      return sex === 'm' ? '♂' : '♀'
    },

    like: async function (user) {
      const index = this.users.indexOf(user)
      const userNameLiked = this.users[index].userName
      const liked = this.users[index].liked
      if (!liked) {
        await this.axios.post(`/like/${userNameLiked}`)
      } else {
        await this.axios.delete(`/like/${userNameLiked}`)
      }
      this.users[index].liked = !liked
    },

    getAddressData (addressData, placeResultData, id) {
      console.log(addressData)
    },

    toggleOrder () {
      this.sortIcon = this.pagination.descending ? 'arrow_upward' : 'arrow_downward'
      this.pagination.descending = !this.pagination.descending
    },

    sortBy (input) {
      this.pagination.sortBy = input.sort
    }
  }
}
</script>

<style scoped>
</style>
