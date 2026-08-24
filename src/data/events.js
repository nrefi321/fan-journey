export const EVENTS = [
  { id: 'e1', title: 'Fan Meeting: First Hello', date: '2024-03-16', location: 'MCC Hall, Bangkok', desc: 'งานแฟนมีตติ้งครั้งแรกที่เปิดตัวอย่างเป็นทางการ เต็มไปด้วยรอยยิ้มและความประหม่า', type: 'fanmeeting', emoji: '🎤', g: ['#FF87A8', '#FFC1D6'] },
  { id: 'e2', title: 'Birthday Fanmeet 2024', date: '2024-09-02', location: 'Union Hall, Bangkok', desc: 'ฉลองวันเกิดร่วมกับแฟนคลับ พร้อมเซอร์ไพรส์เค้กจากแฟนด้อม', type: 'birthday', emoji: '🎂', g: ['#F0C36D', '#FFE1A8'] },
  { id: 'e3', title: 'Concert: Bloom Tour', date: '2025-02-14', location: 'Impact Arena, Bangkok', desc: 'คอนเสิร์ตใหญ่ครั้งแรกของทัวร์ Bloom เสียงกรี๊ดดังทั้งฮอลล์', type: 'concert', emoji: '🎶', g: ['#8A7BFF', '#C6BBFF'] },
  { id: 'e4', title: 'Fan Letter Day', date: '2025-05-10', location: 'Online Event', desc: 'กิจกรรมเขียนจดหมายถึงศิลปิน ระบายความรู้สึกที่เก็บไว้นาน', type: 'letter', emoji: '💌', g: ['#FF87A8', '#B76E9C'] },
  { id: 'e5', title: 'Movie Premiere: Dear Us', date: '2025-08-20', location: 'Paragon Cineplex', desc: 'รอบปฐมทัศน์ภาพยนตร์เรื่องแรกที่ศิลปินร่วมแสดง', type: 'movie', emoji: '🎬', g: ['#5FB6C7', '#B7E4EA'] },
  { id: 'e6', title: 'Fan Meeting Vol. 2', date: '2025-11-03', location: 'Thunder Dome, Nonthaburi', desc: 'แฟนมีตติ้งครั้งที่สอง อบอุ่นกว่าเดิม', type: 'fanmeeting', emoji: '🎤', g: ['#FF87A8', '#FFC1D6'] },
  { id: 'e7', title: 'Movie Premiere: Second Chance', date: '2026-04-18', location: 'SF World Cinema', desc: 'ภาพยนตร์เรื่องที่สอง แนวดราม่าที่ทำให้ร้องไห้ทั้งโรง', type: 'movie', emoji: '🎬', g: ['#5FB6C7', '#B7E4EA'] },
  { id: 'e8', title: 'Fan Meeting: Ten', date: '2026-06-06', location: 'Impact Arena, Bangkok', desc: 'แฟนมีตติ้งครบรอบพิเศษ', type: 'fanmeeting', emoji: '🎤', g: ['#FF87A8', '#FFC1D6'] },
  { id: 'e9', title: 'Girls Cup 2026', date: '2026-08-01', location: 'BITEC, Bangkok', desc: 'งานรวมไอดอลหญิงประจำปี เวทีใหญ่ที่สุดของปีนี้', type: 'concert', emoji: '🏆', g: ['#F0C36D', '#FF87A8'] },
  { id: 'e10', title: 'Birthday Fanmeet 2026', date: '2026-09-02', location: 'Union Hall, Bangkok', desc: 'ฉลองวันเกิดปีนี้กับแฟนคลับทุกคน', type: 'birthday', emoji: '🎂', g: ['#F0C36D', '#FFE1A8'] },
]

export const EVENTS_BY_ID = Object.fromEntries(EVENTS.map((e) => [e.id, e]))
