<template>
  <div class="stub" @click="$emit('open', event.id)">
    <div
      class="stub-cover"
      :class="{ 'has-img': event.image && !imgError }"
      :style="!event.image || imgError ? coverStyle : {}"
    >
      <img
        v-if="event.image && !imgError"
        :src="event.image"
        :alt="event.title"
        class="stub-img"
        @load="onLoad"
        @error="imgError = true"
      />
      <template v-if="!event.image || imgError">
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
const isPortrait = ref(false)

function onLoad(e) {
  const { naturalWidth, naturalHeight } = e.target
  isPortrait.value = naturalHeight > naturalWidth
}

const coverStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.event.g[0]}, ${props.event.g[1]})`,
}))
const formattedDate = computed(() => formatDate(props.event.date))
</script>

<style scoped>
/* gradient / emoji fallback */
.stub-cover {
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  position: relative;
  overflow: hidden;
}

/* ถ้ามีรูปจริง → ไม่ lock aspect ratio ให้รูปกำหนดความสูงเอง */
.stub-cover.has-img {
  aspect-ratio: unset;
}

.stub-img {
  width: 100%;
  height: auto;          /* รูปจะสูงเท่าที่รูปจริงต้องการ ไม่ crop */
  display: block;
  object-fit: cover;
}

.checked-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(27, 24, 48, 0.75);
  backdrop-filter: blur(4px);
  color: var(--pearl);
  font-size: 10px;
  font-family: 'Space Mono', monospace;
  padding: 4px 8px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
