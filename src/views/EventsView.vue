<template>
  <div class="events-page">
    <div class="events-container">
      <!-- Header -->
      <header class="page-header">
        <h1 class="page-title">LENAMIU 2026 SCHEDULE</h1>
        <p class="page-subtitle">ตารางงานและกิจกรรมทั้งหมดของลีน่ามิว</p>
        <div v-if="checkedInCount > 0" class="checkin-counter-badge">
          🎉 คุณไปร่วมงานมาแล้ว <span>{{ checkedInCount }}</span> งาน!
        </div>
      </header>

      <!-- Search & Filters -->
      <div class="filter-section">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหางาน, สถานที่, หรือรายละเอียด..."
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
        </div>

        <div class="view-switch">
          <button
            :class="['switch-btn', { active: viewMode === 'list' }]"
            @click="viewMode = 'list'"
          >
            📋 รายการ
          </button>
          <button
            :class="['switch-btn', { active: viewMode === 'calendar' }]"
            @click="viewMode = 'calendar'"
          >
            📅 ปฏิทิน
          </button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-pills">
        <button
          v-for="cat in CATEGORIES"
          :key="cat.id"
          :class="['pill-btn', { active: selectedCategory === cat.id }]"
          @click="selectedCategory = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Info Bar -->
      <div class="info-bar">
        <span class="events-total">พบ {{ filteredEvents.length }} กิจกรรม</span>
        <button class="sort-toggle" @click="toggleSort">
          {{ sortOrder === 'asc' ? '⏳ วันที่: เก่า ➔ ใหม่' : '⌛ วันที่: ใหม่ ➔ เก่า' }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredEvents.length === 0" class="no-results">
        <p>ไม่พบกิจกรรมที่คุณค้นหา</p>
      </div>

      <!-- Event Cards Grid / List -->
      <div v-else :class="['events-wrapper', viewMode]">
        <!-- List View -->
        <template v-if="viewMode === 'list'">
          <div
            v-for="item in filteredEvents"
            :key="item.id"
            class="event-card"
            :class="{ 'has-checked': checkedInEvents.includes(item.id) }"
            :style="{ '--accent-color': item.g ? item.g[0] : '#ff4b72' }"
          >
            <!-- Poster Banner (ถ้ามีรูปจะโชว์รูป ถ้าไม่มีจะโชว์ Gradient Placeholder) -->
            <div class="card-media">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                class="poster-image"
                loading="lazy"
              />
              <div
                v-else
                class="poster-placeholder"
                :style="{ background: getGradient(item.g) }"
              >
                <span class="placeholder-emoji">{{ item.emoji || '✨' }}</span>
              </div>
            </div>

            <div class="card-details">
              <div class="title-row">
                <span class="title-emoji">{{ item.emoji || '🎬' }}</span>
                <h3 class="event-title">{{ item.title }}</h3>
              </div>

              <div class="meta-row">
                <span class="event-date">🗓️ {{ item.date }}</span>
                <span v-if="item.location" class="event-loc">📍 {{ item.location }}</span>
              </div>

              <p v-if="item.desc" class="event-desc">{{ item.desc }}</p>

              <div class="card-bottom">
                <div class="badge-group">
                  <span v-if="isOpenEvent(item.desc)" class="tag open">🟢 ไปร่วมเชียร์ได้</span>
                  <span v-else class="tag private">🔴 งานปิด</span>
                  <span v-if="isOverseas(item.location)" class="tag overseas">✈️ ต่างประเทศ</span>
                </div>

                <button
                  :class="['btn-i-was-here', { active: checkedInEvents.includes(item.id) }]"
                  @click="toggleCheckIn(item.id)"
                >
                  <span class="btn-icon">{{ checkedInEvents.includes(item.id) ? '✅' : '📍' }}</span>
                  <span>{{ checkedInEvents.includes(item.id) ? 'I Was Here' : 'I Was Here' }}</span>
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Calendar View (Grouped by Month) -->
        <template v-else>
          <div
            v-for="(group, monthKey) in eventsByMonth"
            :key="monthKey"
            class="calendar-month-block"
          >
            <div class="month-title-bar">
              <h2>{{ getMonthLabel(monthKey) }}</h2>
              <span class="month-event-count">{{ group.length }} กิจกรรม</span>
            </div>

            <div class="calendar-cards-grid">
              <div
                v-for="item in group"
                :key="item.id"
                class="event-card"
                :class="{ 'has-checked': checkedInEvents.includes(item.id) }"
                :style="{ '--accent-color': item.g ? item.g[0] : '#ff4b72' }"
              >
                <div class="card-media">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.title"
                    class="poster-image"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="poster-placeholder"
                    :style="{ background: getGradient(item.g) }"
                  >
                    <span class="placeholder-emoji">{{ item.emoji || '✨' }}</span>
                  </div>
                </div>

                <div class="card-details">
                  <div class="title-row">
                    <span class="title-emoji">{{ item.emoji || '🎬' }}</span>
                    <h3 class="event-title">{{ item.title }}</h3>
                  </div>

                  <div class="meta-row">
                    <span class="event-date">🗓️ {{ item.date }}</span>
                    <span v-if="item.location" class="event-loc">📍 {{ item.location }}</span>
                  </div>

                  <p v-if="item.desc" class="event-desc">{{ item.desc }}</p>

                  <div class="card-bottom">
                    <div class="badge-group">
                      <span v-if="isOpenEvent(item.desc)" class="tag open">🟢 ไปร่วมเชียร์ได้</span>
                      <span v-else class="tag private">🔴 งานปิด</span>
                      <span v-if="isOverseas(item.location)" class="tag overseas">✈️ ต่างประเทศ</span>
                    </div>

                    <button
                      :class="['btn-i-was-here', { active: checkedInEvents.includes(item.id) }]"
                      @click="toggleCheckIn(item.id)"
                    >
                      <span class="btn-icon">{{ checkedInEvents.includes(item.id) ? '✅' : '📍' }}</span>
                      <span>I Was Here</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { EVENTS } from '../data/events'

const searchQuery = ref('')
const selectedCategory = ref('all')
const viewMode = ref('list')
const sortOrder = ref('asc')
const checkedInEvents = ref([])

onMounted(() => {
  const saved = localStorage.getItem('lenamiu_checked_in_events')
  if (saved) {
    try {
      checkedInEvents.value = JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
  }
})

const toggleCheckIn = (id) => {
  if (checkedInEvents.value.includes(id)) {
    checkedInEvents.value = checkedInEvents.value.filter(item => item !== id)
  } else {
    checkedInEvents.value.push(id)
  }
  localStorage.setItem('lenamiu_checked_in_events', JSON.stringify(checkedInEvents.value))
}

const checkedInCount = computed(() => checkedInEvents.value.length)

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'meeting', label: 'Fan Meeting' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'brand', label: 'Brand Event' },
  { id: 'live', label: 'Live' },
  { id: 'overseas', label: 'ต่างประเทศ' },
  { id: 'open', label: 'ไปร่วมเชียร์ได้' }
]

const MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

const isOverseas = (location = '') => {
  const keywords = ['Paris', 'Taiwan', 'Macau', 'China', 'Philippines', 'ต่างประเทศ', 'Japan', 'Singapore']
  return keywords.some(kw => location.toLowerCase().includes(kw.toLowerCase()))
}

const isOpenEvent = (desc = '') => {
  return !desc.includes('งานปิด') && !desc.includes('Private')
}

const getGradient = (colors) => {
  if (!colors || colors.length < 2) return 'linear-gradient(135deg, #2a2035, #191424)'
  return `linear-gradient(135deg, ${colors[0]}44, ${colors[1]}22)`
}

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const filteredEvents = computed(() => {
  return EVENTS.filter(item => {
    const q = searchQuery.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.desc && item.desc.toLowerCase().includes(q))

    let matchesCategory = true
    if (selectedCategory.value === 'overseas') {
      matchesCategory = isOverseas(item.location)
    } else if (selectedCategory.value === 'open') {
      matchesCategory = isOpenEvent(item.desc)
    } else if (selectedCategory.value !== 'all') {
      matchesCategory = item.type === selectedCategory.value
    }

    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
  })
})

const eventsByMonth = computed(() => {
  const groups = {}
  filteredEvents.value.forEach(item => {
    const d = new Date(item.date)
    if (isNaN(d)) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })
  return groups
})

const getMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-')
  const monthIdx = parseInt(month, 10) - 1
  return `${MONTH_NAMES[monthIdx]} ${year}`
}
</script>

