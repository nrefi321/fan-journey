<template>
  <div class="view">
    <div v-if="years.length === 0" class="empty-state">
      <div class="big">🤍</div>
      ยังไม่มีบันทึกความทรงจำ<br />
      เริ่มเช็คอินงานแรกของคุณได้ที่แท็บ Events
    </div>

    <template v-else>

      <!-- ===== SHARE CARD ===== -->
      <div class="share-section">
        <div class="journey-card" ref="cardRef">
          <!-- bg decoration -->
          <div class="card-bg-circle card-bg-1"></div>
          <div class="card-bg-circle card-bg-2"></div>

          <div class="card-eyebrow">LENA × MIU</div>
          <div class="card-title">FAN JOURNEY 🤍</div>

          <div class="card-stats-row">
            <div class="card-stat">
              <div class="card-stat-num">{{ total }}</div>
              <div class="card-stat-lbl">งานที่ไป</div>
            </div>
            <div class="card-stat-divider"></div>
            <div class="card-stat">
              <div class="card-stat-num">{{ yearsSpan }}</div>
              <div class="card-stat-lbl">ปีแห่งความทรงจำ</div>
            </div>
            <div class="card-stat-divider"></div>
            <div class="card-stat">
              <div class="card-stat-num">{{ memoriesCount }}</div>
              <div class="card-stat-lbl">บันทึกที่เขียน</div>
            </div>
          </div>

          <div class="card-milestones">
            <div v-if="firstEvent" class="card-milestone">
              <span class="ms-emoji">🌱</span>
              <div class="ms-text">
                <div class="ms-label">ครั้งแรก</div>
                <div class="ms-value">{{ firstEvent.title }}</div>
              </div>
            </div>
            <div v-if="latestEvent" class="card-milestone">
              <span class="ms-emoji">✨</span>
              <div class="ms-text">
                <div class="ms-label">ล่าสุด</div>
                <div class="ms-value">{{ latestEvent.title }}</div>
              </div>
            </div>
            <div v-if="favoriteType" class="card-milestone">
              <span class="ms-emoji">{{ favoriteType.emoji }}</span>
              <div class="ms-text">
                <div class="ms-label">งานที่ไปบ่อยสุด</div>
                <div class="ms-value">{{ favoriteType.label }} ({{ favoriteType.count }} ครั้ง)</div>
              </div>
            </div>
          </div>

          <div class="card-pct-bar">
            <div class="card-pct-fill" :style="{ width: journeyPct + '%' }"></div>
          </div>
          <div class="card-pct-label">{{ journeyPct }}% of all events · {{ total }}/{{ EVENTS.length }}</div>

          <div class="card-footer">lenamiu-fan-journey.vercel.app</div>
        </div>

        <button class="btn btn-primary share-btn" @click="shareCard">
          🖼️ แชร์การ์ดนี้ไป X
        </button>
      </div>

      <div class="btn-row">
        <button class="btn btn-primary share-btn" @click="shareCard">
          🐦 แชร์ไป X
        </button>
        <button class="btn btn-ghost share-btn" @click="saveCardImage">
          💾 บันทึกรูปการ์ด
        </button>
      </div>

      <!-- ===== TIMELINE ===== -->
      <div v-for="y in years" :key="y" class="year-block">
        <div class="year-head">{{ y }}</div>
        <div class="year-rule"></div>
        <div class="timeline">
          <div
            v-for="(t, i) in byYear[y]"
            :key="i"
            class="tl-item"
            :class="{ achievement: t.type === 'achievement' }"
          >
            <span class="emoji">{{ t.type === 'event' ? t.event.emoji : t.ach.emoji }}</span>
            <span class="label">
              {{ t.type === 'event' ? t.event.title : `Achievement Unlocked · ${t.ach.name}` }}
            </span>
            <div v-if="t.type === 'event' && state.attendances[t.event.id]?.memory" class="sub">
              "{{ state.attendances[t.event.id].memory }}"
            </div>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFanJourney } from '../composables/useFanJourney'
import { yearOf, formatDate } from '../utils/format'

