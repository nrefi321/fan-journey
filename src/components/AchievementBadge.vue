<template>
  <div class="ach-card" :class="{ locked: !unlocked, secret: achievement.secret }">
    <span class="ach-emoji">
      {{ unlocked ? achievement.emoji : (achievement.secret ? '🔒' : '🔒') }}
    </span>
    <div class="ach-name">
      {{ unlocked ? achievement.name : (achievement.secret ? '???' : achievement.name) }}
    </div>
    <div class="ach-desc">
      {{ unlocked ? achievement.desc : (achievement.secret ? achievement.hint : achievement.desc) }}
    </div>
    <div v-if="achievement.secret && unlocked" class="secret-tag">SECRET</div>
  </div>
</template>

<script setup>
defineProps({
  achievement: { type: Object, required: true },
  unlocked: { type: Boolean, default: false },
})
</script>

<style scoped>
.ach-card { position: relative; }

.ach-card.secret:not(.locked) {
  border-color: rgba(196,149,106,0.5);
  background: linear-gradient(135deg, var(--surface), rgba(196,149,106,0.08));
}

.ach-card.secret.locked {
  border-style: dashed;
  opacity: 0.5;
}

.secret-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  font-family: 'Space Mono', monospace;
  font-size: 8px;
  letter-spacing: .1em;
  color: var(--miu);
  background: rgba(196,149,106,0.15);
  padding: 2px 5px;
  border-radius: 4px;
}
</style>
