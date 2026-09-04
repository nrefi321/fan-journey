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

          <!-- header: title + hero placeholder -->
          <div class="card-header">
            <div class="card-heading">
              <div class="card-eyebrow">LENA × MIU</div>
              <div class="card-title">FAN JOURNEY</div>
              <div class="card-tagline">little moments, precious memories</div>
            </div>
            <div class="card-hero">
              <span class="card-hero-icon">🫶</span>
              <span class="card-hero-hint">แนบรูปคู่ตรงนี้ทีหลังได้</span>
            </div>
          </div>

          <!-- stats -->
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
              <div class="card-stat-num accent">{{ memoriesCount }}</div>
              <div class="card-stat-lbl">บันทึกที่เขียน 🤍</div>
            </div>
          </div>

          <!-- milestones -->
          <div class="card-milestones">
            <div v-if="firstEvent" class="card-milestone">
              <div class="ms-thumb" :class="{ 'has-img': firstEvent.image }">
                <img v-if="firstEvent.image" :src="firstEvent.image" alt="" />
                <span v-else>🌱</span>
              </div>
              <div class="ms-text">
                <div class="ms-tag">First</div>
                <div class="ms-value">{{ firstEvent.title }}</div>
                <div class="ms-date">{{ formatDate(firstEvent.date) }}</div>
              </div>
            </div>

            <div v-if="latestEvent" class="card-milestone highlight">
              <div class="ms-thumb accent" :class="{ 'has-img': latestEvent.image }">
                <img v-if="latestEvent.image" :src="latestEvent.image" alt="" />
                <span v-else>✨</span>
              </div>
              <div class="ms-text">
                <div class="ms-tag accent">Latest</div>
                <div class="ms-value">{{ latestEvent.title }}</div>
                <div class="ms-date">{{ formatDate(latestEvent.date) }}</div>
              </div>
            </div>

            <div v-if="favoriteType" class="card-milestone">
              <div class="ms-thumb">
                <span>{{ favoriteType.emoji }}</span>
              </div>
              <div class="ms-text">
                <div class="ms-tag">Most Visited</div>
                <div class="ms-value">{{ favoriteType.label }} · {{ favoriteType.count }} ครั้ง</div>
              </div>
            </div>
          </div>

          <!-- collected moments -->
          <div class="card-collected">
            <div class="cc-title">✧ Collected Moments ✧</div>
            <div class="cc-track">
              <div
                v-for="(e, i) in attendedList"
                :key="e.id"
                class="cc-item"
              >
                <div class="cc-dot" :class="{ accent: i === attendedList.length - 1 }"></div>
                <div class="cc-date">{{ formatDate(e.date) }}</div>
                <div class="cc-name">{{ e.title }}</div>
              </div>
            </div>
          </div>

          <div class="card-pct-bar">
            <div class="card-pct-fill" :style="{ width: journeyPct + '%' }"></div>
          </div>
          <div class="card-pct-label">{{ journeyPct }}% of all events · {{ total }}/{{ EVENTS.length }}</div>

          <div class="card-tagline-pill">การเดินทางที่เราเลือกจะจดจำ 🤍</div>
          <div class="card-footer">lenamiu-fan-journey.vercel.app</div>
        </div>

        <div class="btn-row">
          <button class="btn btn-primary share-btn" @click="shareCard">
            🐦 แชร์ไป X
          </button>
          <button class="btn btn-ghost share-btn" @click="saveCardImage">
            💾 บันทึกรูปการ์ด
          </button>
        </div>
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
/* ============================================================
   JOURNEY CARD — self-contained "printed card" palette
   Always renders the same regardless of app dark/light theme.
   Background #FAF7F5 · Primary #91B5C8 · Accent #D9A6AD (rose,
   used only for Heart / Memory / Achievement / Highlight spots)
   ============================================================ */
.share-section {
  margin-bottom: 28px;
  --cp: #91B5C8;              /* primary — dusty blue */
  --ca: #D9A6AD;              /* accent  — dusty rose (sparing use) */
  --cbg: #FAF7F5;             /* card background — cream */
  --ccard: #FFFFFF;
  --ctext: #30343B;
  --cline: rgba(145, 181, 200, 0.25);
  --cmist: rgba(48, 52, 59, 0.55);
}

