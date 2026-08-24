<template>
  <div class="view">
    <div v-if="years.length === 0" class="empty-state">
      <div class="big">🤍</div>
      ยังไม่มีบันทึกความทรงจำ<br />
      เริ่มเช็คอินงานแรกของคุณได้ที่แท็บ Events
    </div>

    <div v-for="y in years" :key="y" class="year-block">
      <div class="year-head">{{ y }}</div>
      <div class="year-rule"></div>
      <div class="timeline">
        <div v-for="(t, i) in byYear[y]" :key="i" class="tl-item" :class="{ achievement: t.type === 'achievement' }">
          <span class="emoji">{{ t.type === 'event' ? t.event.emoji : t.ach.emoji }}</span>
          <span class="label">
            {{ t.type === 'event' ? t.event.title : `Achievement Unlocked · ${t.ach.name}` }}
          </span>
          <div v-if="t.type === 'event' && state.attendances[t.event.id]?.memory" class="sub">
            "{{ state.attendances[t.event.id].memory }}"
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFanJourney } from '../composables/useFanJourney'
import { yearOf } from '../utils/format'

const { state, EVENTS_BY_ID, ACHIEVEMENTS } = useFanJourney()

function unlockedIds(attendances) {
  return new Set(ACHIEVEMENTS.filter((a) => a.check(attendances)).map((a) => a.id))
}

// Replays check-ins in chronological (event date) order so we can tell
// which year each achievement was actually earned in.
const timelineEntries = computed(() => {
  const attendedIds = Object.keys(state.attendances)
  if (attendedIds.length === 0) return []

  const chrono = attendedIds
    .map((id) => ({ id, date: EVENTS_BY_ID[id].date }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const running = {}
  let prevUnlocked = new Set()
  const entries = []

  chrono.forEach(({ id, date }) => {
    running[id] = state.attendances[id]
    entries.push({ year: yearOf(date), date, type: 'event', event: EVENTS_BY_ID[id] })

    const nowUnlocked = unlockedIds(running)
    ACHIEVEMENTS.forEach((a) => {
      if (!prevUnlocked.has(a.id) && nowUnlocked.has(a.id)) {
        entries.push({ year: yearOf(date), date, type: 'achievement', ach: a })
      }
    })
    prevUnlocked = nowUnlocked
  })

  return entries
})

const byYear = computed(() => {
  const map = {}
  timelineEntries.value.forEach((t) => {
    ;(map[t.year] = map[t.year] || []).push(t)
  })
  return map
})

const years = computed(() => Object.keys(byYear.value).sort((a, b) => a - b))
</script>
