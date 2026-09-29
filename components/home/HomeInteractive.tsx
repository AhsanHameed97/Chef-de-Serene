'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Hero frame: slow zoom-out on load + bouncing scroll cue (from the original script.js). */
export function HeroFrame({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div className={`hero-frame${loaded ? ' loaded' : ''}`} id="hero">
      {children}
      <div className="hero-br">
        <button
          type="button"
          className="scroll-circle"
          aria-label="Scroll to services"
          onClick={() => document.getElementById('credentials')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 4v15M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/** Moat rows: gold spotlight follows the cursor. */
export function MoatRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className="moat-row"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
      }}
    >
      <span className="moat-row-spot" aria-hidden="true" />
      {children}
    </div>
  )
}

/** Plated Aesthetics / Clinical Sample Menu tabs with sliding gold indicator. */
export function GalleryTabs({ plated, clinical }: { plated: React.ReactNode; clinical: React.ReactNode }) {
  const [active, setActive] = useState<'plated' | 'clinical'>('plated')
  const [slider, setSlider] = useState({ left: 6, width: 0 })
  const refs = { plated: useRef<HTMLButtonElement>(null), clinical: useRef<HTMLButtonElement>(null) }

  useLayoutEffect(() => {
    const place = () => {
      const btn = refs[active].current
      if (btn) setSlider({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
    place()
    window.addEventListener('resize', place)
    document.fonts?.ready.then(place)
    return () => window.removeEventListener('resize', place)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <>
      <div className="tabs" data-reveal role="tablist">
        <span className="tabs-slider" style={{ left: slider.left, width: slider.width }} />
        {(
          [
            ['plated', 'Plated Aesthetics'],
            ['clinical', 'Clinical Sample Menu'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            ref={refs[key]}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={`tab-btn${active === key ? ' active' : ''}`}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={`tab-panel${active === 'plated' ? ' active' : ''}`}>{plated}</div>
      <div className={`tab-panel${active === 'clinical' ? ' active' : ''}`}>{clinical}</div>
    </>
  )
}
