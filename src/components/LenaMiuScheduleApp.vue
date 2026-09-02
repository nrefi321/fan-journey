<template>
  <div class="schedule-container">
    <!-- Header -->
    <header class="header">
      <h1>🌸 LENAMIU 2026 SCHEDULE 🌸</h1>
      <p>ตารางงาน ลีน่า - หมิว ตลอดปี 2026</p>
    </header>

    <!-- Search & View Toggle -->
    <div class="control-panel">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="🔍 ค้นหาสถานที่, ชื่องาน, ประเทศ..."
        class="search-input"
      />

      <div class="view-toggle">
        <button
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          📋 รายการ
        </button>
        <button
          :class="{ active: viewMode === 'calendar' }"
          @click="viewMode = 'calendar'"
        >
          📅 ปฏิทินรายเดือน
        </button>
      </div>
    </div>

    <!-- Category Tabs -->
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

    <!-- Status & Sort -->
    <div class="status-bar">
      <span>พบทั้งหมด <b>{{ filteredEvents.length }}</b> กิจกรรม</span>
      <button class="sort-btn" @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
        {{ sortOrder === 'asc' ? '⏳ วันที่: เก่า ➔ ใหม่' : '⌛ วันที่: ใหม่ ➔ เก่า' }}
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="filteredEvents.length === 0" class="empty-state">
      <p style="font-size: 32px; margin: 0">🔍</p>
      <p>ไม่พบกิจกรรมตามเงื่อนไขที่ค้นหา</p>
    </div>

    <!-- VIEW 1: List View -->
    <div v-if="viewMode === 'list'" class="event-list">
      <div
        v-for="item in filteredEvents"
        :key="item.id"
        class="event-card"
        :style="{
          borderLeft: `5px solid ${item.g[0]}`,
          background: `linear-gradient(135deg, ${item.g[0]}15, ${item.g[1]}10)`
        }"
      >
        <div class="card-header">
          <h4>{{ item.emoji }} {{ item.title }}</h4>
          <span class="card-date">{{ item.date }}</span>
        </div>
        <div class="card-body">
          <p>📍 <b>สถานที่:</b> {{ item.location }}</p>
          <p class="desc">{{ item.desc }}</p>
        </div>
        <div class="badges">
          <span :class="['badge', item.desc.includes('งานปิด') ? 'private' : 'open']">
            {{ item.desc.includes('งานปิด') ? '🔴 งานปิด' : '🟢 ไปร่วมเชียร์ได้' }}
          </span>
          <span v-if="isOverseas(item.location)" class="badge overseas">
            ✈️ ต่างประเทศ
          </span>
        </div>
      </div>
    </div>

    <!-- VIEW 2: Calendar View -->
    <div v-if="viewMode === 'calendar'" class="calendar-list">
      <div v-for="(items, monthKey) in eventsByMonth" :key="monthKey" class="month-group">
        <h3 class="month-title">
          🗓️ {{ getMonthLabel(monthKey) }}
          <span class="badge-count">{{ items.length }} งาน</span>
        </h3>
        <div class="event-list">
          <div
            v-for="item in items"
            :key="item.id"
            class="event-card"
            :style="{
              borderLeft: `5px solid ${item.g[0]}`,
              background: `linear-gradient(135deg, ${item.g[0]}15, ${item.g[1]}10)`
            }"
          >
            <div class="card-header">
              <h4>{{ item.emoji }} {{ item.title }}</h4>
              <span class="card-date">{{ item.date }}</span>
            </div>
            <div class="card-body">
              <p>📍 <b>สถานที่:</b> {{ item.location }}</p>
              <p class="desc">{{ item.desc }}</p>
            </div>
            <div class="badges">
              <span :class="['badge', item.desc.includes('งานปิด') ? 'private' : 'open']">
                {{ item.desc.includes('งานปิด') ? '🔴 งานปิด' : '🟢 ไปร่วมเชียร์ได้' }}
              </span>
              <span v-if="isOverseas(item.location)" class="badge overseas">
                ✈️ ต่างประเทศ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { EVENTS } from '../data/events';

