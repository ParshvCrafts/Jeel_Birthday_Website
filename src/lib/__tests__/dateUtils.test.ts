import { describe, it, expect } from 'vitest'
import {
  isBirthday,
  getNextBirthday,
  getCountdown,
  type Countdown,
} from '../dateUtils'

describe('isBirthday', () => {
  it('returns true on April 5', () => {
    const april5 = new Date(2026, 3, 5, 12, 0, 0) // month is 0-indexed
    expect(isBirthday(april5, 5, 4)).toBe(true)
  })

  it('returns false on April 4', () => {
    const april4 = new Date(2026, 3, 4, 12, 0, 0)
    expect(isBirthday(april4, 5, 4)).toBe(false)
  })

  it('returns false on April 6', () => {
    const april6 = new Date(2026, 3, 6, 12, 0, 0)
    expect(isBirthday(april6, 5, 4)).toBe(false)
  })
})

describe('getNextBirthday', () => {
  it('returns April 5 of the same year when called before April 5', () => {
    const jan1 = new Date(2026, 0, 1)
    const next = getNextBirthday(jan1, 5, 4)
    expect(next.getFullYear()).toBe(2026)
    expect(next.getMonth()).toBe(3)
    expect(next.getDate()).toBe(5)
  })

  it('returns April 5 of the next year when called after April 5', () => {
    const april6 = new Date(2026, 3, 6)
    const next = getNextBirthday(april6, 5, 4)
    expect(next.getFullYear()).toBe(2027)
    expect(next.getMonth()).toBe(3)
    expect(next.getDate()).toBe(5)
  })

  it('returns April 5 of the next year when called on April 5 itself', () => {
    const april5 = new Date(2026, 3, 5, 10, 0, 0)
    const next = getNextBirthday(april5, 5, 4)
    expect(next.getFullYear()).toBe(2027)
  })
})

describe('getCountdown', () => {
  it('returns correct days/hours/minutes/seconds', () => {
    const now = new Date(2026, 3, 4, 12, 0, 0) // April 4, noon
    const target = new Date(2026, 3, 5, 12, 0, 0) // April 5, noon
    const result = getCountdown(now, target)
    expect(result.days).toBe(1)
    expect(result.hours).toBe(0)
    expect(result.minutes).toBe(0)
    expect(result.seconds).toBe(0)
  })

  it('returns all zeros when target is in the past', () => {
    const now = new Date(2026, 3, 6)
    const target = new Date(2026, 3, 5)
    const result = getCountdown(now, target)
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  })
})
