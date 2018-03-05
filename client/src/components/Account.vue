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

				<v-flex xs6 offset-xs3 class="text-xs-center">
					<img
            :src="imageProfile.url"
            height="150"
            v-if="imageProfile.url"/>
					<v-text-field
            label="Profile picture"
            @click="pickFile"
            v-model="imageProfile.name"
            append-icon="portrait"
            >
					<input
						type="file"
						style="display: none"
						ref="imageProfile"
						accept="image/*"
						@change="onFilePicked"
					>
          </v-text-field>
				</v-flex>

				<!-- <v-flex xs6 md3 class="text-xs-center"> -->
				<!-- 	<img -->
        <!--     :src="imageUrl" -->
        <!--     height="150" -->
        <!--     v-if="imageUrl"/> -->
				<!-- 	<v-text-field -->
        <!--     label="Picture (optional)" -->
        <!--     @click="pickFile" -->
        <!--     v-model="imageName" -->
        <!--     ></v-text-field> -->
				<!-- 	<input -->
				<!-- 		type="file" -->
				<!-- 		style="display: none" -->
				<!-- 		ref="image" -->
				<!-- 		accept="image/*" -->
				<!-- 		@change="onFilePicked" -->
				<!-- 	> -->
				<!-- </v-flex> -->


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
import {validPassword, validEmail} from '@/util/validation'

export default {
  components: {
    DefaultForm,
    VuetifyGoogleAutocomplete
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
      profilePicture: null,
      biography: '',
      imageProfile: {name: '', url: '', file: ''},
		  images: [
        {name: '', url: '', file: ''},
        {name: '', url: '', file: ''},
        {name: '', url: '', file: ''},
        {name: '', url: '', file: ''}
        ],
      password: '',
      passwordRules: [ validPassword ],
      confirmPassword: '',
      confirmPasswordRules: [ ],
      hidePassword: true,
      alert: { type: 'warning',
               visible: !this.$auth.check('active'),
               message: 'To activate your account this form must be completed in full.',
               dismissible: false },
      form: { valid: false, submit: this.updateAccount }
    }
  },

  methods: {
    async updateAccount () {
      this.samePasswords()
      if (!this.$refs.defaultForm.$refs.form.validate()) return
      try {
        // console.log(this.imageFile)
        // let data2 = new FormData()
        // data2.append(this.imageName, this.imageFile)
        // console.log(data2)
        const config = {
          headers: { 'content-type': 'multipart/form-data' }
        }
        const data = {
          userName: this.userName || null,
          email: this.email || null,
          firstName: this.firstName || null,
          lastName: this.lastName || null,
          image1: this.imageFile,
          password: this.password || null
        }
        const response = await this.axios.put(
          'account', data, config)
        await this.$auth.fetch()
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
      this.location = addressData;
    },

    pickFile (e) {
      console.log(e)
      this.$refs.image.click ()
    },

		onFilePicked (e) {
      console.log(e)
			const files = e.target.files
			if(files[0] !== undefined) {
				this.imageName = files[0].name
				if(this.imageName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.imageUrl = fr.result
					this.imageFile = files[0] // this is an image file that can be sent to server...
				})
			} else {
				this.imageName = ''
				this.imageFile = ''
				this.imageUrl = ''
			}
		}
  },

}
</script>

<style scoped>
</style>
