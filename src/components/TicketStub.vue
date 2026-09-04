<template>
  <div class="stub" @click="$emit('open', event.id)">
    <!-- มีรูป → แสดงรูป -->
    <div class="stub-cover" :style="!event.image ? coverStyle : {}">
      <img
        v-if="event.image && !imgError"
        :src="event.image"
        :alt="event.title"
        class="stub-img"
        @error="imgError = true"
      />
      <template v-else>
        {{ event.emoji }}
      </template>
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
import { ref, computed } from 'vue'
import { formatDate } from '../utils/format'

const props = defineProps({
  event: { type: Object, required: true },
  attended: { type: Boolean, default: false },
})
defineEmits(['open'])

const imgError = ref(false)

const coverStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.event.g[0]}, ${props.event.g[1]})`,
}))
const formattedDate = computed(() => formatDate(props.event.date))
</script>

<style scoped>
.stub-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  position: absolute;
  inset: 0;
}
.stub-cover {
  position: relative;
}
</style>
