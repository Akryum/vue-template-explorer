<template>
  <div id="app">
    <div class="md-layout">
      <div class="md-layout-item md-size-20">
        <FileExplorer
          class="pane-item"
          :current-file.sync="currentFile"
        />
      </div>
      <div class="md-layout-item md-size-40">
        <FileEditor
          v-if="currentFile"
          class="pane-item"
          :path="currentFile"
          @file="onFile"
        />
      </div>
      <div class="md-layout-item md-size-40">
        <CodeEditor
          v-if="currentFile"
          class="pane-item result"
          mode="text/javascript"
          :code="renderCode"
          read-only
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { js_beautify } from 'js-beautify'

export default {
  data () {
    return {
      currentFile: null,
      file: null,
      renderCode: '',
    }
  },

  methods: {
    onFile (file) {
      const result = Vue.compile(file.content)
      let code = `// render
      ${result.render}\n
      // staticRenderFns
      ${result.staticRenderFns}\n`
      code = code.replace(/([\[,])/g, '$1\n')
      code = js_beautify(code, {
        indent_size: 2,
      })
      this.renderCode = code
    },
  },
}
</script>


<style lang="stylus">
body
  font-family 'Roboto', sans-serif

body,
#app
  height 100%
</style>

<style lang="stylus" scoped>
.md-layout,
.pane-item
  height 100%

.result
  >>>
    .CodeMirror,
    .CodeMirror-gutter
      background darken(#2b2c27, 20%)
</style>

