'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

const PARTICLE_COUNT = 25

function particleStyle(i: number): React.CSSProperties {
  const left = (i * 37 + 11) % 97
  const top = (i * 53 + 7) % 91
  const size = 2 + (i % 3)
  const opacity = 0.15 + (i % 5) * 0.06
  const duration = 4 + (i % 5)
  const delay = (i % 8) * 0.5
  const color = i % 3 === 0 ? '#f5f0e8' : '#c9a87c'
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    opacity,
    backgroundColor: color,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  }
}

export function ParticleField() {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float-drift"
          style={particleStyle(i)}
        />
      ))}
    </div>
  )
}
