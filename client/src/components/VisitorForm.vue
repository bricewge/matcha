<template>
<v-container fluid fill-height class="grey lighten-1" >
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-6">
        <v-card-title class="grey lighten-3">
          <v-toolbar-title class="text-xs-center">
            {{ title }}</v-toolbar-title>
        </v-card-title>
        <v-form
          v-model="form.valid"
          ref="form"
          @submit.prevent="form.submit"
          lazy-validation>
          <v-card-text>
           <slot name="fields">No fields defined</slot>
            <v-alert
              ref="alert"
              :type="alert.type"
              v-model="alert.visible"
              dismissible
              transition="scale-transition"
              >{{ alert.message }}</v-alert>
          </v-card-text>
          <v-card-actions class="pb-3 mx-1">
           <slot name="actions">No actions defined</slot>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    form: {
      type: Object,
      default: () => ({
        valid: true,
        submit: () => {}
      })
    },
    alert: {
      type: Object,
      default: () => ({
        type: 'error',
        visible: false,
        message: 'Error message'
      })
    }
  }
}
</script>

<style>
.layout.slot a {
    align-self: center;
}
</style>
