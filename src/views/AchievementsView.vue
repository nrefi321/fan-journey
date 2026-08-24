<template>
  <div class="view">
    <div class="ach-grid">
      <AchievementBadge
        v-for="a in ACHIEVEMENTS"
        :key="a.id"
        :achievement="a"
        :unlocked="unlocked.has(a.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { useFanJourney } from '../composables/useFanJourney'
import AchievementBadge from '../components/AchievementBadge.vue'

const { ACHIEVEMENTS, unlocked } = useFanJourney()
</script>