<style scoped>
.events-page {
  min-height: 100vh;
  background-color: #0f0c1b;
  color: #f1f1f5;
  padding: 32px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.events-container {
  max-width: 780px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 28px;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ff758c, #ff7eb3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.page-subtitle {
  color: #9d9aa8;
  font-size: 0.95rem;
}

.checkin-counter-badge {
  display: inline-block;
  margin-top: 12px;
  padding: 6px 18px;
  background: rgba(255, 75, 114, 0.15);
  border: 1px solid rgba(255, 75, 114, 0.3);
  border-radius: 20px;
  color: #ff85a2;
  font-size: 0.9rem;
}

.checkin-counter-badge span {
  font-weight: bold;
  color: #fff;
}

.filter-section {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background: #191428;
  border: 1px solid #2d2644;
  border-radius: 10px;
  padding: 0 12px;
}

.search-icon {
  font-size: 0.9rem;
  opacity: 0.6;
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  padding: 12px 10px;
  font-size: 0.95rem;
}

.search-bar input::placeholder {
  color: #726b88;
}

.clear-btn {
  background: none;
  border: none;
  color: #8c83a8;
  cursor: pointer;
  font-size: 0.9rem;
}

.view-switch {
  display: flex;
  background: #191428;
  border: 1px solid #2d2644;
  border-radius: 10px;
  padding: 3px;
}

.switch-btn {
  background: transparent;
  border: none;
  color: #8c83a8;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.switch-btn.active {
  background: #ff4b72;
  color: #fff;
  font-weight: 600;
}

.category-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 14px;
  scrollbar-width: none;
}

.category-pills::-webkit-scrollbar {
  display: none;
}

.pill-btn {
  white-space: nowrap;
  background: #191428;
  border: 1px solid #2d2644;
  color: #9d9aa8;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pill-btn.active {
  background: #ff4b72;
  border-color: #ff4b72;
  color: #fff;
  font-weight: 600;
}

.info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  font-size: 0.85rem;
  color: #8c83a8;
}

.sort-toggle {
  background: transparent;
  border: none;
  color: #a49bbb;
  cursor: pointer;
  font-size: 0.85rem;
}

.sort-toggle:hover {
  color: #fff;
}

.events-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Event Card */
.event-card {
  position: relative;
  background: #191428;
  border: 1px solid #2d2644;
  border-left: 4px solid var(--accent-color, #ff4b72);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}

.event-card.has-checked {
  border-color: #2e7d32;
  border-left-color: #4caf50;
}

/* Media Banner */
.card-media {
  width: 100%;
  background: #120e1f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #241d38;
}

.poster-image {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.poster-placeholder {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-emoji {
  font-size: 1.3rem;
  opacity: 0.7;
}

/* Details */
.card-details {
  padding: 16px 18px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.title-emoji {
  font-size: 1.25rem;
}

.event-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 10px;
  font-size: 0.88rem;
  color: #a49bbb;
}

.event-desc {
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  color: #cfcbdd;
  line-height: 1.5;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #261f3a;
}

.badge-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 4px 9px;
  border-radius: 6px;
  background: #231c36;
  color: #b5adc9;
}

.tag.open {
  background: rgba(46, 125, 50, 0.2);
  color: #81c784;
}

.tag.private {
  background: rgba(198, 40, 40, 0.2);
  color: #e57373;
}

.tag.overseas {
  background: rgba(2, 136, 209, 0.2);
  color: #4fc3f7;
}

/* Button I Was Here */
.btn-i-was-here {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #ffffff;
  color: #1a1429;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 7px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-i-was-here:hover {
  background: #f0f0f0;
  transform: scale(1.03);
}

.btn-i-was-here.active {
  background: #2e7d32;
  border-color: #2e7d32;
  color: #ffffff;
}

/* Calendar View Grouping */
.calendar-month-block {
  margin-bottom: 28px;
}

.month-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 14px;
  border-bottom: 1px solid #2d2644;
}

.month-title-bar h2 {
  font-size: 1.25rem;
  color: #ff85a2;
  margin: 0;
}

.month-event-count {
  font-size: 0.85rem;
  color: #8c83a8;
}

.calendar-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.no-results {
  text-align: center;
  padding: 50px 0;
  color: #726b88;
}
</style>
