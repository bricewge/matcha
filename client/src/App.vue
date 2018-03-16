<template>
<v-app id="inspire">
  <page-header />
  <v-content v-if="$auth.ready()">
    <router-view :key="$route.fullPath"/>
  </v-content>
  <v-content v-if="!$auth.ready()">
    <v-container fluid fill-height class="grey lighten-1" >
      <v-layout align-center justify-center>
        <v-progress-circular
          indeterminate
          :size="50"
          color="primary"
          ></v-progress-circular>
      </v-layout>
    </v-container>
  </v-content>
  <page-footer />
</v-app>
</template>

<script>
import PageHeader from '@/components/Header.vue'
import PageFooter from '@/components/Footer.vue'
export default {
  name: 'App',
  components: {
    PageHeader,
    PageFooter
  },

  sockets: {
    connect: function () {
      // console.log('socket connected')
    },

    authenticate: function () {
      // console.log('socket authentication requested ', this.$auth.token())
      this.$socket.emit('authenticate', {token: this.$auth.token()})
    }
  }
}
</script>

<style lang="stylus">
.btn--plain {
  > .btn__content {
    &:before {
      background-color: transparent !important;
      transition: none !important;
    }
  }
}
</style>

<style>
.link-hidden {
  color: inherit;
  text-decoration: none;
}
</style>
