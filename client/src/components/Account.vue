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
            :value="!$auth.check('active')"
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
              v-model="sex"
              label="Sex"
              :items="sexs"
              ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              v-model="sexualPreference"
              ref="sexualPreference"
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
              v-model="interests"
              label="Interests"
              multiple
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
              :value="formData.picture0"
              :accept="acceptImages"
              selectLabel="Profile picture"
              @remove="removeUploadedFile($event, 'picture0')"
              @input="getUploadedFile($event, 'picture0')"
              ></file-input>
          </v-flex>

          <v-flex xs6 sm3
                  v-for="(val, key) in optionalPictures"
                  :key="key">
            <file-input
              :value="formData['picture' + key]"
              :accept="acceptImages"
              :selectLabel="'Picture ' + key"
              @input="getUploadedFile($event, 'picture' + key)"
              @remove="removeUploadedFile($event, 'picture' + key)"
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

<!-- TODO Fix address not displayed from the server, need update to googleautocomplete -->
<script>
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'
import DefaultForm from '@/components/DefaultForm'
import AuthenticationService from '@/services/AuthenticationService'
import FileInput from '@/components/FileInput'
import {validPassword, validEmail} from '@/util/validation'
import axios from 'axios'

function formAppend (form, name, data) {
  if (data) {
    form.append(name, data)
  }
}

function initialFormData(view) {
  return {
    userName: view.$auth.user().userName,
    email: view.$auth.user().email,
    firstName: view.$auth.user().firstName,
    lastName: view.$auth.user().lastName,
    sex: view.$auth.user().sex || null,
    sexualPreference: view.$auth.user().sexualPreference || null,
    age: view.$auth.user().age || null,
    locationName: view.$auth.user().locationName || null,
    location: view.$auth.user().location || null,
    picture0: view.$auth.user().picture0 || null,
    picture1: view.$auth.user().picture1 || null,
    picture2: view.$auth.user().picture2 || null,
    picture3: view.$auth.user().picture3 || null,
    picture4: view.$auth.user().picture4 || null,
    biography: view.$auth.user().biography || null,
    password: '',
    confirmPassword: '',
  }
}

export default {
  components: {
    DefaultForm,
    VuetifyGoogleAutocomplete,
    FileInput
  },

  data () {
    return {
      formData: initialFormData(this),
      interests: this.$auth.user().interests || [],
      acceptImages: 'image/jpeg, image/png',
      files: {},
      emailRules: [ validEmail ],
      passwordRules: [ validPassword ],
      confirmPasswordRules: [ ],
      sexs: [
        {text: 'Male', value: 'm'},
        {text: 'Female', value: 'f'},
      ],
      sexualPreferences: ['Homo', 'Hetero', 'Bi'],
      hidePassword: true,
      alert: { type: 'error', visible: false, message: '', dismissible: true },
      form: { valid: false, submit: this.updateAccount }
    }
  },

  computed: {
    optionalPictures () {
      const pictures = {
        1: this.formData.picture1,
        2: this.formData.picture2,
        3: this.formData.picture3,
        4: this.formData.picture4
      }
      return pictures
    },

    sex: {
      get () {
        return this.formData.sex
      },
      set (sex){
        this.formData.sex = sex
        this.sexualPreference = this.$refs.sexualPreference.value
      }
    },

    sexualPreference: {
      get () {
        const sex = this.formData.sex
        if (!sex) return 'Bi'
        switch (this.formData.sexualPreference) {
        case 'm':
          return sex === 'm' ? 'Homo' : 'Hetero'
        case 'f':
          return sex === 'f' ? 'Homo' : 'Hetero'
        default:
          return 'Bi'
        }
      },
      set (preference) {
        const sex = this.formData.sex
        if (!sex) return
        let result = ''
        switch (preference) {
        case 'Hetero':
          result = sex === 'm' ? 'f' : 'm'
          break
        case 'Homo':
          result = sex === 'm' ? 'm' : 'f'
          break
        default:
          result = 'm,f'
        }
        this.formData.sexualPreference = result
      }
    }
  },

  methods: {
    async updateAccount () {
      this.samePasswords()
      if (!this.$refs.defaultForm.$refs.form.validate()) return
      console.log(this.formData)
      try {
        // Locate the user even if she hasn't given her location
        if (!this.formData.location) {
          const ip = await axios.get('/location', {baseURL: ''})
          this.formData.location = {
            latitude: ip.data.latitude,
            longitude: ip.data.longitude
          }
        }
      } catch (err) {console.log(err)}
      try {
        let data = new FormData()
        if (this.interests && this.interests.length) {
          data.append('interests', JSON.stringify(this.interests))
        }
        for (let key in this.formData) {
          if (key === 'location') {
            data.append('location', JSON.stringify(
              this.formData.location,
              ['latitude', 'longitude']
            ))
          } else {
            formAppend(data, key, this.formData[key])
          }
        }
        // Need to be done last since it may modifies data
        for (let key in this.files) {
          if (this.files[key] === 'remove') {
            data.set(key, 'remove')
          } else {
            formAppend(data, key, this.files[key])
          }
        }
        const config = {headers: {'content-type': 'multipart/form-data'}}
        const response = await this.axios.put('account', data, config)
        await this.$auth.token(response.headers.authorization)
        await this.$auth.fetch()
        this.formData = initialFormData(this)
        this.alert.visible = false
      } catch (err) {
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
      this.formData.locationName = placeResultData.formatted_address
      this.formData.location = {
        latitude: addressData.latitude,
        longitude: addressData.longitude,
      }
    },

    removeUploadedFile(e, id) {
      this.files[id] = 'remove'
      // this.formData[id] = null
    },

    getUploadedFile(e ,id) {
      this.files[id] = e
    }
  }
}
</script>

<style scoped>
</style>
