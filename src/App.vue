<template>
  <div id="app-shell">
    <transition-group name="toast" tag="div">
      <div v-for="t in toasts" :key="t.id" class="toast">
        <span style="font-size:16px">{{ t.emoji }}</span>
        <span>{{ t.text }}</span>
      </div>
    </transition-group>

    <div class="top">
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
      <div class="eyebrow">FAN JOURNEY</div>
      <h1 class="brand">MY FAN JOURNEY 🤍</h1>
      <div class="stats-row">
        <div class="stat-chip">
          <div class="num">{{ total }}/{{ EVENTS.length }}</div>
          <div class="lbl">Events</div>
        </div>
        <div class="stat-chip">
          <div class="num">{{ journeyPct }}%</div>
          <div class="lbl">Journey</div>
        </div>
        <div class="stat-chip">
          <div class="num">{{ unlocked.size }}/{{ ACHIEVEMENTS.length }}</div>
          <div class="lbl">Achievements</div>
        </div>
      </div>
    </div>

    <div class="tabs">
      <router-link to="/events" class="tab-btn" active-class="active">Events</router-link>
      <router-link to="/journey" class="tab-btn" active-class="active">My Journey</router-link>
      <router-link to="/achievements" class="tab-btn" active-class="active">Achievements</router-link>
    </div>

    <router-view />
    <TabBar />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useFanJourney } from './composables/useFanJourney'
import { useToast } from './composables/useToast'
import TabBar from './components/TabBar.vue'

const { EVENTS, ACHIEVEMENTS, total, unlocked } = useFanJourney()
const { toasts } = useToast()

const journeyPct = computed(() =>
  EVENTS.length ? Math.round((total.value / EVENTS.length) * 100) : 0
)

// ---------- theme ----------
const isDark = ref(true)

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()
  localStorage.setItem('fj-theme', isDark.value ? 'dark' : 'light')
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('fj-theme')
  if (saved === 'light') isDark.value = false
  applyTheme()
})
</script>

<style scoped>
.theme-toggle {
  position: absolute;
  top: 28px;
  right: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 16px;
  cursor: pointer;
}
</style>