const { state, EVENTS, EVENTS_BY_ID, ACHIEVEMENTS, total } = useFanJourney()
const cardRef = ref(null)
  
// ─── Achievement replay ───────────────────────────────────────
function unlockedIds(attendances) {
  return new Set(ACHIEVEMENTS.filter((a) => a.check(attendances)).map((a) => a.id))
}

const timelineEntries = computed(() => {
  const attendedIds = Object.keys(state.attendances)
  if (attendedIds.length === 0) return []

  const chrono = attendedIds
    .map((id) => ({ id, date: EVENTS_BY_ID[id]?.date }))
    .filter((x) => x.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const running = {}
  let prevUnlocked = new Set()
  const entries = []

  chrono.forEach(({ id, date }) => {
    running[id] = state.attendances[id]
    entries.push({ year: yearOf(date), date, type: 'event', event: EVENTS_BY_ID[id] })
    const nowUnlocked = unlockedIds(running)
    ACHIEVEMENTS.forEach((a) => {
      if (!prevUnlocked.has(a.id) && nowUnlocked.has(a.id)) {
        entries.push({ year: yearOf(date), date, type: 'achievement', ach: a })
      }
    })
    prevUnlocked = nowUnlocked
  })
  return entries
})

const byYear = computed(() => {
  const map = {}
  timelineEntries.value.forEach((t) => {
    ;(map[t.year] = map[t.year] || []).push(t)
  })
  return map
})

const years = computed(() => Object.keys(byYear.value).sort((a, b) => a - b))

// ─── Share card stats ─────────────────────────────────────────
const attendedList = computed(() =>
  Object.keys(state.attendances)
    .map((id) => EVENTS_BY_ID[id])
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
)

const firstEvent  = computed(() => attendedList.value[0] || null)
const latestEvent = computed(() => attendedList.value[attendedList.value.length - 1] || null)

const yearsSpan = computed(() => {
  const ys = [...new Set(attendedList.value.map((e) => yearOf(e.date)))]
  return ys.length
})

const memoriesCount = computed(() =>
  Object.values(state.attendances).filter((v) => v.memory && v.memory.trim()).length
)

const journeyPct = computed(() =>
  EVENTS.length ? Math.round((total.value / EVENTS.length) * 100) : 0
)

const TYPE_META = {
  fanmeeting: { label: 'Fan Meeting', emoji: '🎤' },
  fashion:    { label: 'Fashion',     emoji: '👗' },
  brand:      { label: 'Brand Event', emoji: '🛍️' },
  festival:   { label: 'Festival',    emoji: '🏆' },
  movie:      { label: 'Movie',       emoji: '🎬' },
  premiere:   { label: 'Premiere',    emoji: '🍿' },
  filming:    { label: 'Filming',     emoji: '🎥' },
  event:      { label: 'Event',       emoji: '✨' },
  live:       { label: 'Live Online', emoji: '📱' },
  exhibition: { label: 'Exhibition',  emoji: '👑' },
  charity:    { label: 'Charity',     emoji: '🚆' },
}

const favoriteType = computed(() => {
  const count = {}
  attendedList.value.forEach((e) => { count[e.type] = (count[e.type] || 0) + 1 })
  const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0]
  if (!top) return null
  const meta = TYPE_META[top[0]] || { label: top[0], emoji: '✨' }
  return { ...meta, count: top[1] }
})
  
async function captureCard() {
  const html2canvas = (await import('html2canvas')).default
  return html2canvas(cardRef.value, {
    backgroundColor: null,
    scale: 2, // ให้รูปคมชัดขึ้นตอนโหลดลงมือถือ
    useCORS: true,
  })
}

// บันทึก/แชร์รูปจริง — ใช้ Web Share API ถ้ามือถือรองรับ ไม่งั้น fallback เป็นดาวน์โหลด
async function saveCardImage() {
  const canvas = await captureCard()
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'))

  if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'x.png', { type: 'image/png' })] })) {
    const file = new File([blob], 'lenamiu-fan-journey.png', { type: 'image/png' })
    try {
      await navigator.share({ files: [file], title: 'My LenaMiu Fan Journey' })
      return
    } catch (e) {
      // ผู้ใช้กดยกเลิก share sheet — ปล่อยผ่านไป fallback ด้านล่าง
    }
  }

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'lenamiu-fan-journey.png'
  link.click()
  URL.revokeObjectURL(link.href)
}
  
