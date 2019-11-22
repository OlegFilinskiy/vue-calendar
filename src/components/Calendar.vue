<template>
  <v-row class="fill-height">
    <v-col>
      <!-- Toolbar -->
      <v-sheet height="70">
        <v-toolbar color="#F4F4F4">
          <v-btn color="primary" class="mr-4" @click.prevent="dialog = true" dark>
            Добавить
          </v-btn>
          <v-btn color="#c1f7c2" class="mr-4" @click.prevent="getEvents">
            Обновить
          </v-btn>
          <v-btn outlined class="mr-4" @click.prevent="setToday">
            Сегодня
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            hide-details
            prepend-icon="mdi-magnify"
            single-line
            label="Событие или дата"
            outlined
            dense
          ></v-text-field>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="70">
        <v-toolbar flat color="white">
          <v-btn fab text small @click.prevent="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click.prevent="next" class="mr-4">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>

          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn
                  outlined
                  v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Месяц</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Неделя</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 Дня</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>День</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <!-- Toolbar end -->

      <!-- Dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field
                  v-model="name"
                  type="text"
                  label="Название обяз."
                  required
                  clearable
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="details"
                  type="text"
                  label="Описание"
                  clearable
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="start"
                  type="datetime-local"
                  label="Начало обяз."
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="end"
                  type="datetime-local"
                  label="Конец обяз."
                  required
                  outlined
              ></v-text-field>
              <v-text-field
                  v-model="color"
                  type="color"
                  label="Цвет"
                  outlined
              ></v-text-field>
              <v-btn
                  type="submit"
                  color="primary"
                  class="mt-4"
                  @click.stop="dialog = false"
              >Создать</v-btn>
              <v-btn
                  type="button"
                  class="mt-4 ml-3"
                  @click.stop="dialog = false"
              >Закрыть</v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>
      <!-- Dialog end -->

      <!-- Calendar -->
      <v-sheet height="600">
        <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :type="type"
            :locale="locale"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
        ></v-calendar>
        <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
        >
          <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
          >
            <v-toolbar
                :color="selectedEvent.color"
                dark
            >
              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <!--<span v-html="selectedEvent.details"></span>-->
              <form v-if="currentlyEditing !== selectedEvent.id">
                <div>Начало: {{ selectedEvent.start }}</div>
                <div>Конец: {{ selectedEvent.end }}</div>
                <div>Описание: {{ selectedEvent.details }}</div>
              </form>
              <form v-else>
                <v-text-field
                    v-model="selectedEvent.name"
                    type="text"
                    label="Изменить название"
                    clearable
                    outlined
                ></v-text-field>
                <v-text-field
                    v-model="selectedEvent.start"
                    type="datetime-local"
                    label="Изменить дату"
                    outlined
                ></v-text-field>
                <v-text-field
                    v-model="selectedEvent.end"
                    type="datetime-local"
                    label="Изменить дату"
                    outlined
                ></v-text-field>
                <v-textarea
                    v-model="selectedEvent.details"
                    style="width: 100%; height: 100%; min-height: 100px;"
                    label="Изменить описание"
                    outlined
                ></v-textarea>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  text
                  color="secondary"
                  @click.prevent="closeEvent"
              >Закрыть</v-btn>
              <v-btn
                  text
                  @click.prevent="editEvent(selectedEvent)"
                  v-if="currentlyEditing !== selectedEvent.id"
              >Редактировать</v-btn>
              <v-btn
                  text
                  @click.prevent="updateEvent(selectedEvent)"
                  v-else
              >Сохранить</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
      <!-- Calendar end -->
    </v-col>
  </v-row>
</template>

<script>
  import { db, convertParticipants, updateLocalStorage, transformDate } from '@/main'

  export default {
    data: () => ({
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: "month",
      locale: "ru",
      typeToLabel: {
        month: "Месяц",
        week: "Неделя",
        day: "День",
        '4day': "4 Дня"
      },
      date: null,
      participants: [],
      name: null,
      details: null,
      start: null,
      end: null,
      color: "#00BCD4",
      currentlyEditing: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      dialog: false
    }),
    computed: {
      title () {
        const { start, end } = this
        const monthNames = ["январь", "февраль", "март", "апрель", "май", "июнь",
          "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]

        if (!start || !end) {
          let dateNow = new Date
          return `${monthNames[dateNow.getMonth()]} ${dateNow.getFullYear()}`
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day
        const endDay = end.day

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startDay} - ${endDay} ${startMonth} ${suffixMonth} ${startYear} ${suffixYear}`
          case 'day':
            return `${startDay} ${startMonth} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    mounted() {
      this.getEvents()
    },
    methods: {
      getEvents() {
        let newDB = db.map(event => {
          event.date = transformDate(event.date)
          event.participants = convertParticipants(event.participants)

          let newEvent = {...event}

          if (!event.name) {
            newEvent.name = event.title
          }
          if (!event.start) {
            newEvent.start = event.date
          }
          if (!event.end) {
            newEvent.end = event.date
          }
          if (!event.details) {
            newEvent.details = event.participants
          }
          if (!event.color) {
            newEvent.color = "#00BCD4"
          }

          return newEvent
        })

        this.events = newDB
        localStorage.setItem('events', JSON.stringify(newDB))
      },
      addEvent() {
        if (this.name && this.start && this.end) {
          this.events.push({
            id: Date.now(),
            name: this.name,
            details: this.details,
            start: this.start,
            end: this.end,
            color: this.color
          })

          localStorage.setItem('events', JSON.stringify(this.events))
          this.events = JSON.parse(localStorage.getItem('events'))
          this.clearDialogForm()
        } else {
          alert('Название, начало и конец обязательные поля')
        }
      },
      updateEvent(event) {
        const cerEvent = this.events.find(ev => ev.id === this.currentlyEditing)
        let flag = false

        if (cerEvent.name !== event.name) {
          cerEvent.name = event.name
          flag = true
        }
        if (cerEvent.details !== event.details) {
          cerEvent.details = event.details
          flag = true
        }
        if (cerEvent.start !== event.start) {
          cerEvent.start = event.start
          flag = true
        }
        if (cerEvent.end !== event.end) {
          cerEvent.end = event.end
          flag = true
        }
        if (flag) {
          updateLocalStorage(this.events)
        }

        this.selectedOpen = false
        this.currentlyEditing = null
      },
      deleteEvent(event) {
        const idx = this.events.findIndex(ev => ev.id === event)
        this.events.splice(idx, 1)

        updateLocalStorage(this.events)

        this.selectedOpen = false
        this.currentlyEditing = null
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      setToday () {
        this.focus = this.today
      },
      getEventColor (event) {
        return event.color
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          window.setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          window.setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      editEvent(event) {
        this.currentlyEditing = event.id
      },
      closeEvent() {
        this.selectedOpen = false
        this.currentlyEditing = null
      },
      updateRange ({ start, end }) {
        this.start = start
        this.end = end
      },
      clearDialogForm () {
        this.name = ''
        this.details = ''
        this.start = null
        this.end = null
        this.color = null
      },
    }
  }
</script>

<style scoped>
  .v-text-field >>> input[type="color"] {
      padding: 0;
  }
</style>