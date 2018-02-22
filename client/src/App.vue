<template>
<v-app id="inspire">
  <v-toolbar app fixed clipped-left dark color="blue darken-3">
      <v-toolbar-title class="ml-3 mr-5 hidden-xs-and-down">
        Matcha
      </v-toolbar-title>
    <v-text-field
      flat
      solo-inverted
      prepend-icon="search"
      label="Search"
      class="hidden-sm-and-down"
      ></v-text-field>
    <v-spacer></v-spacer>
    <v-btn icon disabled class="btn--plain">
      <v-icon>notifications</v-icon>
    </v-btn>
    <v-btn flat class="btn--plain">Sign In</v-btn>
  </v-toolbar>
  <v-content>
    <router-view/>
</v-content>
<v-footer app fixed height="auto" >
  <v-card-text class="text-xs-center white-darken-text" >Crafted by <strong>arive-de</strong> and <strong>bwaegene</strong> at <strong><a href='https://www.42.fr'>42born2code</a></strong>.
  </v-card-text>
  </v-footer>
</v-app>
</template>

<script>
export default {
  name: 'App'
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
