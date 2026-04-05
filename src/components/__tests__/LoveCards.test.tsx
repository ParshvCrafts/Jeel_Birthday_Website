import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { LoveCards } from '../LoveCards'

// Stub browser APIs that jsdom does not implement
beforeAll(() => {
  // IntersectionObserver — used by framer-motion viewport/whileInView
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof IntersectionObserver

  // matchMedia — used by useReducedMotion
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

// Framer Motion: replace motion.* with plain elements so no animation infra runs
vi.mock('framer-motion', () => {
  const makeEl = (tag: string) =>
    // eslint-disable-next-line react/display-name
    React.forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLElement>, ref: React.Ref<HTMLElement>) => {
      // Strip framer-specific props before passing to DOM element
      const {
        initial, animate, exit, transition, variants, whileHover, whileTap, whileInView,
        viewport, layout, layoutId, drag, dragConstraints, onAnimationComplete,
        ...domProps
      } = props as Record<string, unknown>
      void initial; void animate; void exit; void transition; void variants
      void whileHover; void whileTap; void whileInView; void viewport; void layout
      void layoutId; void drag; void dragConstraints; void onAnimationComplete
      return React.createElement(tag, { ...domProps, ref }, children)
    })
  return {
    motion: {
      div: makeEl('div'),
      p: makeEl('p'),
      section: makeEl('section'),
      h1: makeEl('h1'),
      h2: makeEl('h2'),
      h3: makeEl('h3'),
      span: makeEl('span'),
      ul: makeEl('ul'),
      li: makeEl('li'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    useInView: () => true,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useReducedMotion: () => false,
  }
})

describe('LoveCards', () => {
  it('renders 9 cards', () => {
    render(<LoveCards />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(9)
  })

  it('renders the section title', () => {
    render(<LoveCards />)
    expect(screen.getByText(/9 things i love about you/i)).toBeTruthy()
  })

  it('shows card number on front face', () => {
    render(<LoveCards />)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('9')).toBeTruthy()
  })
})
