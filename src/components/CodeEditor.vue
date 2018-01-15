<template>
  <div class="code-editor">
    <codemirror
      class="vue-codemirror"
      :value="code"
      :options="codemirrorOptions"
      @input="value => $emit('update:code', value)"
    />
  </div>
</template>


<script>
import Vue from 'vue'
// Code editor
import VueCodeMirror from 'vue-codemirror'
import CodeMirror from 'codemirror'
// Base style
import 'codemirror/lib/codemirror.css'
// Highlighting theme
import 'codemirror/theme/monokai.css'
// Supported modes
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
// Codemirror addons
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/xml-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/scroll/annotatescrollbar'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/matchesonscrollbar.css'
import 'codemirror/addon/search/match-highlighter'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/display/fullscreen.css'

Vue.use(VueCodeMirror, {
  options: {
    tabSize: 2,
    theme: 'monokai',
    lineNumbers: true,
    line: true,
    matchTags: {
      bothTags: true,
    },
    autoCloseTags: true,
    extraKeys: {
      'Ctrl-F': 'findPersistent',
      'Ctrl-J': 'toMatchingTag',
      'Ctrl-Space': 'autocomplete',
      'Esc': cm => {
        if (cm.getOption('fullScreen')) {
          cm.setOption('fullScreen', false)
          CodeMirror.signal(cm, 'fullscreen-off')
        }
      },
    },
    highlightSelectionMatches: {
      annotateScrollbar: true,
    },
    styleActiveLine: true,
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
  },
  events: [
    'fullscreen-off',
  ],
})

export default {
  props: {
    code: String,
    mode: String,
    readOnly: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    codemirrorOptions () {
      return {
        mode: this.mode,
        readOnly: this.readOnly,
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.vue-codemirror
  &,
  >>> .CodeMirror
    height 100%
</style>

