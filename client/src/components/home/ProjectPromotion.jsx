import React, { useEffect, useState } from 'react'
import jeevanPramaan from './jeevan-pramaan.jpg'
import voterId from './voter-id.jpg'
import smartFinance from './smart-finance.jpg'
import './project-promotion.css'

const bundledPosters = {
  'smart-finance': smartFinance,
  'jeevan-pramaan': jeevanPramaan,
  'voter-id': voterId,
}

export default function ProjectPromotion() {
  const [posters, setPosters] = useState([])
  useEffect(() => {
    const request = new AbortController()
    fetch('/api/ads', { signal: request.signal })
      .then(response => response.ok ? response.json() : [])
      .then(setPosters)
      .catch(() => {})
    return () => request.abort()
  }, [])

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const poster = posters[index]

  useEffect(() => {
    if (!playing || posters.length < 2) return
    const timer = window.setInterval(() => {
      setIndex(current => (current + 1) % posters.length)
    }, 8000)
    return () => window.clearInterval(timer)
  }, [playing, posters.length])

  const move = offset => {
    setPlaying(false)
    setIndex(current => (current + offset + posters.length) % posters.length)
  }

  if (!poster) return null
  const src = bundledPosters[poster.src] ?? poster.src

  return (
    <aside className="project-promotion" aria-label="विज्ञापन स्लाइडशो">
      <div className="project-promotion-header">
        <span>विज्ञापन</span>
        <button type="button" disabled={posters.length < 2} onClick={() => setPlaying(current => !current)}>
          {playing ? 'रोकें' : 'चलाएँ'}
        </button>
      </div>

      <a className="project-promotion-poster" href={src}
        target="_blank" rel="noopener noreferrer"
        aria-label={poster.title + ' का पूरा पोस्टर खोलें'}
        onFocus={() => setPlaying(false)}>
        <img src={src} alt={poster.title} />
      </a>

      <div className="project-promotion-controls">
        <button type="button" disabled={posters.length < 2} onClick={() => move(-1)} aria-label="पिछला विज्ञापन">‹</button>
        <span aria-live={playing ? 'off' : 'polite'}>{index + 1} / {posters.length} · {poster.title}</span>
        <button type="button" disabled={posters.length < 2} onClick={() => move(1)} aria-label="अगला विज्ञापन">›</button>
      </div>
    </aside>
  )
}
