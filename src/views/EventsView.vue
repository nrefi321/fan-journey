<script setup>
import { ref, computed } from 'vue'
import { EVENTS } from '../data/events'
import { useFanJourney } from '../composables/useFanJourney'

// ----------------------------------------------------
// Fan Journey Composable Integration
// ----------------------------------------------------
const journey = useFanJourney()

const editingMemory = ref({})
const memoryDrafts = ref({})

// เช็คสถานะการเข้าร่วม
const isAttended = (id) => {
  if (!journey) return false
  if (typeof journey.isAttended === 'function') {
    return journey.isAttended(id)
  }
  const att = journey.attendances?.value || journey.attendances || journey.checkedEvents?.value || journey.checkedEvents || []
  if (Array.isArray(att)) {
    return att.includes(id) || att.some((x) => x === id || x?.id === id)
  }
  return !!att[id]
}

// ดึงข้อความบันทึก
const getMemory = (id) => {
  if (!journey) return ''
  if (typeof journey.getMemory === 'function') {
    return journey.getMemory(id) || ''
  }
  const att = journey.attendances?.value || journey.attendances
  if (att && att[id]) {
    return typeof att[id] === 'string' ? att[id] : (att[id].memory || att[id].note || '')
  }
  const mems = journey.memories?.value || journey.memories
  if (mems && mems[id]) return mems[id]
  return ''
}

// กดปุ่ม Check-in / เคยไปงานนี้
function handleCheckIn(id) {
  if (!journey) return
  if (typeof journey.toggleAttendance === 'function') {
    journey.toggleAttendance(id)
  } else if (typeof journey.toggleEvent === 'function') {
    journey.toggleEvent(id)
  } else if (typeof journey.toggleCheckIn === 'function') {
    journey.toggleCheckIn(id)
  } else if (isAttended(id)) {
    if (typeof journey.removeCheckIn === 'function') journey.removeCheckIn(id)
    else if (typeof journey.uncheck === 'function') journey.uncheck(id)
  } else {
    if (typeof journey.checkIn === 'function') journey.checkIn(id)
    else if (typeof journey.addCheckIn === 'function') journey.addCheckIn(id)
  }
}

function startEditMemory(id) {
  memoryDrafts.value[id] = getMemory(id)
  editingMemory.value[id] = true
}

function saveMemory(id) {
  const text = (memoryDrafts.value[id] || '').trim()
  if (journey) {
    if (typeof journey.setMemory === 'function') {
      journey.setMemory(id, text)
    } else if (typeof journey.saveMemory === 'function') {
      journey.saveMemory(id, text)
    } else if (typeof journey.addMemory === 'function') {
      journey.addMemory(id, text)
    }
  }
  editingMemory.value[id] = false
}

function cancelEditMemory(id) {
  editingMemory.value[id] = false
}

// ----------------------------------------------------
// Image Resolver & Filter
// ----------------------------------------------------
const imageErrors = ref({})

function getImageSrc(item) {
  if (imageErrors.value[item.id]) return null
  return item.image || item.poster || item.cover || item.thumbnail || item.img || null
}

function onImageError(id) {
  imageErrors.value[id] = true
}

const searchQuery = ref('')
const selectedCategory = ref('all')
const sortOrder = ref('desc')
const viewMode = ref('list')

const categories = [
  { id: 'all', label: 'ทั้งหมด', emoji: '✨' },
  { id: 'fan_meeting', label: 'Fan Meeting', emoji: '🎉' },
  { id: 'fashion', label: 'Fashion / Brand', emoji: '👗' },
  { id: 'expo', label: 'Expo / Event', emoji: '🎪' },
  { id: 'concert', label: 'Concert / Music', emoji: '🎵' },
  { id: 'movie', label: 'Movie', emoji: '🎬' },
  { id: 'overseas', label: 'ต่างประเทศ', emoji: '✈️' },
  { id: 'open_only', label: 'เฉพาะงานเปิด', emoji: '🔓' }
]

const overseasKeywords = ['Paris', 'Taiwan', 'Macau', 'China', 'Philippines', 'Singapore']

function isOverseas(location) {
  if (!location) return false
  return overseasKeywords.some((kw) => location.toLowerCase().includes(kw.toLowerCase()))
}

const filteredEvents = computed(() => {
  const list = Array.isArray(EVENTS) ? EVENTS : []
  return list.filter((item) => {
    const q = searchQuery.value.trim().toLowerCase()
    const matchSearch =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)

    let matchCat = true
    if (selectedCategory.value === 'overseas') {
      matchCat = isOverseas(item.location)
    } else if (selectedCategory.value === 'open_only') {
      matchCat = !item.description?.includes('งานปิด')
    } else if (selectedCategory.value !== 'all') {
      matchCat = item.type === selectedCategory.value
    }

    return matchSearch && matchCat
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
  })
})

