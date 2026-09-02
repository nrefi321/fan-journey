import React, { useState, useMemo } from 'react';
import { EVENTS } from '../data/events';
import { EVENT_CATEGORIES, getFilteredEvents } from '../utils/eventFilters';

export default function EventSchedule() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');

  // คำนวณรายการอีเวนต์ใหม่เมื่อมีการเปลี่ยน filter หรือ sort
  const displayEvents = useMemo(() => {
    return getFilteredEvents(EVENTS, selectedTab, sortOrder);
  }, [selectedTab, sortOrder]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#D63384' }}>📅 LENA & MIU Schedule 2026</h2>

      {/* แถบปุ่ม Filter Categories */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedTab(cat.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: selectedTab === cat.key ? '#FF87A8' : '#F1F3F5',
              color: selectedTab === cat.key ? '#FFF' : '#333',
              fontWeight: selectedTab === cat.key ? 'bold' : 'normal'
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ตัวสลับเรียงลำดับวัน */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>พบทั้งหมด {displayEvents.length} รายการ</span>
        <button
          onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
          style={{ padding: '4px 10px', fontSize: '13px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #CCC' }}
        >
          {sortOrder === 'asc' ? '⏳ เรียง: เก่า ➔ ใหม่' : '⌛ เรียง: ใหม่ ➔ เก่า'}
        </button>
      </div>

      {/* รายการแสดงการ์ดอีเวนต์ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayEvents.map((item) => (
          <div
            key={item.id}
            style={{
              borderLeft: `6px solid ${item.g[0]}`,
              background: `linear-gradient(to right, ${item.g[0]}15, ${item.g[1]}10)`,
              padding: '14px 18px',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.emoji} {item.title}</span>
              <span style={{ fontSize: '13px', color: '#D63384', fontWeight: 'bold' }}>{item.date}</span>
            </div>
            <p style={{ margin: '6px 0 2px', fontSize: '13px', color: '#555' }}>📍 <b>สถานที่:</b> {item.location}</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#777' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
