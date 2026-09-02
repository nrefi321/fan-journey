export const EVENTS = [
  {
    id: 'e1',
    title: 'งานนิทรรศการชุดไทยพระราชนิยมเทิดพระเกียรติฯ',
    date: '2026-01-14',
    location: 'Thara Hall ชั้น M, ICONSIAM',
    desc: 'งานนิทรรศการชุดไทยพระราชนิยมเทิดพระเกียรติ สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ พระบรมราชชนนีพันปีหลวง (งานปิด / มีรวมพลหลังจบงาน)',
    type: 'exhibition',
    emoji: '👑',
    g: ['#FF87A8', '#FFE1A8']
  },
  {
    id: 'e2',
    title: 'LENA & MIU Born to Shine Fan Meeting',
    date: '2026-02-01',
    location: 'Phenix Grand Ballroom ชั้น 5, Bangkok',
    desc: 'แฟนมีตติ้งสุดพิเศษ Born to Shine พบกับโชว์และโมเมนต์สุดประทับใจร่วมกับแฟนๆ',
    type: 'fanmeeting',
    emoji: '🎤',
    g: ['#FF87A8', '#FFC1D6']
  },
  {
    id: 'e3',
    title: 'CHANEL Coco Crush Pop-up Event',
    date: '2026-02-03',
    location: 'Siam Paragon, Bangkok',
    desc: 'งาน Pop-up Store สุดเอ็กซ์คลูซีฟจาก CHANEL Coco Crush ร่วมให้กำลังใจศิลปินบริเวณรอบงาน',
    type: 'fashion',
    emoji: '💎',
    g: ['#D4AF37', '#F3E5AB']
  },
  {
    id: 'e4',
    title: 'BEAUTRIUM HOUSE OF PERFUME',
    date: '2026-02-14',
    location: 'BEAUTRIUM Siam Square Flagship Store',
    desc: 'ฉลองวันวาเลนไทน์สุดหวานในงานน้ำหอมแห่งปี ร่วมให้กำลังใจรอบบริเวณงาน',
    type: 'brand',
    emoji: '🌸',
    g: ['#FF87A8', '#B76E9C']
  },
  {
    id: 'e5',
    title: 'CHANEL Fall-Winter 2026',
    date: '2026-03-09',
    location: 'Grand Palais, Paris, France',
    desc: 'แฟชั่นโชว์ระดับโลก Paris Fashion Week ร่วมส่งกำลังใจสู่มหานครปารีส',
    type: 'fashion',
    emoji: '🗼',
    g: ['#8A7BFF', '#C6BBFF']
  },
  {
    id: 'e6',
    title: 'LenaMiu 1st Fan Meeting in Taipei',
    date: '2026-03-14',
    location: 'Zepp New Taipei, Taiwan',
    desc: 'แฟนมีตติ้งต่างประเทศครั้งแรกที่ไทเป สัมผัสความอบอุ่นและโมเมนต์สุดฟินกับแฟนคลับอินเตอร์',
    type: 'fanmeeting',
    emoji: '✈️',
    g: ['#FF87A8', '#FFC1D6']
  },
  {
    id: 'e7',
    title: 'LenaMiu 1st Fan Meeting in Macau',
    date: '2026-03-21',
    location: 'Macau Tower, Macau',
    desc: 'เดินสายส่งความสุขต่อเนื่องกับแฟนมีตติ้งครั้งแรก ณ มาเก๊า พร้อมแฟนเบเนฟิตจัดเต็ม',
    type: 'fanmeeting',
    emoji: '🇲🇴',
    g: ['#F0C36D', '#FFE1A8']
  },
  {
    id: 'e8',
    title: 'Vaseline Live Exclusive กับ "ลีน่า-หมิว"',
    date: '2026-03-28',
    location: 'Online Live Streaming',
    desc: 'ไลฟ์พูดคุยสุดเอ็กซ์คลูซีฟผ่านหน้าจอ ติดตามโมเมนต์น่ารักๆ และโปรโมชั่นพิเศษทางออนไลน์',
    type: 'live',
    emoji: '📱',
    g: ['#5FB6C7', '#8A7BFF']
  },
  {
    id: 'e9',
    title: 'Vaseline Gluta-Hya Event with LenaMiu',
    date: '2026-03-29',
    location: 'G Floor, Gaysorn Amarin Forum, Bangkok',
    desc: 'งานเปิดตัวและกิจกรรมพิเศษร่วมกับ Vaseline Gluta-Hya ร่วมเชียร์ศิลปินได้บริเวณรอบพื้นที่จัดงาน',
    type: 'brand',
    emoji: '💖',
    g: ['#F0C36D', '#FF87A8']
  }
]

export const EVENTS_BY_ID = Object.fromEntries(EVENTS.map((e) => [e.id, e]))
