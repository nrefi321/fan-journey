import { createRouter, createWebHistory } from 'vue-router'
import EventsView from '../views/EventsView.vue'
import JourneyView from '../views/JourneyView.vue'
import AchievementsView from '../views/AchievementsView.vue'
// import EventSchedule from '../components/EventSchedule.vue' // 1. import component เข้ามา

const routes = [
  { path: '/', redirect: '/events' },
  { path: '/events', name: 'events', component: EventsView },
  // { path: '/schedule', name: 'schedule', component: EventSchedule }, // 2. เพิ่ม route สำหรับ schedule
  { path: '/journey', name: 'journey', component: JourneyView },
  { path: '/achievements', name: 'achievements', component: AchievementsView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
