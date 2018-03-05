<template>
<v-layout
  column
  align-center
  >
  <v-flex
    >
    <v-avatar tile size="100%" v-if="imageUrl">
      <img
        :src="imageUrl"
        ref="imageUrl"
        @click="onPickFile"
        style="cursor: pointer;"
        >
    </v-avatar>
  </v-flex>
  <div style="margin-top: auto">
    <v-btn depressed @click="onPickFile" v-if="!imageUrl">
      {{ selectLabel }}
    </v-btn>
    <v-btn depressed class="error" @click="removeFile" v-else>
      {{ removeLabel }}
    </v-btn>
    <input
      type="file"
      ref="image"
      name="image"
      :accept="accept"
      @change="onFilePicked"
      >
  </div>
</v-layout>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    accept: {
      type: String,
      default: '*'
    },
    selectLabel: {
      type: String,
      default: 'Select an image'
    },
    removeLabel: {
      type: String,
      default: 'Remove'
    }
  },

  data() {
    return {
      imageUrl: ''
    }
  },

  watch: {
    value(v) {
      this.imageUrl = v
    }
  },

  mounted() {
    this.imageUrl = this.value
  },

  methods: {
    onPickFile() {
      this.$refs.image.click()
    },

    onFilePicked(event) {
      const files = event.target.files || event.dataTransfer.files

      if (files && files[0]) {
        let filename = files[0].name

        if (filename && filename.lastIndexOf('.') <= 0) {
          return //return alert('Please add a valid image!')
        }

        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])

        this.$emit('input', files[0])
      }
    },

    removeFile() {
      this.imageUrl = ''
    }
  }
}
</script>

<style scoped>
input[type=file] {
    position: absolute;
    left: -99999px;
}
</style>
