export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Returns true if `date` matches the birthday day and month.
 * @param date - date to check
 * @param day - birthday day (1-31)
 * @param month - birthday month (1-12, human-readable)
 */
export function isBirthday(date: Date, day: number, month: number): boolean {
  return date.getDate() === day && date.getMonth() === month - 1
}

/**
 * Returns true if `date` is after the birthday this calendar year (not on it).
 */
export function isPastBirthday(date: Date, day: number, month: number): boolean {
  if (isBirthday(date, day, month)) return false
  const thisYearBirthday = new Date(date.getFullYear(), month - 1, day, 0, 0, 0, 0)
  return date > thisYearBirthday
}

/**
 * Returns the number of whole days elapsed since the most recent birthday occurrence.
 * Returns 0 on the birthday itself.
 */
export function getDaysSinceBirthday(date: Date, day: number, month: number): number {
  const thisYearBirthday = new Date(date.getFullYear(), month - 1, day, 0, 0, 0, 0)
  const diff = date.getTime() - thisYearBirthday.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Returns the next occurrence of the birthday after `from`.
 * If `from` is on or after the birthday this year, returns next year.
 */
export function getNextBirthday(from: Date, day: number, month: number): Date {
  const thisYear = new Date(from.getFullYear(), month - 1, day, 0, 0, 0, 0)
  if (from < thisYear) return thisYear
  return new Date(from.getFullYear() + 1, month - 1, day, 0, 0, 0, 0)
}

/**
 * Returns the remaining time from `now` to `target` as days/hours/minutes/seconds.
 * Returns all zeros if target is in the past.
 */
export function getCountdown(now: Date, target: Date): Countdown {
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}