const groupedByMonth = computed(() => {
  const groups = {}
  filteredEvents.value.forEach((item) => {
    const d = new Date(item.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!groups[key]) {
      const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ]
      const thaiYear = d.getFullYear() + 543
      groups[key] = {
        label: `${monthNames[d.getMonth()]} ${thaiYear}`,
        events: []
      }
    }
    groups[key].events.push(item)
  })
  return groups
})
</script>

<template>
  <div class="events-page">
    <header class="events-header">
      <h1 class="title">ตารางงานและกิจกรรม 📅</h1>
      <p class="subtitle">รวมตารางงาน อีเวนต์ และ Fan Meeting ของลีน่าหมิว</p>
    </header>

    <!-- Controls Card -->
    <div class="controls-card">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหางาน, สถานที่, รายละเอียด..."
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-pills">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="pill-btn"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          <span>{{ cat.emoji }}</span>
          <span>{{ cat.label }}</span>
        </button>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <span class="result-count">พบ {{ filteredEvents.length }} งาน</span>
        <div class="toolbar-actions">
          <button
            class="action-btn"
            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
          >
            {{ sortOrder === 'desc' ? '⬇️ ล่าสุดก่อน' : '⬆️ เก่าสุดก่อน' }}
          </button>
          <div class="view-toggle">
            <button
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              📋 รายการ
            </button>
            <button
              class="view-btn"
              :class="{ active: viewMode === 'calendar' }"
              @click="viewMode = 'calendar'"
            >
              📅 แยกรายเดือน
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredEvents.length === 0" class="empty-state">
      <p class="empty-emoji">🔍</p>
      <h3>ไม่พบกิจกรรมที่ค้นหา</h3>
      <p>ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่อีกครั้ง</p>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="events-grid">
      <div
        v-for="item in filteredEvents"
        :key="item.id"
        class="event-card"
        :class="{ attended: isAttended(item.id) }"
      >
        <!-- Poster / Banner with fixed aspect ratio -->
        <div v-if="getImageSrc(item)" class="poster-wrapper">
          <img
            :src="getImageSrc(item)"
            :alt="item.title"
            class="poster-img"
            loading="lazy"
            @error="onImageError(item.id)"
          />
          <span v-if="item.type" class="type-floating-tag">{{ item.type }}</span>
        </div>
        <div
          v-else
          class="poster-fallback"
          :style="{ background: item.color || 'linear-gradient(135deg, #ff87a8, #ff6584)' }"
        >
          <span class="fallback-emoji">{{ item.emoji || '✨' }}</span>
          <span v-if="item.type" class="type-floating-tag">{{ item.type }}</span>
        </div>

        <div class="event-body">
          <div class="event-header-row">
            <span class="event-date">📅 {{ item.date }}</span>
            <span v-if="isAttended(item.id)" class="attended-tag">💖 ไปงานนี้มาแล้ว</span>
          </div>

          <h3 class="event-title">{{ item.title }}</h3>
          <p v-if="item.location" class="event-location">📍 {{ item.location }}</p>
          <p v-if="item.description" class="event-desc">{{ item.description }}</p>

          <div class="event-actions">
            <button
              class="checkin-btn"
              :class="{ active: isAttended(item.id) }"
              @click="handleCheckIn(item.id)"
            >
              <span v-if="isAttended(item.id)">✅ ยกเลิกการเช็คอิน</span>
              <span v-else>📍 ฉันเคยไปงานนี้</span>
            </button>
          </div>

          <!-- Memory Section -->
          <div v-if="isAttended(item.id)" class="memory-box">
            <div v-if="!editingMemory[item.id]" class="memory-display">
              <p v-if="getMemory(item.id)" class="memory-text">
                💌 <strong>บันทึกความทรงจำ:</strong> {{ getMemory(item.id) }}
              </p>
              <button class="memory-btn" @click="startEditMemory(item.id)">
                {{ getMemory(item.id) ? '✏️ แก้ไขข้อความ' : '➕ เขียนบันทึกความทรงจำ' }}
              </button>
            </div>
            <div v-else class="memory-edit">
              <textarea
                v-model="memoryDrafts[item.id]"
                placeholder="เล่าความรู้สึกหรือความประทับใจในงานนี้..."
                rows="2"
                class="memory-input"
              ></textarea>
              <div class="memory-actions">
                <button class="save-btn" @click="saveMemory(item.id)">บันทึก</button>
                <button class="cancel-btn" @click="cancelEditMemory(item.id)">ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-else class="calendar-group-container">
      <div v-for="(group, key) in groupedByMonth" :key="key" class="month-section">
        <h2 class="month-title">{{ group.label }} ({{ group.events.length }} งาน)</h2>
        <div class="events-grid">
          <div
            v-for="item in group.events"
            :key="item.id"
            class="event-card"
            :class="{ attended: isAttended(item.id) }"
          >
            <div v-if="getImageSrc(item)" class="poster-wrapper">
              <img
                :src="getImageSrc(item)"
                :alt="item.title"
                class="poster-img"
                loading="lazy"
                @error="onImageError(item.id)"
              />
              <span v-if="item.type" class="type-floating-tag">{{ item.type }}</span>
            </div>
            <div
              v-else
              class="poster-fallback"
              :style="{ background: item.color || 'linear-gradient(135deg, #ff87a8, #ff6584)' }"
            >
              <span class="fallback-emoji">{{ item.emoji || '✨' }}</span>
              <span v-if="item.type" class="type-floating-tag">{{ item.type }}</span>
            </div>

            <div class="event-body">
              <div class="event-header-row">
                <span class="event-date">📅 {{ item.date }}</span>
                <span v-if="isAttended(item.id)" class="attended-tag">💖 ไปงานนี้มาแล้ว</span>
              </div>

              <h3 class="event-title">{{ item.title }}</h3>
              <p v-if="item.location" class="event-location">📍 {{ item.location }}</p>
              <p v-if="item.description" class="event-desc">{{ item.description }}</p>

              <div class="event-actions">
                <button
                  class="checkin-btn"
                  :class="{ active: isAttended(item.id) }"
                  @click="handleCheckIn(item.id)"
                >
                  <span v-if="isAttended(item.id)">✅ ยกเลิกการเช็คอิน</span>
                  <span v-else>📍 ฉันเคยไปงานนี้</span>
                </button>
              </div>

              <div v-if="isAttended(item.id)" class="memory-box">
                <div v-if="!editingMemory[item.id]" class="memory-display">
                  <p v-if="getMemory(item.id)" class="memory-text">
                    💌 <strong>บันทึกความทรงจำ:</strong> {{ getMemory(item.id) }}
                  </p>
                  <button class="memory-btn" @click="startEditMemory(item.id)">
                    {{ getMemory(item.id) ? '✏️ แก้ไขข้อความ' : '➕ เขียนบันทึกความทรงจำ' }}
                  </button>
                </div>
                <div v-else class="memory-edit">
                  <textarea
                    v-model="memoryDrafts[item.id]"
                    placeholder="เล่าความรู้สึกหรือความประทับใจในงานนี้..."
                    rows="2"
                    class="memory-input"
                  ></textarea>
                  <div class="memory-actions">
                    <button class="save-btn" @click="saveMemory(item.id)">บันทึก</button>
                    <button class="cancel-btn" @click="cancelEditMemory(item.id)">ยกเลิก</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.events-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

