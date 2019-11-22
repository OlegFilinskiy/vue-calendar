import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import * as myJson from '@/assets/events'

Vue.config.productionTip = false

let eventsArray = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : myJson.events
localStorage.setItem('events', JSON.stringify(eventsArray))

const db = JSON.parse(localStorage.getItem('events'))

const convertParticipants = (items) => {
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

const updateLocalStorage = (events) => {
  localStorage.setItem('events', JSON.stringify(events))
  this.events = JSON.parse(localStorage.getItem('events'))
}

const transformDate = date => {
  const dateArray = date.slice().split(' ')
  const reverceDate = [...dateArray][0].split('-').reverse().join('-')
  const time = [...dateArray][1] || ''

  return `${reverceDate} ${time}`
}

export {db, convertParticipants, updateLocalStorage, transformDate}

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
