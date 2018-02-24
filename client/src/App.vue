<template>
<v-app id="inspire">
  <page-header />
  <v-content>
    <router-view />
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
