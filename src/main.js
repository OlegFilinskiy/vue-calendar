import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import * as myJson from '@/assets/events'

Vue.config.productionTip = false

let eventsArray = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : myJson.events
localStorage.setItem('events', JSON.stringify(eventsArray))
const data = JSON.parse(localStorage.getItem('events'))

export const db = data

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
