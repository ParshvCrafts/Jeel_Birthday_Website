import { describe, it, expect } from 'vitest'
import { calcBirthdayStats } from '../StatsCounter'

describe('calcBirthdayStats', () => {
  it('returns the age as years', () => {
    expect(calcBirthdayStats(24).years).toBe(24)
  })

  it('computes days from age using 365.25', () => {
    expect(calcBirthdayStats(24).days).toBe(Math.floor(24 * 365.25))
  })

  it('computes hours as days × 24', () => {
    const { days, hours } = calcBirthdayStats(24)
    expect(hours).toBe(days * 24)
  })

  it('computes minutes as hours × 60', () => {
    const { hours, minutes } = calcBirthdayStats(24)
    expect(minutes).toBe(hours * 60)
  })

  it('works for age 1', () => {
    const stats = calcBirthdayStats(1)
    expect(stats.days).toBe(365)
    expect(stats.hours).toBe(365 * 24)
    expect(stats.minutes).toBe(365 * 24 * 60)
  })
})
