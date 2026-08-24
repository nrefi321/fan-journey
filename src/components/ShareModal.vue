<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <button class="modal-close" @click="$emit('close')">✕</button>
      <div class="share-card">
        <div class="share-cover" :style="coverStyle">{{ event.emoji }}</div>
        <div class="share-body">
          <div class="share-eyebrow">I WAS THERE 🤍</div>
          <div class="share-title">{{ event.title }}</div>
          <div class="share-meta">{{ formattedDate }}<br />{{ event.location }}</div>
          <div class="share-check">✓ I WAS THERE</div>
          <div v-if="attendance?.memory" class="share-quote">"{{ attendance.memory }}"</div>
          <div class="share-footer">MY FAN JOURNEY</div>
        </div>
      </div>
      <div class="btn-row" style="margin-top:16px;">
        <a class="btn btn-primary" style="text-decoration:none;text-align:center;display:block;" target="_blank" rel="noopener" :href="tweetUrl">แชร์ไป X</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '../utils/format'

const props = defineProps({
  event: { type: Object, required: true },
  attendance: { type: Object, default: null },
})
defineEmits(['close'])

const coverStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.event.g[0]}, ${props.event.g[1]})`,
}))
const formattedDate = computed(() => formatDate(props.event.date))

const tweetUrl = computed(() => {
  const memoryLine = props.attendance?.memory ? `"${props.attendance.memory}"\n` : ''
  const text = `I WAS THERE 🤍\n${props.event.title}\n${formattedDate.value} · ${props.event.location}\n${memoryLine}#MyFanJourney`
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
})
</script>
