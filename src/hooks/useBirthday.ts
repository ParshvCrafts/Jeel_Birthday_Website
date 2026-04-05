'use client'

import { useState, useEffect } from 'react'
import { siteConfig } from '@/config/site.config'
import { isBirthday, isPastBirthday, getDaysSinceBirthday, getNextBirthday, getCountdown, type Countdown } from '@/lib/dateUtils'

const { day, month } = siteConfig.birthday

export interface BirthdayState {
  isBirthday: boolean
  isPast: boolean
  daysSince: number
  countdown: Countdown
  age: number
}

function computeState(): BirthdayState {
  const now = new Date()
  const birthday = isBirthday(now, day, month)
  const past = isPastBirthday(now, day, month)
  const next = getNextBirthday(now, day, month)
  return {
    isBirthday: birthday,
    isPast: past,
    daysSince: getDaysSinceBirthday(now, day, month),
    countdown: birthday || past ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : getCountdown(now, next),
    age: siteConfig.birthday.age,
  }
}

export function useBirthday(): BirthdayState {
  const [state, setState] = useState<BirthdayState>(computeState)

  useEffect(() => {
    const id = setInterval(() => setState(computeState()), 1000)
    return () => clearInterval(id)
  }, [])

  return state
}