const CATEGORIES = [
  { key: 'all', label: 'ทั้งหมด', icon: '✨' },
  { key: 'fanmeeting', label: 'มีตติ้ง/แฟนไซน์', icon: '🎤' },
  { key: 'fashion', label: 'แฟชั่น', icon: '💎' },
  { key: 'brand', label: 'แบรนด์/อีเวนต์', icon: '🛍️' },
  { key: 'live', label: 'ไลฟ์ออนไลน์', icon: '📱' },
  { key: 'overseas', label: 'ต่างประเทศ ✈️', icon: '🌏' },
  { key: 'open_only', label: 'งานเปิด/ไปเชียร์ได้', icon: '🟢' }
];

const MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const searchTerm = ref('');
const selectedCategory = ref('all');
const sortOrder = ref('asc');
const viewMode = ref('list');

const isOverseas = (location) => {
  const list = ['Paris', 'Taiwan', 'Macau', 'China', 'Philippines'];
  return list.some((kw) => location.includes(kw));
};

const filteredEvents = computed(() => {
  return EVENTS.filter((item) => {
    const term = searchTerm.value.trim().toLowerCase();
    const matchSearch =
      !term ||
      item.title.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term) ||
      item.desc.toLowerCase().includes(term);

    let matchCat = true;
    if (selectedCategory.value === 'overseas') {
      matchCat = isOverseas(item.location);
    } else if (selectedCategory.value === 'open_only') {
      matchCat = !item.desc.includes('งานปิด');
    } else if (selectedCategory.value !== 'all') {
      matchCat = item.type === selectedCategory.value;
    }

    return matchSearch && matchCat;
  }).sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder.value === 'asc' ? timeA - timeB : timeB - timeA;
  });
});

const eventsByMonth = computed(() => {
  const grouped = {};
  filteredEvents.value.forEach((ev) => {
    const d = new Date(ev.date);
    const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!grouped[mKey]) grouped[mKey] = [];
    grouped[mKey].push(ev);
  });
  return grouped;
});

const getMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-');
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${parseInt(year, 10) + 543}`;
};
</script>

<style scoped>
.schedule-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 16px;
  font-family: system-ui, sans-serif;
}
.header {
  text-align: center;
  margin-bottom: 24px;
}
.header h1 {
  margin: 0;
  color: #D63384;
  font-size: 24px;
}
.header p {
  margin: 6px 0 0;
  color: #777;
  font-size: 14px;
}
.control-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.search-input {
  flex: 1 1 240px;
  padding: 10px 16px;
  border-radius: 24px;
  border: 1px solid #E2E8F0;
  outline: none;
  font-size: 14px;
}
.view-toggle {
  display: flex;
  background: #F1F3F5;
  border-radius: 24px;
  padding: 3px;
}
.view-toggle button {
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  background: transparent;
  color: #666;
}
.view-toggle button.active {
  background: #FFF;
  color: #D63384;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
}
.cat-btn.active {
  background-color: #FF87A8;
  color: #FFF;
  font-weight: bold;
}
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  font-size: 13px;
  color: #666;
}
.sort-btn {
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid #DDD;
  background: #FFF;
}
.event-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.event-card {
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.card-header h4 {
  margin: 0;
  font-size: 15px;
  color: #2B2D42;
}
.card-date {
  font-size: 12px;
  font-weight: bold;
  color: #D63384;
  white-space: nowrap;
}
.card-body {
  margin-top: 6px;
  font-size: 13px;
  color: #4A5568;
}
.card-body p {
  margin: 2px 0;
}
.card-body .desc {
  font-size: 12.5px;
  color: #718096;
}
.badges {
  margin-top: 8px;
  display: flex;
  gap: 6px;
}
.badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}
.badge.open {
  background: #E6FCF5;
  color: #0CA678;
}
.badge.private {
  background: #FFE5E5;
  color: #E03131;
}
.badge.overseas {
  background: #E7F5FF;
  color: #1C7ED6;
}
.month-group {
  background: #FAFAFA;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #EEE;
  margin-bottom: 20px;
}
.month-title {
  margin: 0 0 12px;
  color: #D63384;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}
.badge-count {
  font-size: 12px;
  background: #FFC1D6;
  color: #901B4B;
  padding: 2px 8px;
  border-radius: 12px;
}
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
</style>
