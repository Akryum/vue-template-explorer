<template>
  <div id="app">
    <div class="md-layout">
      <div class="md-layout-item layout-files">
        <FileExplorer
          class="pane-item files"
          :current-file.sync="currentFile"
        />
      </div>
      <div class="md-layout-item">
        <FileEditor
          v-if="currentFile"
          class="pane-item"
          :path="currentFile"
          @file="onFile"
        />
      </div>
      <div class="md-layout-item">
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
import { compile } from 'vue-template-compiler'
import stripWith from 'vue-template-es2015-compiler'
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
      try {
        const result = compile(file.content)
        let code = `const render = function () {${result.render}\n}\n
        const staticRenderFns = [${result.staticRenderFns.map(
          fn => `function () {${fn}}`
        )}
        ]`
        code = stripWith(code)
        code = code.replace(/([\[,])/g, '$1\n')
        code = js_beautify(code, {
          indent_size: 2,
        })
        this.renderCode = code
      } catch (e) {
        console.error(e)
      }
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

.md-layout
  flex-wrap nowrap

.md-layout-item
  flex auto 2 1
  width 0

.layout-files
  flex auto 1 1
  width 0
  min-width 220px

.result
  >>>
    .CodeMirror,
    .CodeMirror-gutter
      background darken(#2b2c27, 20%)
</style>
