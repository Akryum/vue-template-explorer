<template>
  <div class="file-explorer">
    <md-toolbar class="toolbar md-dense md-primary">
      <div class="md-toolbar-section-start">
        <md-button
          @click="intentNewFile()"
        >
          Create file
        </md-button>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-icon-button"
          :disabled="!currentFile"
          @click="currentFile && intentRename()"
        >
          <md-icon>edit</md-icon>
          <md-tooltip md-direction="bottom">Rename file</md-tooltip>
        </md-button>
        <md-button
          class="md-icon-button"
          :disabled="!currentFile"
          @click="currentFile && (confirmRemove = true)"
        >
          <md-icon>delete</md-icon>
          <md-tooltip md-direction="bottom">Remove file</md-tooltip>
        </md-button>
      </div>
    </md-toolbar>
    <md-list class="tree">
      <md-list-item
        v-for="(file, index) of files"
        :key="index"
        class="file-item"
        :class="{ 'active': file === currentFile }"
        @click="openFile(file)"
      >
        <md-icon>insert_drive_file</md-icon>
        <div class="md-list-item-text">
          {{ file }}
        </div>
        <md-tooltip md-direction="right">{{ file }}</md-tooltip>
      </md-list-item>
    </md-list>

    <md-dialog-prompt
      :md-active.sync="newFileShown"
      v-model="newFilePath"
      md-title="Create new file"
      md-input-placeholder="File name"
      md-confirm-text="Create"
      @md-confirm="createFile()"
    />

    <md-dialog-confirm
      :md-active.sync="confirmRemove"
      md-title="Confirm removing file?"
      :md-content="currentFile"
      md-confirm-text="Remove"
      @md-confirm="removeFile(currentFile)"
    />

    <md-dialog-prompt
      :md-active.sync="renameShown"
      v-model="newFilePath"
      md-title="Rename file"
      md-input-placeholder="File name"
      md-confirm-text="Rename"
      @md-confirm="renameFile()"
    />
  </div>
</template>

<script>
export default {
  props: {
    currentFile: String,
  },

  data () {
    return {
      files: [],
      newFileShown: false,
      newFilePath: '',
      confirmRemove: false,
      renameShown: false,
    }
  },

  watch: {
    files: 'saveFiles',
  },

  created () {
    const data = localStorage.getItem('files')
    data && (this.files = JSON.parse(data))
  },

  methods: {
    saveFiles () {
      localStorage.setItem('files', JSON.stringify(this.files))
    },

    intentNewFile () {
      this.newFilePath = ''
      this.newFileShown = true
    },

    createFile () {
      const path = this.newFilePath
      if (path) {
        localStorage.setItem(path, JSON.stringify({
          content: '',
          mime: 'text/html',
        }))
        this.files.push(path)
        this.newFileShown = false
        this.openFile(path)
      }
    },

    removeFile (path) {
      localStorage.removeItem(path)
      const index = this.files.indexOf(path)
      index !== -1 && this.files.splice(index, 1)
      this.openFile(null)
    },

    intentRename () {
      this.newFilePath = this.currentFile
      this.renameShown = true
    },

    renameFile () {
      const path = this.newFilePath
      const oldPath = this.currentFile
      if (path && path !== this.currentFile) {
        localStorage.setItem(path, localStorage.getItem(oldPath))
        localStorage.removeItem(oldPath)
        const index = this.files.indexOf(oldPath)
        index !== -1 && this.files.splice(index, 1, path)
        this.openFile(path)
      }
    },

    openFile (file) {
      this.$emit('update:currentFile', file)
    },
  },
}
</script>

<style lang="stylus" scoped>
.file-explorer
  display flex
  flex-direction column

.toolbar
  flex auto 0 0

.tree
  flex 100% 1 1
  height 100%

.file-item
  opacity .5
  &.active
    opacity 1
</style>

