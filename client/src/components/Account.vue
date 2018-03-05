<template>
<v-container fluid fill-height>
  <v-layout align-center justify-center>
    <v-flex xs12 sm10 md8>
      <default-form
        title="Account settings"
        :alert="alert"
        :form="form"
        ref="defaultForm">
        <v-layout wrap row justify-space-between slot="fields">
          <v-alert
            type="warning"
            value="!$auth.check('active')"
            transition="scale-transition"
            >
            To activate your account this form must be completed in full.
          </v-alert>
          <v-flex xs12>
            <v-text-field
              required
              v-model="userName"
              name="userName"
              label="Username"
              :rules="[v => !!v || 'Username is required']"
              type="text"
              ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              required
              v-model="email"
              name="email"
              label="Email"
              :rules="emailRules"
              type="text"
              ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6>
            <v-text-field
              required
              v-model="firstName"
              name="firstName"
              label="First name"
              :rules="[v => !!v || 'First name is required']"
              type="text"
              ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              required
              v-model="lastName"
              name="lastName"
              label="Last name"
              :rules="[v => !!v || 'Last name is required']"
              type="text"
              ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              label="Sex"
              v-model="sex"
              :items="sexs"
              ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              label="Sexual preference"
              v-model="sexualPreference"
              :items="sexualPreferences"
              ></v-select>
          </v-flex>
          <v-flex xs-12>
            <vuetify-google-autocomplete
              id="map"
              append-icon="map"
              label="Address (optional)"
              types="geocode"
              v-on:placechanged="getAddressData"
              ></vuetify-google-autocomplete>
          </v-flex>
          <v-flex xs12>
            <v-slider
              label="Age"
              hint="Be honest"
              min="17"
              max="77"
              thumb-label
              v-model="age"
              ></v-slider>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              multi-line
              v-model="biography"
              >
              <div slot="label">
                Biography
              </div>
            </v-text-field>
          </v-flex>


          <v-flex xs12>
            <file-input
              accept="image/*"
              selectLabel="Profile picture"
              @input="getUploadedFile($event, 'profile')"
              ></file-input>
          </v-flex>

          <v-flex xs6 sm3
            v-for="(val, key) in pictures"
            :key="key">
            <file-input
              accept="image/*"
              :selectLabel="'Picture ' + key"
              @input="getUploadedFile($event, key)"
              ></file-input>
          </v-flex>


          <v-flex xs12>
            <v-text-field
              v-model="password"
            v-on:input="samePasswords"
            name="password"
            label="Password"
            :rules="passwordRules"
            :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (hidePassword = !hidePassword)"
            :type="hidePassword ? 'password' : 'text'"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
          <v-text-field
            v-model="confirmPassword"
            v-on:input="samePasswords"
            name="confirmPassword"
            label="Confirm password"
            :rules="confirmPasswordRules"
            :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (hidePassword = !hidePassword)"
            :type="hidePassword ? 'password' : 'text'"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout slot="actions">
          <v-spacer></v-spacer>
          <v-btn type="submit"
                 color="primary">Update</v-btn>
        </v-layout>
      </default-form>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'
import DefaultForm from '@/components/DefaultForm'
import AuthenticationService from '@/services/AuthenticationService'
import FileInput from '@/components/FileInput'
import {validPassword, validEmail} from '@/util/validation'

export default {
  components: {
    DefaultForm,
    VuetifyGoogleAutocomplete,
    FileInput
  },

  data () {
    return {
      userName: this.$auth.user().userName,
      email: this.$auth.user().email,
      emailRules: [ validEmail ],
      firstName: this.$auth.user().firstName,
      lastName: this.$auth.user().lastName,
      sex: this.$auth.user().sex,
      sexs: ['Male', 'Female'],
      sexualPreference: this.$auth.user().sex,
      sexualPreferences: ['Homo', 'Hetero', 'Bi'],
      age: null,
      location: {},
      profilePicture: '',
      pictures: {1: '', 2: '', 3: '', 4: ''},
      biography: '',
      password: '',
      passwordRules: [ validPassword ],
      confirmPassword: '',
      confirmPasswordRules: [ ],
      hidePassword: true,
      alert: { type: 'error', visible: false, message: '' },
      form: { valid: false, submit: this.updateAccount }
    }
  },

  methods: {
    async updateAccount () {
      this.samePasswords()
      if (!this.$refs.defaultForm.$refs.form.validate()) return
      try {
        const config = {
          headers: { 'content-type': 'multipart/form-data' }
        }
        const data = {
          userName: this.userName || null,
          email: this.email || null,
          firstName: this.firstName || null,
          lastName: this.lastName || null,
          password: this.password || null
        }
        const response = await this.axios.put(
          'account', data, config)
        await this.$auth.fetch()
        this.alert.visible = false
      } catch (err) {
        this.alert.type = 'error'
        this.alert.message = err.response.data.message
        this.alert.dismissible = true
        this.alert.visible = true
      }
    },

    // TODO Tidy this thing up. And it's duplicated code from Reset.vue...
    samePasswords () {
      if (!this.confirmPassword && this.password) {
        this.confirmPasswordRules = [v => !!v || 'Confirm password is required']
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordRules = [ v => 'Password aren\'t the same' ]
      } else {
        this.confirmPasswordRules = [ ]
      }
    },

    getAddressData (addressData, placeResultData, id) {
      this.location = addressData;
    },

    getUploadedFile(e ,id) {
      console.log(e, id, this, event)
      // this.image = e
    },
  }
}
</script>

<style scoped>
</style>
