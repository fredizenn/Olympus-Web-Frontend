import dayjs from 'dayjs'

export function format(dateString: string, format: string): string {
  if (!dateString || dateString === '') return ''
  return dayjs(dateString).format(format)
}

export function formatDate(dateString: string): string {
  return format(dateString, 'DD MMM YYYY')
}

export function formatDateTime(dateString: string): string {
  return format(dateString, 'DD MMM YYYY HH:mm')
}

export function toDate(dateString: string): Date {
  return dayjs(dateString, 'YYYY-MM-DD').toDate()
}

export function toDateTime(dateString: string): Date {
  return dayjs(dateString, 'YYYY-MM-DD HH:mm:ss').toDate()
}

export function startOfMonth() {
  const date = new Date()
  const y = date.getFullYear()
  const m = date.getMonth()
  return dayjs(new Date(y, m, 1)).format('YYYY-MM-DD')
}

export function today() {
  return dayjs(new Date()).format('YYYY-MM-DD')
}

export function yearDifference(dateString?: string) {
  return dayjs(new Date()).diff(dateString, 'year')
}

export function dayDifference(dateString?: string) {
  return dayjs(new Date()).diff(dateString, 'day')
}

export const monthsString = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
]
