import { EVENTS_BY_ID } from './events'

// helper
const attended = (attendances, type) =>
  Object.keys(attendances).some((id) => EVENTS_BY_ID[id]?.type === type)

const countOf = (attendances, type) =>
  Object.keys(attendances).filter((id) => EVENTS_BY_ID[id]?.type === type).length

const isOverseas = (loc = '') =>
  ['Paris', 'Taiwan', 'Macau', 'China', 'Philippines', 'Singapore'].some((c) =>
    loc.includes(c)
  )

export const ACHIEVEMENTS = [

  // ─── Milestone ───────────────────────────────────────────────
  {
    id: 'first_event',
    name: 'First Step',
    emoji: '🌱',
    desc: 'เช็คอินงานแรก',
    check: (a) => Object.keys(a).length >= 1,
  },
  {
    id: 'five_events',
    name: 'Getting Serious',
    emoji: '🎯',
    desc: 'เช็คอินครบ 5 งาน',
    check: (a) => Object.keys(a).length >= 5,
  },
  {
    id: 'ten_events',
    name: 'Devoted Fan',
    emoji: '🎟️',
    desc: 'เช็คอินครบ 10 งาน',
    check: (a) => Object.keys(a).length >= 10,
  },
  {
    id: 'twenty_events',
    name: 'True Fan',
    emoji: '⭐',
    desc: 'เช็คอินครบ 20 งาน',
    check: (a) => Object.keys(a).length >= 20,
  },
  {
    id: 'thirty_events',
    name: 'Legendary',
    emoji: '👑',
    desc: 'เช็คอินครบ 30 งาน',
    check: (a) => Object.keys(a).length >= 30,
  },
  {
    id: 'all_events',
    name: 'All In 🤍',
    emoji: '🏆',
    desc: 'เช็คอินทุกงาน',
    check: (a) => Object.keys(a).length >= Object.keys(EVENTS_BY_ID).length,
  },

  // ─── Type ────────────────────────────────────────────────────
  {
    id: 'first_movie',
    name: 'Film Buff',
    emoji: '🎬',
    desc: 'ไปรอบปฐมทัศน์หนัง',
    check: (a) => attended(a, 'movie') || attended(a, 'premiere'),
  },
  {
    id: 'first_fanmeeting',
    name: 'Fan Meeting Rookie',
    emoji: '🎤',
    desc: 'ไปแฟนมีตติ้งครั้งแรก',
    check: (a) => attended(a, 'fanmeeting'),
  },
  {
    id: 'three_fanmeetings',
    name: 'Front Row Regular',
    emoji: '🎙️',
    desc: 'ไปแฟนมีตติ้งครบ 3 ครั้ง',
    check: (a) => countOf(a, 'fanmeeting') >= 3,
  },
  {
    id: 'first_fashion',
    name: 'Front Row',
    emoji: '👗',
    desc: 'ไปงาน Fashion / Brand ครั้งแรก',
    check: (a) => attended(a, 'fashion') || attended(a, 'brand'),
  },
  {
    id: 'first_festival',
    name: 'Festival Goer',
    emoji: '🎉',
    desc: 'ไปงาน Festival หรืองานประกาศรางวัล',
    check: (a) => attended(a, 'festival'),
  },
  {
    id: 'overseas_fan',
    name: 'International Fan',
    emoji: '✈️',
    desc: 'ไปงานต่างประเทศ',
    check: (a) =>
      Object.keys(a).some((id) => isOverseas(EVENTS_BY_ID[id]?.location || '')),
  },
  {
    id: 'three_overseas',
    name: 'Globe Trotter',
    emoji: '🌏',
    desc: 'ไปงานต่างประเทศครบ 3 ครั้ง',
    check: (a) =>
      Object.keys(a).filter((id) => isOverseas(EVENTS_BY_ID[id]?.location || '')).length >= 3,
  },

  // ─── Memory ──────────────────────────────────────────────────
  {
    id: 'first_letter',
    name: 'Dear Diary',
    emoji: '💌',
    desc: 'เขียนความทรงจำครั้งแรก',
    check: (a) => Object.values(a).some((v) => v.memory?.trim().length > 0),
  },
  {
    id: 'five_memories',
    name: 'Storyteller',
    emoji: '📖',
    desc: 'เขียนความทรงจำครบ 5 งาน',
    check: (a) => Object.values(a).filter((v) => v.memory?.trim().length > 0).length >= 5,
  },
  {
    id: 'long_memory',
    name: 'Novel Writer',
    emoji: '✍️',
    desc: 'เขียนความทรงจำยาวกว่า 100 ตัวอักษร',
    check: (a) => Object.values(a).some((v) => (v.memory?.trim().length || 0) >= 100),
  },

  // ─── 🔒 Secret Achievements ──────────────────────────────────
  {
    id: 'secret_eye_contact',
    name: '👁️ Eye Contact',
    emoji: '🦋',
    desc: '🔒 ปลดล็อกด้วยความทรงจำพิเศษ',
    secret: true,
    hint: 'เขียนว่า "สบตา" ในบันทึกความทรงจำ',
    check: (a) =>
      Object.values(a).some((v) => v.memory?.includes('สบตา')),
  },
  {
    id: 'secret_talked',
    name: '💬 She Talked to Me',
    emoji: '🌸',
    desc: '🔒 ปลดล็อกด้วยความทรงจำพิเศษ',
    secret: true,
    hint: 'เขียนว่า "พูดคุย" หรือ "คุยกัน" ในบันทึก',
    check: (a) =>
      Object.values(a).some(
        (v) => v.memory?.includes('พูดคุย') || v.memory?.includes('คุยกัน')
      ),
  },
  {
    id: 'secret_lucky_fan',
    name: '🍀 Lucky Fan',
    emoji: '🍀',
    desc: '🔒 ปลดล็อกด้วยความทรงจำพิเศษ',
    secret: true,
    hint: 'เขียนว่า "lucky" หรือ "โชคดี" ในบันทึก',
    check: (a) =>
      Object.values(a).some(
        (v) =>
          v.memory?.toLowerCase().includes('lucky') ||
          v.memory?.includes('โชคดี')
      ),
  },
  {
    id: 'secret_gift',
    name: '🎁 Gift Received',
    emoji: '🎁',
    desc: '🔒 ปลดล็อกด้วยความทรงจำพิเศษ',
    secret: true,
    hint: 'เขียนว่า "ของขวัญ" หรือ "รับของ" ในบันทึก',
    check: (a) =>
      Object.values(a).some(
        (v) =>
          v.memory?.includes('ของขวัญ') || v.memory?.includes('รับของ')
      ),
  },
  {
    id: 'secret_cried',
    name: '🥹 Happy Tears',
    emoji: '🥹',
    desc: '🔒 ปลดล็อกด้วยความทรงจำพิเศษ',
    secret: true,
    hint: 'เขียนว่า "ร้องไห้" หรือ "น้ำตา" ในบันทึก',
    check: (a) =>
      Object.values(a).some(
        (v) =>
          v.memory?.includes('ร้องไห้') || v.memory?.includes('น้ำตา')
      ),
  },
  {
    id: 'secret_sign',
    name: '✍️ Got a Sign',
    emoji: '💝',
    desc: '🔒 ปลดล็อกด้วยความทรงจำพิเศษ',
    secret: true,
    hint: 'เขียนว่า "เซ็น" หรือ "ลายเซ็น" ในบันทึก',
    check: (a) =>
      Object.values(a).some(
        (v) =>
          v.memory?.includes('เซ็น') || v.memory?.includes('ลายเซ็น')
      ),
  },
  {
    id: 'secret_photo',
    name: '📸 Photo Together',
    emoji: '📸',
    desc: '🔒 ปลดล็อกด้วยความทรงจำพิเศษ',
    secret: true,
    hint: 'เขียนว่า "ถ่ายรูป" หรือ "selfie" ในบันทึก',
    check: (a) =>
      Object.values(a).some(
        (v) =>
          v.memory?.includes('ถ่ายรูป') ||
          v.memory?.toLowerCase().includes('selfie')
      ),
  },
]
