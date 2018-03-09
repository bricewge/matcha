<template>
<v-container fluid grid-list-md>
  <div class="text-xs-center py-2">
    <v-btn color="primary" @click.native="toggleOrder">Toggle sort order</v-btn>
    <v-select
      v-model="sort"
      @input="sortBy()"
      :items="sorts"
      overflow
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
    <v-flex
      slot="item"
      slot-scope="props"
      xs12
      sm6
      md4
      lg3
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
              {{ sexIcon(props.item.sex) }} {{ props.item.firstName }} {{ props.item.lastName }}
            </span>
          </div>
        </v-card-title>
        <v-card-actions>
          <span class="black--text">
            <v-icon color="black">whatshot</v-icon>
            {{ props.item.fame || 0}}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="like(props.item, props.index)"
            >
            <v-icon v-show="props.item.liked">
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

<!-- TODO Sort by location -->
<!-- TODO Use separated selector to sort and reverse the sort -->
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
        rowsPerPage: 6
      },
      sort: 'Fame',
      sorts: [
        { text: 'Age' },
        { text: 'Fame' },
        { text: 'Location' }
      ],
      search: '',
      filterTest: () => {}
    }
  },

  async mounted () {
    const users = await this.axios.get('users')
    this.users = users.data
    // console.log(users)
    const test = geolib.getDistance(
      {latitude: 51.5103, longitude: 7.49347},
      {latitude: "51° 31' N", longitude: "7° 28' E"}
    )
    console.log(test)
  },

  methods: {
    sexIcon: function (sex) {
      return sex === 'Male' ? '♂' : '♀'
    },

    like: function (user) {
      const index = this.users.indexOf(user)
      this.users[index].liked = !this.users[index].liked
    },

    getAddressData (addressData, placeResultData, id) {
      console.log(addressData)
    },

    toggleOrder () {
      this.pagination.descending = !this.pagination.descending
    },

    sortBy (sorting) {
      console.log(this.pagination)
      this.pagination.sortBy = this.sort.text.toLowerCase()
    }
  }
}
</script>

<style scoped>
</style>
