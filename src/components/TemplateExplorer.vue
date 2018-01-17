<template>
  <div class="template-explorer">
    <div class="md-layout">
      <div class="md-layout-item layout-files">
        <FileExplorer
          class="pane-item files"
          :current-file.sync="currentFile"
        />
      </div>
      <div class="md-layout-item layout-file">
        <FileEditor
          v-if="currentFile"
          class="pane-item"
          :path="currentFile"
          @file="onFile"
        />
      </div>
      <div class="md-layout-item layout-result">
        <template v-if="currentFile">
          <md-toolbar class="toolbar">
            <md-checkbox v-model="optimize">
              Optimize
            </md-checkbox>
          </md-toolbar>
          <CodeEditor
            class="code"
            mode="text/javascript"
            :code="renderCode"
            read-only
          />
        </template>
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
      code: '',
      renderCode: '',
      optimize: true,
    }
  },

  watch: {
    code: 'updateCode',
    optimize: 'updateCode',
  },

  methods: {
    onFile (file) {
      this.code = file.content
    },

    updateCode () {
      try {
        const result = compile(this.code, {
          optimize: this.optimize
        })
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

<style lang="stylus" scoped>
.template-explorer
  height 100%

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

.layout-result
  display flex
  flex-direction column
  height 100%

  .toolbar
    flex auto 0 0
    padding-left 24px

  .code
    flex 100% 1 1
    height 0

    >>>
      .CodeMirror,
      .CodeMirror-gutter
        background darken(#2b2c27, 20%)
</style>
