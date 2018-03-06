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
              v-model="formData.userName"
              name="userName"
              label="Username"
              :rules="[v => !!v || 'Username is required']"
              type="text"
              ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="formData.email"
              name="email"
              label="Email"
              :rules="emailRules"
              type="text"
              ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6>
            <v-text-field
              v-model="formData.firstName"
              name="firstName"
              label="First name"
              :rules="[v => !!v || 'First name is required']"
              type="text"
              ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="formData.lastName"
              name="lastName"
              label="Last name"
              :rules="[v => !!v || 'Last name is required']"
              type="text"
              ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              v-model="formData.sex"
              label="Sex"
              :items="sexs"
              ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              v-model="formData.sexualPreference"
              label="Sexual preference"
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
              v-model="formData.age"
              label="Age"
              hint="Be honest"
              min="17"
              max="77"
              thumb-label
              ></v-slider>
          </v-flex>

          <v-flex xs12>
            <v-select
              v-model="formData.interests"
              label="Interests"
              append-icon
              chips
              deletable-chips
              tags
              ></v-select>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              v-model="formData.biography"
              multi-line
              >
              <div slot="label">
                Biography
              </div>
            </v-text-field>
          </v-flex>

          <v-flex xs12>
            <file-input
              :accept="acceptImages"
              selectLabel="Profile picture"
              @input="getUploadedFile($event, 'profile')"
              ></file-input>
          </v-flex>

          <v-flex xs6 sm3
                  v-for="(val, key) in pictures"
                  :key="key">
            <file-input
              :accept="acceptImages"
              :selectLabel="'Picture ' + key"
              @input="getUploadedFile($event, key)"
              ></file-input>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              v-model="formData.password"
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
              v-model="formData.confirmPassword"
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
      formData: {
        userName: this.$auth.user().userName,
        email: this.$auth.user().email,
        firstName: this.$auth.user().firstName,
        lastName: this.$auth.user().lastName,
        sex: this.$auth.user().sex || null,
        sexualPreference: this.$auth.user().sexualPreference || null,
        age: this.$auth.user().age || null,
        location: this.$auth.user().location || null,
        interests: [],
        biography: this.$auth.user().biography || null,
        password: '',
        confirmPassword: '',
      },
      acceptImages: 'image/jpeg, image/png',
      profilePicture: this.$auth.user().profilePicture || null,
      pictures: {1: this.$auth.user().picture1 || null,
                 2: this.$auth.user().picture2 || null,
                 3: this.$auth.user().picture3 || null,
                 4: this.$auth.user().picture4 || null},
      emailRules: [ validEmail ],
      passwordRules: [ validPassword ],
      confirmPasswordRules: [ ],
      sexs: ['Male', 'Female'],
      sexualPreferences: ['Homo', 'Hetero', 'Bi'],
      hidePassword: true,
      alert: { type: 'error', visible: false, message: '', dismissible: true },
      form: { valid: false, submit: this.updateAccount }
    }
  },

  methods: {
    async updateAccount () {
      this.samePasswords()
      if (!this.$refs.defaultForm.$refs.form.validate()) return
      try {
        let data = new FormData()
        data.append('profilePicture', this.profilePicture)
        for (let key in this.pictures) {
          if (this.pictures[key]) {
            data.append('picture', this.pictures[key])
          }
        }
        for (let key in this.formData) {
          data.append(key, this.formData[key])
        }
        const config = {
          headers: { 'content-type': 'multipart/form-data' }
        }
        const response = await this.axios.put(
          'account', data, config)
        await this.$auth.fetch()
        this.alert.visible = false
      } catch (err) {
        console.log(err)
        this.alert.type = 'error'
        this.alert.message = err.response.data.message
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
      if (id === 'profile') {
        this.profilePicture = e
      } else if (id >= 1 && id <= 5) {
        this.pictures[id] = e
      }
    },
  }
}
</script>

<style scoped>
</style>
