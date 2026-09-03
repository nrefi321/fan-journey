<template>
  <div class="event-schedule-container">
    <!-- Header -->
    <header class="schedule-header">
      <h1 class="title">LENAMIU 2026 SCHEDULE</h1>
      <p class="subtitle">ตารางงานและกิจกรรมทั้งหมดของเลน่ามิว</p>
    </header>

    <!-- Control Panel -->
    <div class="control-panel">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหางาน, สถานที่, หรือรายละเอียด..."
          class="search-input"
        />
      </div>
      <div class="view-toggle">
        <button
          :class="['toggle-btn', { active: viewMode === 'list' }]"
          @click="viewMode = 'list'"
        >
          📋 รายการ
        </button>
        <button
          :class="['toggle-btn', { active: viewMode === 'calendar' }]"
          @click="viewMode = 'calendar'"
        >
          📅 ปฏิทิน
        </button>
      </div>
    </div>

    <!-- Category Filter Bar -->
    <div class="category-bar">
      <button
        v-for="cat in CATEGORIES"
        :key="cat.id"
        :class="['category-btn', { active: selectedCategory === cat.id }]"
        @click="selectedCategory = cat.id"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Status Bar -->
    <div class="status-bar">
      <span class="event-count">พบ {{ filteredEvents.length }} กิจกรรม</span>
      <button class="sort-btn" @click="toggleSort">
        เรียงตามวันที่: {{ sortOrder === 'asc' ? 'เก่าไปใหม่ ↑' : 'ใหม่ไปเก่า ↓' }}
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredEvents.length === 0" class="empty-state">
      <p>🔍 ไม่พบกิจกรรมที่ค้นหา</p>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="event-list">
      <div
        v-for="item in filteredEvents"
        :key="item.id"
        class="event-card"
        :style="{
          borderLeft: item.g ? `5px solid ${item.g[0]}` : '5px solid #FF6B81',
          background: item.g
            ? `linear-gradient(135deg, ${item.g[0]}0D, ${item.g[1]}05)`
            : '#fff'
        }"
      >
        <!-- 🟢 Event Poster Image -->
        <div v-if="item.image" class="event-poster-wrapper">
          <img :src="item.image" :alt="item.title" class="event-poster-img" />
        </div>

        <div class="card-content">
          <div class="card-header">
            <span class="event-emoji">{{ item.emoji || '📅' }}</span>
            <div class="header-text">
              <h3 class="event-title">{{ item.title }}</h3>
              <span class="event-date">🗓️ {{ item.date }}</span>
            </div>
          </div>

          <div class="card-body">
            <p v-if="item.location" class="event-location">📍 {{ item.location }}</p>
            <p v-if="item.desc" class="event-desc">{{ item.desc }}</p>
          </div>

          <div class="card-badges">
            <span v-if="isOverseas(item.location)" class="badge overseas">✈️ ต่างประเทศ</span>
            <span v-if="item.type" class="badge type">{{ item.type }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar View (Grouped by Month) -->
    <div v-else class="calendar-view">
      <div
        v-for="(group, monthKey) in eventsByMonth"
        :key="monthKey"
        class="month-group"
      >
        <div class="month-header">
          <h2>{{ getMonthLabel(monthKey) }}</h2>
          <span class="month-count">{{ group.length }} กิจกรรม</span>
        </div>

        <div class="event-grid">
          <div
            v-for="item in group"
            :key="item.id"
            class="event-card"
            :style="{
              borderLeft: item.g ? `5px solid ${item.g[0]}` : '5px solid #FF6B81',
              background: item.g
                ? `linear-gradient(135deg, ${item.g[0]}0D, ${item.g[1]}05)`
                : '#fff'
            }"
          >
            <!-- 🟢 Event Poster Image -->
            <div v-if="item.image" class="event-poster-wrapper">
              <img :src="item.image" :alt="item.title" class="event-poster-img" />
            </div>

            <div class="card-content">
              <div class="card-header">
                <span class="event-emoji">{{ item.emoji || '📅' }}</span>
                <div class="header-text">
                  <h3 class="event-title">{{ item.title }}</h3>
                  <span class="event-date">🗓️ {{ item.date }}</span>
                </div>
              </div>

              <div class="card-body">
                <p v-if="item.location" class="event-location">📍 {{ item.location }}</p>
                <p v-if="item.desc" class="event-desc">{{ item.desc }}</p>
              </div>

              <div class="card-badges">
                <span v-if="isOverseas(item.location)" class="badge overseas">✈️ ต่างประเทศ</span>
                <span v-if="item.type" class="badge type">{{ item.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EVENTS } from '../data/events'

const searchQuery = ref('')
const selectedCategory = ref('all')
const viewMode = ref('list')
const sortOrder = ref('asc')

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'meeting', label: 'Fan Meeting' },
  { id: 'premiere', label: 'Premiere' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'brand', label: 'Brand Event' },
  { id: 'live', label: 'Live' },
  { id: 'overseas', label: 'ต่างประเทศ' }
]

const MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

const isOverseas = (location = '') => {
  const keywords = ['Paris', 'Taiwan', 'Macau', 'China', 'Philippines', 'ต่างประเทศ', 'Japan']
  return keywords.some(kw => location.toLowerCase().includes(kw.toLowerCase()))
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
.event-schedule-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
}

.schedule-header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 6px;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.control-panel {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 240px;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #ff6b81;
}

.view-toggle {
  display: flex;
  gap: 6px;
}

.toggle-btn, .category-btn, .sort-btn {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.toggle-btn.active, .category-btn.active {
  background: #ff6b81;
  color: #fff;
  border-color: #ff6b81;
}

.category-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.month-group {
  margin-bottom: 32px;
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.month-header h2 {
  font-size: 1.3rem;
  margin: 0;
  color: #2c3e50;
}

.month-count {
  font-size: 0.85rem;
  color: #888;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* Event Card */
.event-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: #fff;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* Poster Styling */
.event-poster-wrapper {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f0f0f0;
}

.event-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-content {
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.event-emoji {
  font-size: 1.6rem;
}

.header-text {
  flex: 1;
}

.event-title {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.event-date {
  font-size: 0.85rem;
  color: #777;
}

.card-body {
  margin-bottom: 12px;
}

.event-location {
  font-size: 0.9rem;
  color: #555;
  margin: 4px 0;
}

.event-desc {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
  margin: 6px 0 0 0;
}

.card-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  background: #eee;
  color: #555;
}

.badge.overseas {
  background: #e1f5fe;
  color: #0288d1;
}

.badge.type {
  background: #fff0f5;
  color: #d81b60;
  text-transform: capitalize;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
</style>
