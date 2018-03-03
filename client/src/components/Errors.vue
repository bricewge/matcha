<template>
<v-container fluid fill-height>
  <v-layout align-center>
    <v-flex text-xs-center>
      <h1 class="display-4 pb-2">{{ $store.state.route.name }}</h1>
      <p class="headline grey--text text--darken-1 message">
        {{ message[$store.state.route.name] }}
      </p>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  data () {
    return {
      message: {
        404: 'Sorry! Page not found!',
        403: 'Forbidden!'
      }
    }
  }
}
</script>

<style scoped>
.message {
  text-transform: uppercase;
}
</style>
