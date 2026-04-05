'use client'

import { useState, useEffect } from 'react'
import { siteConfig } from '@/config/site.config'
import { isBirthday, getNextBirthday, getCountdown, type Countdown } from '@/lib/dateUtils'

const { day, month } = siteConfig.birthday

export interface BirthdayState {
  isBirthday: boolean
  countdown: Countdown
  age: number
}

export function useBirthday(): BirthdayState {
  const [state, setState] = useState<BirthdayState>(() => {
    const now = new Date()
    const birthday = isBirthday(now, day, month)
    const next = getNextBirthday(now, day, month)
    return {
      isBirthday: birthday,
      countdown: birthday ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : getCountdown(now, next),
      age: siteConfig.birthday.age,
    }
  })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const birthday = isBirthday(now, day, month)
      const next = getNextBirthday(now, day, month)
      setState({
        isBirthday: birthday,
        countdown: birthday ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : getCountdown(now, next),
        age: siteConfig.birthday.age,
      })
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return state
}
