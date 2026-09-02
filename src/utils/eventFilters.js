import { EVENTS } from '../data/events';

// ประเภทหมวดหมู่ทั้งหมดสำหรับทำปุ่ม Filter Tab
export const EVENT_CATEGORIES = [
  { key: 'all', label: 'ทั้งหมด', icon: '✨' },
  { key: 'fanmeeting', label: 'แฟนมีตติ้ง / แฟนไซน์', icon: '🎤' },
  { key: 'fashion', label: 'แฟชั่น / แบรนด์เนม', icon: '💎' },
  { key: 'brand', label: 'อีเวนต์แบรนด์ / สินค้า', icon: '🛍️' },
  { key: 'live', label: 'ไลฟ์ / ออนไลน์', icon: '📱' },
  { key: 'overseas', label: 'งานต่างประเทศ ✈️', icon: '🌏' },
  { key: 'open_only', label: 'เฉพาะงานที่ไปเชียร์ได้', icon: '🟢' }
];

/**
 * ฟิลเตอร์และจัดเรียงตามเงื่อนไขที่เลือก
 * @param {Array} events - รายการอีเวนต์ทั้งหมด
 * @param {string} filterType - ประเภทที่เลือก (all, fanmeeting, overseas, etc.)
 * @param {string} sortOrder - 'asc' (เก่า->ใหม่) หรือ 'desc' (ใหม่->เก่า)
 */
export function getFilteredEvents(events = EVENTS, filterType = 'all', sortOrder = 'asc') {
  let result = [...events];

  // คัดกรองตามหมวดหมู่
  if (filterType === 'overseas') {
    result = result.filter(e => 
      e.location.includes('Paris') ||
      e.location.includes('Taiwan') ||
      e.location.includes('Macau') ||
      e.location.includes('China') ||
      e.location.includes('Philippines')
    );
  } else if (filterType === 'open_only') {
    // กรองเอาเฉพาะงานที่ไม่ใช่งานปิด (ไม่มีคำว่า "งานปิด" ในคำอธิบาย)
    result = result.filter(e => !e.desc.includes('งานปิด'));
  } else if (filterType !== 'all') {
    result = result.filter(e => e.type === filterType);
  }

  // เรียงลำดับตามวันที่
  result.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  return result;
}
