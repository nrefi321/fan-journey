import { EVENTS_BY_ID } from './events'

export const ACHIEVEMENTS = [
  {
    id: 'first_event',
    name: 'First Event',
    emoji: '🌱',
    desc: 'เช็คอินงานแรก',
    check: (attendances) => Object.keys(attendances).length >= 1,
  },
  {
    id: 'first_movie',
    name: 'First Movie',
    emoji: '🎬',
    desc: 'ไปรอบปฐมทัศน์หนัง',
    check: (attendances) => Object.keys(attendances).some((id) => EVENTS_BY_ID[id]?.type === 'movie'),
  },
  {
    id: 'birthday_event',
    name: 'Birthday Event',
    emoji: '🎂',
    desc: 'ไปงานวันเกิดศิลปิน',
    check: (attendances) => Object.keys(attendances).some((id) => EVENTS_BY_ID[id]?.type === 'birthday'),
  },
  {
    id: 'first_letter',
    name: 'First Letter',
    emoji: '💌',
    desc: 'เขียนความทรงจำครั้งแรก',
    check: (attendances) => Object.values(attendances).some((v) => v.memory && v.memory.trim().length > 0),
  },
  {
    id: 'ten_events',
    name: '10 Events',
    emoji: '🎟️',
    desc: 'เช็คอินครบ 10 งาน',
    check: (attendances) => Object.keys(attendances).length >= 10,
  },
  {
    id: 'twenty_events',
    name: '20 Events',
    emoji: '⭐',
    desc: 'เช็คอินครบ 20 งาน',
    check: (attendances) => Object.keys(attendances).length >= 20,
  },
]
