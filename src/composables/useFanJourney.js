import { reactive, computed } from 'vue'
import { EVENTS, EVENTS_BY_ID } from '../data/events'
import { ACHIEVEMENTS } from '../data/achievements'

const STORAGE_KEY = 'fan-journey-attendances'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

// Module-level reactive state so every component that calls useFanJourney()
// shares the same data (a lightweight store, no Pinia/Vuex needed for this size).
const state = reactive({
  attendances: loadFromStorage(),
})

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.attendances))
  } catch (e) {
    console.error('Could not save to localStorage', e)
  }
}

function unlockedIds(attendances) {
  return new Set(ACHIEVEMENTS.filter((a) => a.check(attendances)).map((a) => a.id))
}

export function useFanJourney() {
  const total = computed(() => Object.keys(state.attendances).length)
  const unlocked = computed(() => unlockedIds(state.attendances))

  function isAttended(eventId) {
    return !!state.attendances[eventId]
  }

  // Returns the list of achievements newly unlocked by this action,
  // so the UI can show a toast.
  function checkIn(eventId) {
    if (state.attendances[eventId]) return []
    const before = unlockedIds(state.attendances)
    state.attendances[eventId] = { attendedAt: new Date().toISOString(), memory: '' }
    persist()
    const after = unlockedIds(state.attendances)
    return ACHIEVEMENTS.filter((a) => !before.has(a.id) && after.has(a.id))
  }

  function saveMemory(eventId, text) {
    if (!state.attendances[eventId]) return []
    const before = unlockedIds(state.attendances)
    state.attendances[eventId].memory = text
    persist()
    const after = unlockedIds(state.attendances)
    return ACHIEVEMENTS.filter((a) => !before.has(a.id) && after.has(a.id))
  }

  return {
    state,
    EVENTS,
    EVENTS_BY_ID,
    ACHIEVEMENTS,
    total,
    unlocked,
    isAttended,
    checkIn,
    saveMemory,
  }
}
