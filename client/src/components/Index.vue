<template>
<v-container fluid grid-list-sm>
  <v-card class="my-3 px-2 elevation-1 grey lighten-3">
    <v-form
      @submit.prevent="filter"
      >
      <v-layout wrap>
        <v-flex xs2>
          <v-text-field
            v-model="ageMin"
            mask="##"
            label="Age min"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field
            v-model="ageMax"
            mask="##"
            label="Age max"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field
            v-model="fameMin"
            mask="####"
            label="Fame min"
            class="fameInput"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field
            v-model="fameMax"
            mask="####"
            label="Fame max"
            class="fameInput"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-text-field
            v-model="distanceMax"
            mask="######"
            label="Distance"
            box
            ></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-select
            v-model="interests"
            label="Interests"
            multiple
            append-icon
            chips
            deletable-chips
            tags
            small
            ></v-select>
        </v-flex>
        <v-flex xs4>
          <v-text-field
            label="Search"
            v-model="search"
            ></v-text-field>
        </v-flex>
        <v-flex xs4>
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
        </v-flex>
      </v-layout>
    </v-form>
  </v-card>
  <v-data-iterator
    content-tag="v-layout"
    row
    wrap
    :items="filteredUsers"
    :rows-per-page-items="rowsPerPageItems"
    :pagination.sync="pagination"
    :search="search"
    >
    <!-- <template slot="no-data"> -->
    <!--   <v-layout align-center justify-center> -->
    <!--     <v-progress-circular -->
    <!--       indeterminate -->
    <!--       :size="50" -->
    <!--       color="secondary" -->
    <!--       ></v-progress-circular> -->
    <!--   </v-layout> -->
    <!-- </template> -->
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
import geolib from 'geolib'

function commonItems (a, b) {
  var setA = new Set(a)
  var setB = new Set(b)
  var intersection = new Set([...setA].filter(x => setB.has(x)))
  return intersection.size
}

export default {
  data () {
    return {
      users: [],
      interests: [],
      rowsPerPageItems: [4, 6, 12],
      pagination: {
        sortBy: 'points',
        descending: true,
        rowsPerPage: 4
      },
      sort: 'Smart',
      sorts: [
        { text: 'Age', sort: 'age'},
        { text: 'Fame', sort: 'fame'},
        { text: 'Location', sort: 'distance'},
        { text: 'Interests', sort: 'interestsInCommon'},
        { text: 'Smart', sort: 'points'}
      ],
      sortIcon: 'arrow_downward',
      search: '',
      ageMin: '',
      ageMax: '',
      fameMin: '',
      fameMax: '',
      distanceMax: ''
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
      user.points = (10000000000 / user.distance) + (user.interestsInCommon * 1000) + user.fame
      if (user.userName === 'Eriberto.Gusikowski' || user.userName === 'Adonis_Kuhic') console.log(user)
      this.users.push(user)
    }
    console.log(this.users)
  },

  computed: {
    filteredUsers (input) {
      let users = this.users
      let ageMin = parseInt(this.ageMin)
      let ageMax = parseInt(this.ageMax)
      let fameMin = parseInt(this.fameMin)
      let fameMax = parseInt(this.fameMax)
      let distanceMax = parseInt(this.distanceMax) * 1000
      if (ageMin) users = users.filter(u => u.age >= ageMin)
      if (ageMax) users = users.filter(u => u.age <= ageMax)
      if (fameMin) users = users.filter(u => u.fame >= fameMin)
      if (fameMax) users = users.filter(u => u.fame <= fameMax)
      if (distanceMax) users = users.filter(u => u.distance <= distanceMax)
      if (this.interests.length) users = users.filter(u => commonItems(this.interests, u.interests) === this.interests.length)
      console.log(this.interests)
      return users
    }
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
    },
  }
}
</script>

<style scoped>
.subheader {
    align-items: flex-end;
}
</style>
