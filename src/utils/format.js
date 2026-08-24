const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function formatDate(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00')
  return `${String(dt.getDate()).padStart(2, '0')} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`
}

export function yearOf(dateStr) {
  return new Date(dateStr + 'T00:00:00').getFullYear()
}
