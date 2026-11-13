import React, { useEffect, useState } from 'react'
import jeevanPramaan from './jeevan-pramaan.jpg'
import voterId from './voter-id.jpg'
import smartFinance from './smart-finance.jpg'
import './project-promotion.css'

const posters = [
  { src: smartFinance, title: 'Smart Finance Manager' },
  { src: jeevanPramaan, title: 'सीएससी जीवन प्रमाण पत्र' },
  { src: voterId, title: 'ऑनलाइन वोटर आईडी आवेदन सहायता' },
]

export default function ProjectPromotion() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const poster = posters[index]

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setIndex(current => (current + 1) % posters.length)
    }, 8000)
    return () => window.clearInterval(timer)
  }, [playing])

  const move = offset => {
    setPlaying(false)
    setIndex(current => (current + offset + posters.length) % posters.length)
  }

  return (
    <aside className="project-promotion" aria-label="विज्ञापन स्लाइडशो">
      <div className="project-promotion-header">
        <span>विज्ञापन</span>
        <button type="button" onClick={() => setPlaying(current => !current)}>
          {playing ? 'रोकें' : 'चलाएँ'}
        </button>
      </div>

      <a className="project-promotion-poster" href={poster.src}
        target="_blank" rel="noopener noreferrer"
        aria-label={poster.title + ' का पूरा पोस्टर खोलें'}
        onFocus={() => setPlaying(false)}>
        <img src={poster.src} alt={poster.title} />
      </a>

      <div className="project-promotion-controls">
        <button type="button" onClick={() => move(-1)} aria-label="पिछला विज्ञापन">‹</button>
        <span aria-live={playing ? 'off' : 'polite'}>{index + 1} / {posters.length} · {poster.title}</span>
        <button type="button" onClick={() => move(1)} aria-label="अगला विज्ञापन">›</button>
      </div>
    </aside>
  )
}
