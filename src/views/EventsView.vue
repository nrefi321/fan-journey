<template>
  <div class="view">
    <div class="chips">
      <button class="chip" :class="{ active: yearFilter === 'all' }" @click="yearFilter = 'all'">ทั้งหมด</button>
      <button v-for="y in years" :key="y" class="chip" :class="{ active: yearFilter === y }" @click="yearFilter = y">
        {{ y }}
      </button>
    </div>

    <div class="stub-grid">
      <TicketStub
        v-for="event in sortedEvents"
        :key="event.id"
        :event="event"
        :attended="isAttended(event.id)"
        @open="openDetail"
      />
    </div>

    <CheckInModal
      v-if="detailEventId"
      :event="EVENTS_BY_ID[detailEventId]"
      :attendance="state.attendances[detailEventId] || null"
      @close="detailEventId = null"
      @checkin="handleCheckin"
      @save-memory="handleSaveMemory"
      @share="handleShare"
    />

    <ShareModal
      v-if="shareEventId"
      :event="EVENTS_BY_ID[shareEventId]"
      :attendance="state.attendances[shareEventId] || null"
      @close="shareEventId = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFanJourney } from '../composables/useFanJourney'
import { useToast } from '../composables/useToast'
import { yearOf } from '../utils/format'
import TicketStub from '../components/TicketStub.vue'
import CheckInModal from '../components/CheckInModal.vue'
import ShareModal from '../components/ShareModal.vue'

const { state, EVENTS, EVENTS_BY_ID, isAttended, checkIn, saveMemory } = useFanJourney()
const { showAchievement } = useToast()

const yearFilter = ref('all')
const detailEventId = ref(null)
const shareEventId = ref(null)

const years = computed(() => [...new Set(EVENTS.map((e) => yearOf(e.date)))].sort())

const sortedEvents = computed(() => {
  const filtered = yearFilter.value === 'all' ? EVENTS : EVENTS.filter((e) => yearOf(e.date) === yearFilter.value)
  return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))
})

function openDetail(eventId) {
  detailEventId.value = eventId
}

function handleCheckin(eventId) {
  const newlyUnlocked = checkIn(eventId)
  newlyUnlocked.forEach(showAchievement)
}

function handleSaveMemory(eventId, text) {
  const newlyUnlocked = saveMemory(eventId, text)
  newlyUnlocked.forEach(showAchievement)
}

function handleShare(eventId) {
  detailEventId.value = null
  shareEventId.value = eventId
}
</script>
