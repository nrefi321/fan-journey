import { createRouter, createWebHistory } from 'vue-router'
import EventsView from '../views/EventsView.vue'
import JourneyView from '../views/JourneyView.vue'
import AchievementsView from '../views/AchievementsView.vue'

const routes = [
  { path: '/', redirect: '/events' },
  { path: '/events', name: 'events', component: EventsView },
  { path: '/journey', name: 'journey', component: JourneyView },
  { path: '/achievements', name: 'achievements', component: AchievementsView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
