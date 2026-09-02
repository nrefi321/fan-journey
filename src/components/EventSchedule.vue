<template>
  <div class="schedule-view">
    <!-- ส่วน Search & Filter เดิม -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="🔍 ค้นหางาน, สถานที่, หรือรายละเอียด..."
        class="search-input"
      />

      <div class="category-pills">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          :class="['pill', { active: selectedCategory === cat.id }]"
          @click="selectedCategory = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- สรุปจำนวนผลลัพธ์ -->
    <div class="results-count">
      พบทั้งหมด {{ filteredEvents.length }} งาน
    </div>

    <!-- รายการ Events -->
    <div class="events-list">
      <div 
        v-for="ev in filteredEvents" 
        :key="ev.id"
        class="event-card"
        :class="{ 'is-attended': isAttended(ev.id) }"
      >
        <div class="event-header">
          <span class="event-date">📅 {{ ev.date }}</span>
          <span v-if="isOverseas(ev.location)" class="tag-overseas">✈️ ต่างประเทศ</span>
        </div>

        <h3 class="event-title">{{ ev.title }}</h3>
        <p class="event-location">📍 {{ ev.location }}</p>
        <p class="event-desc">{{ ev.desc }}</p>

        <!-- โซนปุ่ม Action เช็กอิน & บันทึกความทรงจำ -->
        <div class="action-box">
          <button 
            class="btn-checkin"
            :class="{ active: isAttended(ev.id) }"
            @click="handleCheckIn(ev.id)"
          >
            {{ isAttended(ev.id) ? '✓ เคยไปงานนี้แล้ว' : '+ เช็กอิน (เคยไป)' }}
          </button>

          <!-- ช่องกรอกความทรงจำ (จะแสดงขึ้นมาเมื่อกดเช็กอินแล้ว) -->
          <div v-if="isAttended(ev.id)" class="memory-input-wrapper">
            <textarea
              :value="state.attendances[ev.id]?.memory || ''"
              @input="e => saveMemory(ev.id, e.target.value)"
              placeholder="✏️ เขียนความทรงจำสั้นๆ ในงานนี้..."
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

// ดึง State และฟังก์ชันมาจาก Composable
const { state, EVENTS, isAttended, checkIn, saveMemory } = useFanJourney()

const searchQuery = ref('')
const selectedCategory = ref('all')

const categories = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'fanmeeting', label: 'มีตติ้ง/แฟนไซน์' },
  { id: 'fashion', label: 'แฟชั่น' },
  { id: 'brand', label: 'แบรนด์/อีเวนต์' },
  { id: 'live', label: 'ไลฟ์ออนไลน์' },
  { id: 'overseas', label: 'ต่างประเทศ ✈️' },
  { id: 'open_only', label: 'งานเปิด/ไปเชียร์ได้' }
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
    // กดยกเลิกเช็กอิน (ถ้าต้องการลบออก)
    delete state.attendances[id]
    localStorage.setItem('fan-journey-attendances', JSON.stringify(state.attendances))
  }
}

// ระบบ Filter & Search
const filteredEvents = computed(() => {
  return EVENTS.filter(ev => {
    // 1. Text Search
    const query = searchQuery.value.toLowerCase().trim()
    const matchSearch = !query || 
      ev.title?.toLowerCase().includes(query) ||
      ev.location?.toLowerCase().includes(query) ||
      ev.desc?.toLowerCase().includes(query)

    // 2. Category Filter
    let matchCat = true
    if (selectedCategory.value === 'overseas') {
      matchCat = isOverseas(ev.location)
    } else if (selectedCategory.value === 'open_only') {
      matchCat = !ev.desc?.includes('งานปิด')
    } else if (selectedCategory.value !== 'all') {
      matchCat = ev.category === selectedCategory.value
    }

    return matchSearch && matchCat
  })
})
</script>

<style scoped>
.schedule-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}
.search-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 14px;
  margin-bottom: 12px;
  box-sizing: border-box;
}
.category-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 12px;
}
.pill {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background: #fff;
  white-space: nowrap;
  font-size: 13px;
  cursor: pointer;
}
.pill.active {
  background: #ff4081;
  color: white;
  border-color: #ff4081;
}
.results-count {
  font-size: 13px;
  color: #666;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #eee;
  transition: all 0.2s ease;
}
.event-card.is-attended {
  border-color: #ff4081;
  background-color: #fff9fa;
}
.event-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.event-date {
  font-size: 13px;
  font-weight: bold;
  color: #555;
}
.tag-overseas {
  font-size: 12px;
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 8px;
}
.event-title {
  margin: 4px 0;
  font-size: 16px;
}
.event-location, .event-desc {
  font-size: 13px;
  color: #666;
  margin: 4px 0;
}
.action-box {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}
.btn-checkin {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ff4081;
  background: white;
  color: #ff4081;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}
.btn-checkin.active {
  background: #ff4081;
  color: white;
}
.memory-input-wrapper {
  margin-top: 8px;
}
.memory-input-wrapper textarea {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 13px;
  box-sizing: border-box;
  resize: vertical;
}
</style>
