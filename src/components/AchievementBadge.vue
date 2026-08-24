<template>
  <div class="ach-card" :class="{ locked: !unlocked }">
    <span class="ach-emoji">{{ unlocked ? achievement.emoji : '🔒' }}</span>
    <div class="ach-name">{{ achievement.name }}</div>
    <div class="ach-desc">{{ achievement.desc }}</div>
  </div>
</template>

<script setup>
defineProps({
  achievement: { type: Object, required: true },
  unlocked: { type: Boolean, default: false },
})
</script>
