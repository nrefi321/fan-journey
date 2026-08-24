<template>
  <div class="stub" @click="$emit('open', event.id)">
    <div class="stub-cover" :style="coverStyle">
      {{ event.emoji }}
      <div v-if="attended" class="checked-badge">✓ WAS THERE</div>
    </div>
    <div class="tear-line"></div>
    <div class="stub-body">
      <div class="stub-title">{{ event.title }}</div>
      <div class="stub-meta">
        <div class="row">📅 {{ formattedDate }}</div>
        <div class="row">📍 {{ event.location }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '../utils/format'

const props = defineProps({
  event: { type: Object, required: true },
  attended: { type: Boolean, default: false },
})
defineEmits(['open'])

const coverStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.event.g[0]}, ${props.event.g[1]})`,
}))
const formattedDate = computed(() => formatDate(props.event.date))
</script>
