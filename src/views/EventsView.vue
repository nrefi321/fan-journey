<template>
  <div class="view">
    <!-- Filter: ประเภทงาน -->
    <div class="chips" style="margin-bottom:8px;">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="chip"
        :class="{ active: selectedCategory === cat.id }"
        @click="selectedCategory = cat.id"
      >
        {{ cat.emoji }} {{ cat.label }}
      </button>
    </div>

    <!-- Filter: ปี -->
    <div class="chips">
      <button class="chip" :class="{ active: yearFilter === 'all' }" @click="yearFilter = 'all'">ทั้งหมด</button>
      <button
        v-for="y in years"
        :key="y"
        class="chip"
        :class="{ active: yearFilter === y }"
        @click="yearFilter = y"
      >
        {{ y }}
      </button>
    </div>

    <div class="result-line">พบ {{ sortedEvents.length }} งาน</div>

    <div class="stub-grid">
      <TicketStub
        v-for="event in sortedEvents"
        :key="event.id"
        :event="event"
        :attended="isAttended(event.id)"
        @open="openDetail"
      />
    </div>

    <div v-if="sortedEvents.length === 0" class="empty-state">
      <div class="big">🔍</div>
      ไม่พบงานในหมวดนี้
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
const selectedCategory = ref('all')
const detailEventId = ref(null)
const shareEventId = ref(null)

const categories = [
  { id: 'all',        label: 'ทั้งหมด',        emoji: '✨' },
  { id: 'fanmeeting', label: 'Fan Meeting',      emoji: '🎤' },
  { id: 'fashion',    label: 'Fashion',          emoji: '👗' },
  { id: 'brand',      label: 'Brand / Event',    emoji: '🛍️' },
  { id: 'festival',   label: 'Festival / Award', emoji: '🏆' },
  { id: 'movie',      label: 'Movie / Premiere', emoji: '🎬' },
  { id: 'filming',    label: 'Filming',          emoji: '🎥' },
  { id: 'overseas',   label: 'ต่างประเทศ',       emoji: '✈️' },
]

const OVERSEAS = ['Paris', 'Taiwan', 'Macau', 'China', 'Philippines', 'Singapore']
const isOverseas = (loc = '') => OVERSEAS.some(c => loc.includes(c))

const years = computed(() => [...new Set(EVENTS.map(e => yearOf(e.date)))].sort())

const sortedEvents = computed(() => {
  return [...EVENTS]
    .filter(e => {
      const matchYear = yearFilter.value === 'all' || yearOf(e.date) === yearFilter.value
      const matchCat =
        selectedCategory.value === 'all' ? true :
        selectedCategory.value === 'overseas' ? isOverseas(e.location) :
        e.type === selectedCategory.value
      return matchYear && matchCat
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

function openDetail(eventId) { detailEventId.value = eventId }

function handleCheckin(eventId) {
  const unlocked = checkIn(eventId)
  unlocked.forEach(showAchievement)
}

function handleSaveMemory(eventId, text) {
  const unlocked = saveMemory(eventId, text)
  unlocked.forEach(showAchievement)
}

function handleShare(eventId) {
  detailEventId.value = null
  shareEventId.value = eventId
}
</script>

<style scoped>
.result-line {
  font-size: 12px;
  color: var(--mist);
  font-family: 'Space Mono', monospace;
  margin: 6px 0 14px;
  letter-spacing: .04em;
}
</style>
