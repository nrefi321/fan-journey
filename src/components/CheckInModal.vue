<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <button class="modal-close" @click="$emit('close')">✕</button>

      <!-- Cover: รูปจริงหรือ gradient+emoji -->
      <div class="modal-cover" :style="!event.image || imgError ? coverStyle : {}">
        <img
          v-if="event.image && !imgError"
          :src="event.image"
          :alt="event.title"
          class="modal-img"
          @error="imgError = true"
        />
        <template v-else>{{ event.emoji }}</template>
      </div>

      <h2>{{ event.title }}</h2>
      <div class="meta-line">📅 {{ formattedDate }}</div>
      <div class="meta-line">📍 {{ event.location }}</div>
      <div class="desc">{{ event.desc }}</div>

      <template v-if="attendance">
        <div class="checked-pill">✓ I WAS THERE</div>
        <label class="field-lbl">ความทรงจำของคุณ (ไม่บังคับ)</label>
        <textarea v-model="memoryDraft" placeholder="เขียนอะไรสักหน่อยเกี่ยวกับงานนี้..."></textarea>
        <div class="btn-row">
          <button class="btn btn-ghost" @click="handleSaveMemory">บันทึกความทรงจำ</button>
          <button class="btn btn-secondary" @click="handleShare">🖼️ สร้างการ์ดแชร์</button>
        </div>
      </template>
      <template v-else>
        <button class="btn btn-primary" @click="$emit('checkin', event.id)">✓ I WAS THERE</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDate } from '../utils/format'

const props = defineProps({
  event: { type: Object, required: true },
  attendance: { type: Object, default: null },
})
const emit = defineEmits(['close', 'checkin', 'save-memory', 'share'])

const imgError = ref(false)
const memoryDraft = ref(props.attendance?.memory || '')

const coverStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.event.g[0]}, ${props.event.g[1]})`,
}))
const formattedDate = computed(() => formatDate(props.event.date))

function handleSaveMemory() {
  emit('save-memory', props.event.id, memoryDraft.value)
  emit('close')
}
function handleShare() {
  emit('save-memory', props.event.id, memoryDraft.value)
  emit('share', props.event.id)
}
</script>

<style scoped>
.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  position: absolute;
  inset: 0;
  border-radius: 14px;
}
.modal-cover {
  position: relative;
  overflow: hidden;
}
</style>
