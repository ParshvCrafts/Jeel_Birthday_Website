'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Path draw takes ~1.4s, then fade ~0.6s
    let inner: ReturnType<typeof setTimeout>
    const timer = setTimeout(() => {
      setVisible(false)
      inner = setTimeout(onComplete, 600)
    }, 1400)
    return () => {
      clearTimeout(timer)
      clearTimeout(inner)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-canvas"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <svg
            viewBox="0 0 320 80"
            width="320"
            height="80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <text
              x="50%"
              y="62"
              textAnchor="middle"
              fontFamily="var(--font-playfair), Georgia, serif"
              fontSize="56"
              fontWeight="700"
              fill="none"
              stroke="#c9a87c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 800,
                strokeDashoffset: 800,
                animation: 'draw-path 1.4s ease forwards',
              }}
            >
              Chiku
            </text>
          </svg>
          <style>{`
            @keyframes draw-path {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