.journey-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, var(--ccard) 0%, var(--cbg) 100%);
  color: var(--ctext);
  border-radius: 22px;
  padding: 26px 22px 22px;
  border: 1px solid var(--cline);
  box-shadow: 0 14px 36px rgba(48, 52, 59, 0.1);
  margin-bottom: 12px;
}

/* header */
.card-header {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 18px;
}
.card-heading { flex: 1; min-width: 0; }

.card-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: .2em;
  color: var(--cp);
  margin-bottom: 4px;
}
.card-title {
  font-family: 'Fraunces', serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--ctext);
  line-height: 1.15;
  margin-bottom: 4px;
}
.card-tagline {
  font-size: 11px;
  font-style: italic;
  color: var(--cmist);
}

.card-hero {
  flex-shrink: 0;
  width: 92px;
  aspect-ratio: 1/1;
  border-radius: 16px;
  border: 1.5px dashed var(--cline);
  background: rgba(145, 181, 200, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  padding: 6px;
}
.card-hero-icon { font-size: 24px; }
.card-hero-hint {
  font-size: 8px;
  line-height: 1.3;
  color: var(--cmist);
}

/* stats */
.card-stats-row {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(145, 181, 200, 0.08);
  border-radius: 14px;
  padding: 14px 0;
  margin-bottom: 16px;
}
.card-stat { flex: 1; text-align: center; }
.card-stat-num {
  font-family: 'Fraunces', serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--cp);
  line-height: 1;
}
.card-stat-num.accent { color: var(--ca); }
.card-stat-lbl {
  font-size: 10px;
  color: var(--cmist);
  margin-top: 4px;
  letter-spacing: .03em;
}
.card-stat-divider { width: 1px; height: 32px; background: var(--cline); }

/* milestones */
.card-milestones {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}
.card-milestone {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--ccard);
  border-radius: 12px;
  padding: 8px 10px;
  border: 1px solid var(--cline);
}
.card-milestone.highlight { border-color: rgba(217, 166, 173, 0.4); }

.ms-thumb {
  flex-shrink: 0;
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
  background: rgba(145, 181, 200, 0.12);
  overflow: hidden;
}
.ms-thumb.accent { background: rgba(217, 166, 173, 0.15); }
.ms-thumb.has-img { background: none; }
.ms-thumb img { width: 100%; height: 100%; object-fit: cover; }

.ms-text { flex: 1; min-width: 0; }
.ms-tag {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--cp);
}
.ms-tag.accent { color: var(--ca); }
.ms-value {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ctext);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ms-date {
  font-size: 10px;
  color: var(--cmist);
  margin-top: 1px;
}

/* collected moments */
.card-collected { margin-bottom: 16px; }
.cc-title {
  text-align: center;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: .1em;
  color: var(--cp);
  margin-bottom: 10px;
}
.cc-track {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 6px;
}
.cc-item { text-align: center; }
.cc-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--cp);
  margin: 0 auto 5px;
}
.cc-dot.accent { background: var(--ca); }
.cc-date {
  font-family: 'Space Mono', monospace;
  font-size: 8.5px;
  color: var(--cmist);
}
.cc-name {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ctext);
  margin-top: 2px;
  line-height: 1.25;
}

/* progress bar */
.card-pct-bar {
  height: 4px;
  background: rgba(145, 181, 200, 0.15);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}
.card-pct-fill {
  height: 100%;
  background: var(--cp);
  border-radius: 4px;
  transition: width .6s ease;
}
.card-pct-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: var(--cmist);
  text-align: right;
  margin-bottom: 16px;
}

.card-tagline-pill {
  text-align: center;
  font-size: 11px;
  font-style: italic;
  color: var(--ctext);
  background: rgba(145, 181, 200, 0.1);
  border-radius: 20px;
  padding: 8px 12px;
  margin-bottom: 14px;
}

.card-footer {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: .14em;
  color: var(--cmist);
  text-align: center;
  border-top: 1px dashed var(--cline);
  padding-top: 12px;
}

.share-btn { margin-top: 4px; }
</style>
