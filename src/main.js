import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import * as myJson from '@/assets/events'

Vue.config.productionTip = false

let eventsArray = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : myJson.events
localStorage.setItem('events', JSON.stringify(eventsArray))

export const db = JSON.parse(localStorage.getItem('events'))

export const convertParticipants = (items) => {
  let str = ''
  let arrFromObj = items.map(item => {
    if (typeof item !== "undefined") {
      return `${item['name']} ${item['surname']}`
    }
    return ''
  })

  arrFromObj.forEach(string => {
    str += string + " "
  })

  return str
}

export const updateLocalStorage = (events) => {
  localStorage.setItem('events', JSON.stringify(events))
  this.events = JSON.parse(localStorage.getItem('events'))
}

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
