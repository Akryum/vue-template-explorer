<template>
  <CodeEditor
    v-if="file"
    :code.sync="file.content"
    :mode="file.mime"
  />
</template>

<script>
export default {
  props: {
    path: String,
  },

  data () {
    return {
      file: null,
    }
  },

  watch: {
    path: {
      handler: 'openFile',
      immediate: true,
    },

    file: {
      handler: 'saveFile',
      deep: true,
    },
  },

  methods: {
    openFile () {
      this.file = null
      if (this.path) {
        this.file = JSON.parse(localStorage.getItem(this.path))
        this.saveFile()
      }
    },

    saveFile () {
      this.file && localStorage.setItem(this.path, JSON.stringify(this.file))
      this.$emit('file', this.file)
    },
  },
}
</script>