// ─── Share to X ───────────────────────────────────────────────
function shareCard() {
  const lines = [
    `🤍 MY LENA × MIU FAN JOURNEY`,
    ``,
    `🎟️ ไปงานมาแล้ว ${total.value} ครั้ง (${journeyPct.value}% of all events)`,
    firstEvent.value  ? `🌱 ครั้งแรก: ${firstEvent.value.title}` : '',
    favoriteType.value ? `${favoriteType.value.emoji} ชอบไป: ${favoriteType.value.label} ${favoriteType.value.count} ครั้ง` : '',
    memoriesCount.value ? `💌 บันทึกความทรงจำ: ${memoriesCount.value} รายการ` : '',
    ``,
    `#LenaMiu #MyFanJourney`,
    `lenamiu-fan-journey.vercel.app`,
  ].filter((l) => l !== undefined).join('\n')

  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(lines)}`,
    '_blank', 'noopener'
  )
}
</script>

<style scoped>
/* ── Share section ── */
.share-section { margin-bottom: 28px; }

.journey-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0F1E35 0%, #1A2D4A 60%, #1E2A3A 100%);
  border-radius: 20px;
  padding: 28px 24px 22px;
  border: 1px solid rgba(91,155,213,0.25);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  margin-bottom: 12px;
}

/* light mode card stays dark intentionally — it's a "printed" card */
[data-theme="light"] .journey-card {
  background: linear-gradient(135deg, #0F1E35 0%, #162840 60%, #1A2535 100%);
}

.card-bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: .12;
  pointer-events: none;
}
.card-bg-1 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, #5B9BD5, transparent);
  top: -60px; right: -60px;
}
.card-bg-2 {
  width: 160px; height: 160px;
  background: radial-gradient(circle, #C4956A, transparent);
  bottom: -40px; left: -40px;
}

.card-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: .22em;
  color: #A8D8EA;
  margin-bottom: 4px;
}
.card-title {
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(90deg, #A8D8EA, #E8C9A0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}

/* stats row */
.card-stats-row {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 14px 0;
  margin-bottom: 18px;
}
.card-stat {
  flex: 1;
  text-align: center;
}
.card-stat-num {
  font-family: 'Fraunces', serif;
  font-size: 26px;
  font-weight: 700;
  color: #EEF4FB;
  line-height: 1;
}
.card-stat-lbl {
  font-size: 10px;
  color: #7A9BB5;
  margin-top: 4px;
  letter-spacing: .04em;
}
.card-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(168,216,234,0.15);
}

/* milestones */
.card-milestones {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}
.card-milestone {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 8px 12px;
  border: 1px solid rgba(168,216,234,0.08);
}
.ms-text {
  flex: 1;
  min-width: 0; /* ← เพิ่มบรรทัดนี้ ทำให้ ellipsis ทำงานจริงแทนการดันการ์ดให้ล้น */
}
.ms-emoji { font-size: 18px; flex-shrink: 0; }
.ms-label {
  font-size: 10px;
  color: #7A9BB5;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.ms-value {
  font-size: 13px;
  font-weight: 600;
  color: #EEF4FB;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* progress bar */
.card-pct-bar {
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}
.card-pct-fill {
  height: 100%;
  background: linear-gradient(90deg, #5B9BD5, #C4956A);
  border-radius: 4px;
  transition: width .6s ease;
}
.card-pct-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: #7A9BB5;
  text-align: right;
  margin-bottom: 16px;
}

.card-footer {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: .14em;
  color: rgba(168,216,234,0.4);
  text-align: center;
  border-top: 1px dashed rgba(168,216,234,0.1);
  padding-top: 12px;
}

.share-btn { margin-top: 4px; }
</style>
