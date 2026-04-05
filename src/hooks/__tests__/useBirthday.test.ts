import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBirthday } from '../useBirthday'

describe('useBirthday', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns isBirthday=true on April 5', () => {
    vi.setSystemTime(new Date(2026, 3, 5, 10, 0, 0))
    const { result } = renderHook(() => useBirthday())
    expect(result.current.isBirthday).toBe(true)
  })

  it('returns isBirthday=false on April 6', () => {
    vi.setSystemTime(new Date(2026, 3, 6, 10, 0, 0))
    const { result } = renderHook(() => useBirthday())
    expect(result.current.isBirthday).toBe(false)
  })

  it('returns a countdown object when not birthday', () => {
    vi.setSystemTime(new Date(2026, 3, 4, 0, 0, 0)) // April 4
    const { result } = renderHook(() => useBirthday())
    expect(result.current.countdown.days).toBe(1)
    expect(result.current.countdown.hours).toBe(0)
  })

  it('ticks the countdown every second', () => {
    vi.setSystemTime(new Date(2026, 3, 4, 23, 59, 58))
    const { result } = renderHook(() => useBirthday())
    const initialSeconds = result.current.countdown.seconds

    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current.countdown.seconds).not.toBe(initialSeconds)
  })
})
