<template>
  <div class="schedule-container">
    <!-- ค้นหา + ตัวกรองหมวดหมู่แบบเดิม -->
    <div class="filter-wrapper">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 ค้นหางาน, ศิลปิน, สถานที่..."
        class="search-bar"
      />

      <div class="categories-bar">
        <button
          v-for="cat in CATEGORIES"
          :key="cat.key"
          :class="['cat-btn', { active: selectedCategory === cat.key }]"
          @click="selectedCategory = cat.key"
        >
          {{ cat.icon }} {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- สรุปจำนวน -->
    <div class="schedule-summary">
      <span>พบ {{ filteredEvents.length }} งาน</span>
    </div>

    <!-- รายการ Events -->
    <div class="events-list">
      <div
        v-for="item in filteredEvents"
        :key="item.id"
        class="event-card"
        :class="{ 'is-attended': isAttended(item.id) }"
      >
        <div class="event-top">
          <span class="event-date">📅 {{ item.date }}</span>
          <span v-if="isOverseas(item.location)" class="badge-overseas">🌏 ต่างประเทศ</span>
        </div>

        <h3 class="event-title">{{ item.title }}</h3>
        <p class="event-location">📍 {{ item.location }}</p>
        <p v-if="item.desc" class="event-desc">{{ item.desc }}</p>

        <!-- ส่วนกดเช็กอินและเขียนบันทึก -->
        <div class="action-footer">
          <button
            class="checkin-btn"
            :class="{ active: isAttended(item.id) }"
            @click="handleCheckIn(item.id)"
          >
            {{ isAttended(item.id) ? '✓ เคยไปงานนี้แล้ว' : '+ เคยไปงานนี้' }}
          </button>

          <!-- ช่องบันทึกความทรงจำ (แสดงเมื่อเคยไปแล้ว) -->
          <div v-if="isAttended(item.id)" class="memory-input-box">
            <textarea
              :value="state.attendances[item.id]?.memory || ''"
              @input="e => saveMemory(item.id, e.target.value)"
              placeholder="✏️ เขียนความทรงจำในงานนี้..."
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFanJourney } from '../composables/useFanJourney'

const { state, EVENTS, isAttended, checkIn, saveMemory } = useFanJourney()

const searchQuery = ref('')
const selectedCategory = ref('all')

// หมวดหมู่และไอคอนแบบเดิม
const CATEGORIES = [
  { key: 'all', label: 'ทั้งหมด', icon: '✨' },
  { key: 'fanmeeting', label: 'มีตติ้ง/แฟนไซน์', icon: '🎤' },
  { key: 'fashion', label: 'แฟชั่น', icon: '💎' },
  { key: 'brand', label: 'แบรนด์/อีเวนต์', icon: '🛍️' },
  { key: 'live', label: 'ไลฟ์ออนไลน์', icon: '📱' },
  { key: 'overseas', label: 'ต่างประเทศ ✈️', icon: '🌏' },
  { key: 'open_only', label: 'งานเปิด/ไปเชียร์ได้', icon: '🟢' }
]

const isOverseas = (location = '') => {
  const list = ['Paris', 'Taiwan', 'Macau', 'China', 'Philippines']
  return list.some(country => location.includes(country))
}

const handleCheckIn = (id) => {
  if (!isAttended(id)) {
    const unlocked = checkIn(id)
    if (unlocked.length > 0) {
      alert(`🎉 ปลดล็อกความสำเร็จใหม่: ${unlocked.map(a => a.title).join(', ')}`)
    }
  } else {
    delete state.attendances[id]
    localStorage.setItem('fan-journey-attendances', JSON.stringify(state.attendances))
  }
}

// Logic กรองข้อมูลแบบเดิม (ใช้ item.type)
const filteredEvents = computed(() => {
  return EVENTS.filter(item => {
    // 1. กรองคำค้นหา
    const query = searchQuery.value.toLowerCase().trim()
    const matchSearch = !query ||
      item.title?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query) ||
      item.desc?.toLowerCase().includes(query)

    // 2. กรองตามหมวดหมู่
    let matchCat = true
    if (selectedCategory.value === 'overseas') {
      matchCat = isOverseas(item.location)
    } else if (selectedCategory.value === 'open_only') {
      matchCat = !item.desc?.includes('งานปิด')
    } else if (selectedCategory.value !== 'all') {
      matchCat = item.type === selectedCategory.value
    }

    return matchSearch && matchCat
  })
})
</script>

<style scoped>
.schedule-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}
.search-bar {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #E9ECEF;
  font-size: 14px;
  margin-bottom: 12px;
  box-sizing: border-box;
}
.categories-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 12px;
}
.cat-btn {
  padding: 6px 14px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  font-size: 13px;
  background-color: #F1F3F5;
  color: #495057;
  transition: all 0.2s;
}
.cat-btn.active {
  background-color: #FF87A8;
  color: #FFF;
  font-weight: bold;
}
.schedule-summary {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 12px;
}
.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.event-card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #E9ECEF;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  transition: all 0.2s;
}
.event-card.is-attended {
  border-color: #FF87A8;
  background-color: #FFF9FA;
}
.event-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.event-date {
  font-size: 13px;
  font-weight: 600;
  color: #495057;
}
.badge-overseas {
  font-size: 12px;
  background-color: #E3F2FD;
  color: #1976D2;
  padding: 2px 8px;
  border-radius: 8px;
}
.event-title {
  margin: 4px 0 6px 0;
  font-size: 16px;
  color: #212529;
}
.event-location, .event-desc {
  font-size: 13px;
  color: #6C757D;
  margin: 3px 0;
}
.action-footer {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #E9ECEF;
}
.checkin-btn {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #FF87A8;
  background: white;
  color: #FF87A8;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.checkin-btn.active {
  background: #FF87A8;
  color: white;
}
.memory-input-box {
  margin-top: 8px;
}
.memory-input-box textarea {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #CED4DA;
  font-size: 13px;
  box-sizing: border-box;
  resize: vertical;
}
</style>