.events-header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
}

.controls-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 42px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #ff87a8;
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1rem;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #f1f5f9;
  background: #f8fafc;
  color: #475569;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pill-btn:hover {
  background: #f1f5f9;
}

.pill-btn.active {
  background: linear-gradient(135deg, #ff87a8, #ff6584);
  color: #ffffff;
  border-color: transparent;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}

.result-count {
  font-size: 0.88rem;
  color: #64748b;
  font-weight: 500;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn,
.view-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn.active {
  background: #1e293b;
  color: #ffffff;
  border-color: #1e293b;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.event-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
}

.event-card.attended {
  border-color: #ff87a8;
  background: #fffcfd;
}

/* Poster Aspect Ratio Styling */
.poster-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #f1f5f9;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.3s ease;
}

.event-card:hover .poster-img {
  transform: scale(1.03);
}

.poster-fallback {
  position: relative;
  width: 100%;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fallback-emoji {
  font-size: 2.8rem;
}

.type-floating-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.7);
  color: #ffffff;
  backdrop-filter: blur(4px);
  text-transform: capitalize;
}

.event-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.event-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.event-date {
  font-size: 0.82rem;
  font-weight: 600;
  color: #ff6584;
}

.attended-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ff477e;
  background: #ffe6ee;
  padding: 2px 8px;
  border-radius: 6px;
}

.event-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin: 2px 0 6px;
  line-height: 1.4;
}

.event-location {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 6px;
}

.event-desc {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 14px;
  flex-grow: 1;
}

.event-actions {
  margin-top: auto;
}

.checkin-btn {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ff87a8;
  background: rgba(255, 135, 168, 0.08);
  color: #ff5b84;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.checkin-btn.active {
  background: #f1f5f9;
  color: #64748b;
  border-color: #cbd5e1;
}

.memory-box {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #ffd4e0;
}

.memory-text {
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 6px;
  line-height: 1.4;
}

.memory-btn {
  background: none;
  border: none;
  color: #ff6584;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
}

.memory-input {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ffd4e0;
  font-size: 0.85rem;
  resize: vertical;
  margin-bottom: 6px;
  box-sizing: border-box;
}

.memory-actions {
  display: flex;
  gap: 6px;
}

.save-btn,
.cancel-btn {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  border: none;
  cursor: pointer;
}

.save-btn {
  background: #ff6584;
  color: #ffffff;
}

.cancel-btn {
  background: #e2e8f0;
  color: #475569;
}

.month-section {
  margin-bottom: 36px;
}

.month-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 16px;
  padding-bottom: 6px;
  border-bottom: 2px solid #ff87a8;
  display: inline-block;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-emoji {
  font-size: 3rem;
  margin-bottom: 8px;
}
</style>
