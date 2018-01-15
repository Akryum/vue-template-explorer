import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
import App from './App.vue'

Vue.use(VueMaterial)

const components = require.context('./components', true, /\.vue$/i)
const componentReg = /(\w+)\./i
components.keys().forEach(key => {
  const name = key.match(componentReg)[1]
  Vue.component(name, {
    name,
    ...components(key).default,
  })
})

new Vue({
  el: '#app',
  ...App,
})
