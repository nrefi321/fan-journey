<template>
  <div id="app-shell">
    <transition-group name="toast" tag="div">
      <div v-for="t in toasts" :key="t.id" class="toast">
        <span style="font-size:16px">{{ t.emoji }}</span>
        <span>{{ t.text }}</span>
      </div>
    </transition-group>

    <div class="top">
      <div class="eyebrow">FAN JOURNEY</div>
      <h1 class="brand">MY FAN JOURNEY 🤍</h1>
      <div class="stats-row">
        <div class="stat-chip">
          <div class="num">{{ total }}</div>
          <div class="lbl">Events</div>
        </div>
        <div class="stat-chip">
          <div class="num">{{ unlocked.size }}/{{ ACHIEVEMENTS.length }}</div>
          <div class="lbl">Achievements</div>
        </div>
        <div class="stat-chip">
          <div class="num">{{ yearsCount }}</div>
          <div class="lbl">Years</div>
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
import { computed } from 'vue'
import { useFanJourney } from './composables/useFanJourney'
import { useToast } from './composables/useToast'
import { yearOf } from './utils/format'
import TabBar from './components/TabBar.vue'

const { EVENTS, ACHIEVEMENTS, total, unlocked } = useFanJourney()
const { toasts } = useToast()

const yearsCount = computed(() => new Set(EVENTS.map((e) => yearOf(e.date))).size)
</script>
