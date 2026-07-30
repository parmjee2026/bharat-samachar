import React, { useEffect, useMemo, useState } from 'react'
import Header from './components/layout/Header'

import Visual from './components/common/Visual'
import NewsGrid from './components/home/NewsGrid'
import BreakingTicker from './components/layout/BreakingTicker'
import HeroSection from './components/home/HeroSection'
const categories = [
  ['top', 'होम'],
  ['nation', 'राष्ट्रीय'],
  ['world', 'दुनिया'],
  ['business', 'व्यापार'],
  ['technology', 'टेक्नोलॉजी'],
  ['sports', 'खेल'],
  ['entertainment', 'मनोरंजन'],
  ['health', 'स्वास्थ्य'],
]
const labels = Object.fromEntries(categories)

const defaultBreaking = [
  {
    id: 'live-default-1',
    text: 'भारत समाचार: देश-दुनिया की ताज़ा खबरों के लिए जुड़े रहें',
  },
  {
    id: 'live-default-2',
    text: 'दैनिक पंचांग, राशिफल, व्रत और त्योहार की पूरी जानकारी अब उपलब्ध है',
  },
]

const fallback = Array.from({ length: 12 }, (_, i) => ({
  id: `fallback-${i}`,
  title: i ? 'लाइव हिंदी समाचार अपडेट' : 'भारत समाचार में आपका स्वागत है',
  description: 'ताज़ा समाचार लोड किए जा रहे हैं।',
  link: '#',
  source: 'भारत समाचार',
  pubDate: new Date().toISOString(),
  image: '',
  category: 'top',
}))

const fmt = value => {
  try {
    return new Date(value).toLocaleString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

const categoryImages = {
  top: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1400&q=82',
  ],
  nation: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1532664189809-02133fee698d?auto=format&fit=crop&w=1400&q=82',
  ],
  world: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=82',
  ],
  business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=82',
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1400&q=82',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=82',
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=82',
  ],
  health: [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=82',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1400&q=82',
  ],
}

const stableIndex = value =>
  Array.from(String(value || '')).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % 3


function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <b>भारत समाचार</b>
          <p>खबर जो मायने रखे</p>
        </div>

        <div className="footer-links">
          <a href="#/about">हमारे बारे में</a>
          <a href="#/contact">संपर्क</a>
          <a href="#/editorial-policy">संपादकीय नीति</a>
          <a href="#/privacy">गोपनीयता नीति</a>
          <a href="#/terms">नियम व शर्तें</a>
          <a href="#/admin">Editorial Panel</a>
          <a href="#/bookmarks">बुकमार्क</a>
        </div>

        <small>© 2026 Bharat Samachar. All rights reserved.</small>
      </div>
    </footer>
  )
}

function InfoPage({ title, kicker, children }) {
  return (
    <main className="container page-shell info-page">
      <div className="page-title">
        <span>{kicker}</span>
        <h1>{title}</h1>
      </div>

      <article>{children}</article>
    </main>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  )
}

export default function App() {
  const [category, setCategory] = useState('top')
  const [news, setNews] = useState([])
  const [breaking, setBreaking] = useState([])
  const [panchang, setPanchang] = useState(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark',
  )

  const [route, setRoute] = useState(location.hash || '#/')
  const [menu, setMenu] = useState(false)

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bookmarks') || '[]')
    } catch {
      return []
    }
  })

  const load = async () => {
    setLoading(true)

    try {
      const [newsResponse, breakingResponse, panchangResponse] =
        await Promise.all([
          fetch(`/api/news?category=${category}`).then(response =>
            response.json(),
          ),
          fetch('/api/breaking').then(response => response.json()),
          fetch('/api/panchang').then(response => response.json()),
        ])

      setNews(
        newsResponse.articles?.length
          ? newsResponse.articles
          : fallback,
      )

      setBreaking(
        Array.isArray(breakingResponse) && breakingResponse.length
          ? breakingResponse
          : defaultBreaking,
      )

      setPanchang(panchangResponse)
    } catch {
      setNews(fallback)
      setBreaking(defaultBreaking)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()

    const timer = setInterval(load, 120000)

    return () => clearInterval(timer)
  }, [category])

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(location.hash || '#/')
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  const filtered = useMemo(() => {
    const searchQuery = query.toLowerCase().trim()

    if (!searchQuery) {
      return news
    }

    return news.filter(item =>
      `${item.title || ''} ${item.description || ''}`
        .toLowerCase()
        .includes(searchQuery),
    )
  }, [news, query])

  const openNews = item => {
    location.hash = `#/news/${encodeURIComponent(item.id)}`
    window.scrollTo(0, 0)
  }

  const selectedId = route.startsWith('#/news/')
    ? decodeURIComponent(route.slice(7))
    : ''

  const selected =
    news.find(item => String(item.id) === selectedId) ||
    bookmarks.find(item => String(item.id) === selectedId)

  const header = (
    <Header
      category={category}
      onCategoryChange={setCategory}
      query={query}
      onQueryChange={setQuery}
      dark={dark}
      onThemeToggle={() => setDark(current => !current)}
      menuOpen={menu}
      onMenuToggle={() => setMenu(current => !current)}
    />
  )

  const shell = content => (
    <div className={dark ? 'app dark' : 'app'}>
      {header}
      {content}
      <Footer />
    </div>
  )
  if (route === '#/about') {
    return shell(
      <InfoPage
        title="हमारे बारे में"
        kicker="ABOUT BHARAT SAMACHAR"
      >
        <p>
          भारत समाचार एक स्वतंत्र हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म है।
          हमारा उद्देश्य सत्यापित, उपयोगी और पाठक-केंद्रित समाचार सरल
          भाषा में प्रस्तुत करना है।
        </p>

        <p>
          पोर्टल पर राष्ट्रीय, अंतरराष्ट्रीय, व्यापार, तकनीक, खेल,
          मनोरंजन, स्वास्थ्य, दैनिक पंचांग, राशिफल तथा व्रत-त्योहार
          से जुड़ी सामग्री उपलब्ध है।
        </p>
      </InfoPage>,
    )
  }

  if (route === '#/editorial-policy') {
    return shell(
      <InfoPage
        title="संपादकीय नीति"
        kicker="EDITORIAL STANDARDS"
      >
        <p>
          हम तथ्य-जाँच, स्रोत की स्पष्टता, निष्पक्ष भाषा और
          त्रुटि-सुधार को प्राथमिकता देते हैं। किसी खबर में गलती मिलने
          पर संपर्क पृष्ठ के माध्यम से सूचना भेजी जा सकती है।
        </p>

        <p>
          RSS से प्राप्त खबरों के मूल स्रोत का उल्लेख किया जाता है।
          संपादकीय टीम द्वारा प्रकाशित सामग्री को अलग स्रोत पहचान के
          साथ दिखाया जाता है।
        </p>
      </InfoPage>,
    )
  }

  if (route === '#/privacy') {
    return shell(
      <InfoPage title="गोपनीयता नीति" kicker="PRIVACY">
        <p>
          संपर्क फ़ॉर्म में दी गई जानकारी केवल पाठक के संदेश का उत्तर
          देने और संपादकीय कार्य के लिए उपयोग की जाती है। हम अनावश्यक
          व्यक्तिगत जानकारी नहीं मांगते।
        </p>

        <p>
          बुकमार्क और थीम प्राथमिकताएँ उपयोगकर्ता के ब्राउज़र में
          स्थानीय रूप से सुरक्षित रहती हैं।
        </p>
      </InfoPage>,
    )
  }

  if (route === '#/terms') {
    return shell(
      <InfoPage title="नियम व शर्तें" kicker="TERMS">
        <p>
          वेबसाइट की सामग्री सूचना के उद्देश्य से है। बाहरी स्रोतों
          पर प्रकाशित सामग्री की जिम्मेदारी संबंधित स्रोत की होती है।
          बिना अनुमति मूल संपादकीय सामग्री का व्यावसायिक पुनर्प्रकाशन
          न करें।
        </p>
      </InfoPage>,
    )
  }

  if (route === '#/contact') {
    return shell(<ContactPage />)
  }

  if (route === '#/admin') {
    return shell(<AdminPanel onPublished={load} />)
  }

  if (route === '#/bookmarks') {
    return shell(
      <main className="container page-shell">
        <div className="page-title">
          <span>आपकी सूची</span>
          <h1>बुकमार्क</h1>
        </div>

        {bookmarks.length ? (
          <div className="bookmark-grid">
            {bookmarks.map(item => (
              <button
                type="button"
                className="bookmark-card"
                key={item.id}
                onClick={() => openNews(item)}
              >
                <Visual item={item} />
                <h3>{item.title}</h3>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>अभी कोई खबर सेव नहीं है</h2>
            <a href="#/">होम पर जाएँ</a>
          </div>
        )}
      </main>,
    )
  }

  if (selectedId) {
    return shell(
      <main className="container article-page">
        {selected ? (
          <article className="article-layout">
            <div className="article-main">
              <span className="category-tag">
                {labels[selected.category] || 'खबर'}
              </span>

              <h1>{selected.title}</h1>

              <div className="article-meta">
                {selected.source} • {fmt(selected.pubDate)}
              </div>

              <Visual
                item={selected}
                className="article-visual"
              />

              <p className="article-intro">
                {selected.description}
              </p>

              {selected.link !== '#' && (
                <a
                  className="source-button"
                  href={selected.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  मूल स्रोत पर पूरी खबर पढ़ें →
                </a>
              )}
            </div>

            <aside className="article-aside">
              <button
                type="button"
                className="save"
                onClick={() =>
                  setBookmarks(current =>
                    current.some(item => item.id === selected.id)
                      ? current.filter(
                          item => item.id !== selected.id,
                        )
                      : [selected, ...current],
                  )
                }
              >
                {bookmarks.some(
                  item => item.id === selected.id,
                )
                  ? '★ सेव किया गया'
                  : '☆ बुकमार्क करें'}
              </button>
            </aside>
          </article>
        ) : (
          <div className="not-found">
            <h1>खबर नहीं मिली</h1>
            <a href="#/">होम पर जाएँ</a>
          </div>
        )}
      </main>,
    )
  }

  const hero = filtered[0] || fallback[0]

  const ticker = (
    breaking.length ? breaking : defaultBreaking
  )
    .map(item => ({
      id: item.id,
      title: item.text,
    }))
    .filter(item => item && item.title)

  return shell(
    <>
      <BreakingTicker items={ticker} />
      <main className="container bbc-main">
        {loading && !news.length ? (
          <p>समाचार लोड हो रहे हैं...</p>
        ) : filtered.length ? (
          <>
            <HeroSection
              hero={hero}
              filtered={filtered}
              openNews={openNews}
              fmt={fmt}
              Visual={Visual}
            />

            <NewsGrid
  function AdminPanel({ onPublished }) {
            <PanchangSection data={panchang} />

            <SocialPopular
              news={filtered}
              onOpen={openNews}
            />
          </>
        ) : (
          <div className="empty-state">
            <h2>कोई समाचार नहीं मिला</h2>
            <p>दूसरा search keyword लिखकर देखें।</p>

            <button
              type="button"
              className="primary-btn"
              onClick={() => setQuery('')}
            >
              खोज हटाएँ
            </button>
          </div>
        )}
      </main>
    </>,
  )
}

function PanchangSection({ data }) {
  const [rashiTab, setRashiTab] = useState('daily')
  const panchangData = data || {}

  const basics = [
    ['पक्ष', panchangData.paksha || '—'],
    ['तिथि', panchangData.tithi || '—'],
    ['नक्षत्र', panchangData.nakshatra || '—'],
    ['योग', panchangData.yoga || '—'],
    ['करण', panchangData.karan || '—'],
    ['सूर्योदय', panchangData.sunrise || '—'],
    ['सूर्यास्त', panchangData.sunset || '—'],
    ['चंद्रोदय', panchangData.moonrise || '—'],
    ['चंद्रास्त', panchangData.moonset || '—'],
    ['राहुकाल', panchangData.rahukaal || '—'],
    ['अभिजीत मुहूर्त', panchangData.abhijit || '—'],
    ['ब्रह्म मुहूर्त', panchangData.brahmaMuhurta || '—'],
    ['चौघड़िया', panchangData.choghadiya || '—'],
  ]

  const rashis =
    panchangData.rashifal?.[rashiTab] || []

  const rashiLabels = {
    daily: 'दैनिक',
    monthly: 'मासिक',
    yearly: 'वार्षिक',
  }

  return (
    <section className="panchang-hub">
      <nav
        className="panchang-quick-nav"
        aria-label="पंचांग अनुभाग"
      >
        <a href="#panchang">दैनिक पंचांग</a>
        <a href="#rashifal">राशिफल</a>
        <a href="#vrat-festival">व्रत और त्योहार</a>
      </nav>

      <div
        className="panchang-section"
        id="panchang"
      >
        <div className="panchang-head">
          <div>
            <span>आज का धार्मिक कैलेंडर</span>
            <h2>दैनिक पंचांग</h2>

            <p>
              {panchangData.date ||
                new Date().toLocaleDateString('hi-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}

              {panchangData.location
                ? ` • ${panchangData.location}`
                : ''}
            </p>
          </div>

          <div className="panchang-sun">☀</div>
        </div>

        <div className="panchang-grid">
          {basics.map(([key, value]) => (
            <div key={key}>
              <small>{key}</small>
              <b>{value}</b>
            </div>
          ))}
        </div>

        <div className="panchang-extra">
          <div>
            <small>शुभ समय</small>
            <b>{panchangData.shubhSamay || '—'}</b>
          </div>

          <div>
            <small>अशुभ समय</small>
            <b>{panchangData.ashubhSamay || '—'}</b>
          </div>

          <div>
            <small>दिशाशूल</small>
            <b>{panchangData.dishashool || '—'}</b>
          </div>

          <div>
            <small>चंद्र राशि</small>
            <b>{panchangData.chandraRashi || '—'}</b>
          </div>
        </div>

        <p className="panchang-note">
          पंचांग के समय स्थान के अनुसार बदल सकते हैं। स्थानीय प्रमाणित
          पंचांग से मिलान करें।
        </p>
      </div>

      <section
        className="rashifal-section"
        id="rashifal"
      >
        <div className="section-title-row">
          <div>
            <span>ज्योतिष</span>
            <h2>राशिफल</h2>
          </div>

          <div className="rashi-tabs">
            {Object.entries(rashiLabels).map(
              ([id, label]) => (
                <button
                  type="button"
                  key={id}
                  className={
                    rashiTab === id ? 'active' : ''
                  }
                  onClick={() => setRashiTab(id)}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="rashi-grid">
          {rashis.length ? (
            rashis.map((rashi, index) => (
              <article key={`${rashi.name}-${index}`}>
                <div className="rashi-symbol">
                  {rashi.symbol}
                </div>

                <div>
                  <h3>
                    {rashi.name}{' '}
                    <small>
                      {rashiLabels[rashiTab]}
                    </small>
                  </h3>

                  <p>{rashi.text}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="section-empty">
              राशिफल अपडेट किया जा रहा है।
            </div>
          )}
        </div>
      </section>

      <section
        className="vrat-festival-section"
        id="vrat-festival"
      >
        <div className="section-title-row">
          <div>
            <span>धर्म एवं संस्कृति</span>
            <h2>व्रत और त्योहार</h2>
          </div>
        </div>

        <div className="festival-grid">
          <div className="festival-list">
            <h3>आगामी व्रत</h3>

            {(panchangData.vrats || []).length ? (
              panchangData.vrats.map((item, index) => (
                <article key={index}>
                  <time>{item.date}</time>

                  <div>
                    <b>{item.name}</b>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="section-empty">
                व्रत सूची अपडेट की जा रही है।
              </p>
            )}
          </div>

          <div className="festival-list">
            <h3>प्रमुख त्योहार</h3>

            {(panchangData.festivals || []).length ? (
              panchangData.festivals.map(
                (item, index) => (
                  <article key={index}>
                    <time>{item.date}</time>

                    <div>
                      <b>{item.name}</b>
                      <p>{item.detail}</p>
                    </div>
                  </article>
                ),
              )
            ) : (
              <p className="section-empty">
                त्योहार सूची अपडेट की जा रही है।
              </p>
            )}
          </div>
        </div>
      </section>
    </section>
  )
}

function SocialPopular({ news, onOpen }) {
  const social = [
    {
      name: 'WhatsApp',
      icon: '◉',
      className: 'whatsapp',
      url: 'https://www.whatsapp.com/',
    },
    {
      name: 'Facebook',
      icon: 'f',
      className: 'facebook',
      url: 'https://www.facebook.com/',
    },
    {
      name: 'X',
      icon: '𝕏',
      className: 'x',
      url: 'https://x.com/',
    },
    {
      name: 'YouTube',
      icon: '▶',
      className: 'youtube',
      url: 'https://www.youtube.com/',
    },
    {
      name: 'Instagram',
      icon: '◎',
      className: 'instagram',
      url: 'https://www.instagram.com/',
    },
  ]

  const popular = (
    news?.length ? news : fallback
  ).slice(0, 10)

  return (
    <section className="social-popular">
      <div className="social-follow">
        <h2>सोशल मीडिया पर फ़ॉलो करें</h2>

        <div className="social-links">
          {social.map(item => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              <span
                className={`social-icon ${item.className}`}
              >
                {item.icon}
              </span>

              <b>{item.name}</b>
            </a>
          ))}
        </div>
      </div>

      <div className="popular-block">
        <h2>सबसे अधिक लोकप्रिय</h2>

        <div className="popular-grid">
          {popular.map((item, index) => (
            <button
              type="button"
              key={`${item.id}-${index}`}
              onClick={() => onOpen(item)}
            >
              <span>{index + 1}</span>
              <h3>{item.title}</h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [status, setStatus] = useState('')

  const submit = async event => {
    event.preventDefault()
    setStatus('भेजा जा रहा है...')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      setStatus(result.message || result.error)

      if (response.ok) {
        setForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      }
    } catch {
      setStatus('संदेश भेजने में समस्या आई।')
    }
  }

  return (
    <main className="container page-shell">
      <div className="page-title">
        <span>READER CONNECT</span>
        <h1>Contact Us</h1>

        <p>
          समाचार सुझाव, सुधार, विज्ञापन या संपादकीय सहयोग के लिए हमसे
          संपर्क करें।
        </p>
      </div>

      <div className="contact-layout">
        <section className="contact-card">
          <h2>संपादकीय कार्यालय</h2>

          <p>
            <b>Email:</b> editor@bharatsamachar.in
          </p>

          <p>
            <b>News Desk:</b> news@bharatsamachar.in
          </p>

          <p>
            <b>Advertising:</b> ads@bharatsamachar.in
          </p>

          <p>
            <b>समय:</b> सोमवार–शनिवार, सुबह 10 से शाम 6 बजे
          </p>

          <div className="contact-note">
            किसी खबर में त्रुटि हो तो headline और article link अवश्य
            भेजें।
          </div>
        </section>

        <form
          className="contact-form"
          onSubmit={submit}
        >
          <div className="form-two">
            <Field
              label="नाम *"
              value={form.name}
              required
              onChange={event =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
            />

            <Field
              label="ईमेल *"
              type="email"
              value={form.email}
              required
              onChange={event =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
            />
          </div>

          <div className="form-two">
            <Field
              label="फोन"
              value={form.phone}
              onChange={event =>
                setForm({
                  ...form,
                  phone: event.target.value,
                })
              }
            />

            <Field
              label="विषय *"
              value={form.subject}
              required
              onChange={event =>
                setForm({
                  ...form,
                  subject: event.target.value,
                })
              }
            />
          </div>

          <label className="field">
            <span>संदेश *</span>

            <textarea
              rows="7"
              value={form.message}
              required
              onChange={event =>
                setForm({
                  ...form,
                  message: event.target.value,
                })
              }
            />
          </label>

          <button
            type="submit"
            className="primary-btn"
          >
            संदेश भेजें
          </button>

          {status && (
            <p className="form-status">{status}</p>
          )}
        </form>
      </div>
    </main>
  )
}
<NewsGrid
  items={filtered.slice(5, 13)}
  category={category}
  labels={labels}
  openNews={openNews}
  fmt={fmt}
/>
function AdminPanel({ onPublished }) {
  const [token, setToken] = useState(
    () => sessionStorage.getItem('adminToken') || '',
  )

  const [login, setLogin] = useState({
    email: 'editor@bharatsamachar.in',
    password: '',
  })

  const [data, setData] = useState({
    news: [],
    breaking: [],
    contacts: [],
  })

  const [tab, setTab] = useState('news')
  const [msg, setMsg] = useState('')

  const [article, setArticle] = useState({
    title: '',
    description: '',
    category: 'top',
    source: 'भारत समाचार',
    image: '',
    link: '',
    status: 'published',
  })

  const [breakingText, setBreakingText] = useState('')

  const api = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Request failed')
    }

    return result
  }

  const refresh = async () => {
    try {
      setData(await api('/api/admin/dashboard'))
    } catch (error) {
      setMsg(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      refresh()
    }
  }, [token])

  const doLogin = async event => {
    event.preventDefault()
    setMsg('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      sessionStorage.setItem('adminToken', result.token)
      setToken(result.token)
    } catch (error) {
      setMsg(error.message)
    }
  }

  const publish = async event => {
    event.preventDefault()

    try {
      await api('/api/admin/news', {
        method: 'POST',
        body: JSON.stringify(article),
      })

      setArticle(current => ({
        ...current,
        title: '',
        description: '',
        image: '',
        link: '',
      }))

      setMsg('खबर प्रकाशित हो गई।')
      await refresh()
      onPublished?.()
    } catch (error) {
      setMsg(error.message)
    }
  }

  const deleteNews = async id => {
    const shouldDelete = window.confirm(
      'यह खबर हटाएँ?',
    )

    if (!shouldDelete) {
      return
    }

    try {
      await api(`/api/admin/news/${id}`, {
        method: 'DELETE',
      })

      await refresh()
      onPublished?.()
    } catch (error) {
      setMsg(error.message)
    }
  }

  const addBreaking = async event => {
    event.preventDefault()

    if (!breakingText.trim()) {
      setMsg('Breaking news text लिखें।')
      return
    }

    try {
      await api('/api/admin/breaking', {
        method: 'POST',
        body: JSON.stringify({
          text: breakingText.trim(),
        }),
      })

      setBreakingText('')
      await refresh()
    } catch (error) {
      setMsg(error.message)
    }
  }

  if (!token) {
    return (
      <main className="container admin-login">
        <form onSubmit={doLogin}>
          <span>SECURE EDITORIAL ACCESS</span>
          <h1>Admin Login</h1>

          <Field
            label="ईमेल"
            type="email"
            value={login.email}
            required
            onChange={event =>
              setLogin({
                ...login,
                email: event.target.value,
              })
            }
          />

          <Field
            label="पासवर्ड"
            type="password"
            value={login.password}
            required
            onChange={event =>
              setLogin({
                ...login,
                password: event.target.value,
              })
            }
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Login
          </button>

          {msg && (
            <p className="form-status error">{msg}</p>
          )}

          <small>
            Default login README में दिया गया है। Production में
            environment variables बदलें।
          </small>
        </form>
      </main>
    )
  }

  return (
    <main className="container admin-shell">
      <div className="admin-top">
        <div>
          <span>BHARAT SAMACHAR CMS</span>
          <h1>Editorial Panel</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem('adminToken')
            setToken('')
          }}
        >
          Logout
        </button>
      </div>

      <div className="admin-stats">
        <div>
          <b>{data.news.length}</b>
          <span>Original News</span>
        </div>

        <div>
          <b>
            {data.breaking.filter(item => item.active).length}
          </b>
          <span>Breaking</span>
        </div>

        <div>
          <b>
            {
              data.contacts.filter(
                item => item.status === 'new',
              ).length
            }
          </b>
          <span>New Messages</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          type="button"
          className={tab === 'news' ? 'active' : ''}
          onClick={() => setTab('news')}
        >
          News Desk
        </button>

        <button
          type="button"
          className={
            tab === 'breaking' ? 'active' : ''
          }
          onClick={() => setTab('breaking')}
        >
          Breaking News
        </button>

        <button
          type="button"
          className={
            tab === 'contacts' ? 'active' : ''
          }
          onClick={() => setTab('contacts')}
        >
          Contact Inbox
        </button>
      </div>

      {msg && (
        <p className="admin-message">{msg}</p>
      )}

      {tab === 'news' && (
        <div className="admin-columns">
          <form
            className="editor-form"
            onSubmit={publish}
          >
            <h2>नई खबर प्रकाशित करें</h2>

            <Field
              label="Headline *"
              value={article.title}
              required
              onChange={event =>
                setArticle({
                  ...article,
                  title: event.target.value,
                })
              }
            />

            <label className="field">
              <span>विवरण *</span>

              <textarea
                rows="7"
                value={article.description}
                required
                onChange={event =>
                  setArticle({
                    ...article,
                    description: event.target.value,
                  })
                }
              />
            </label>

            <div className="form-two">
              <label className="field">
                <span>Category</span>

                <select
                  value={article.category}
                  onChange={event =>
                    setArticle({
                      ...article,
                      category: event.target.value,
                    })
                  }
                >
                  {categories.map(([id, label]) => (
                    <option
                      value={id}
                      key={id}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="Source"
                value={article.source}
                onChange={event =>
                  setArticle({
                    ...article,
                    source: event.target.value,
                  })
                }
              />
            </div>

            <Field
              label="Image URL"
              value={article.image}
              onChange={event =>
                setArticle({
                  ...article,
                  image: event.target.value,
                })
              }
            />

            <Field
              label="External Link"
              value={article.link}
              onChange={event =>
                setArticle({
                  ...article,
                  link: event.target.value,
                })
              }
            />

            <button
              type="submit"
              className="primary-btn"
            >
              Publish News
            </button>
          </form>

          <section className="admin-list">
            <h2>Published News</h2>

            {data.news.map(item => (
              <article key={item.id}>
                <div>
                  <span>
                    {labels[item.category] || 'खबर'}
                  </span>

                  <h3>{item.title}</h3>
                  <small>{fmt(item.pubDate)}</small>
                </div>

                <button
                  type="button"
                  onClick={() => deleteNews(item.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </section>
        </div>
      )}

      {tab === 'breaking' && (
        <div className="admin-columns">
          <form
            className="editor-form"
            onSubmit={addBreaking}
          >
            <h2>Breaking Update</h2>

            <label className="field">
              <span>Ticker Text</span>

              <textarea
                rows="4"
                value={breakingText}
                required
                onChange={event =>
                  setBreakingText(event.target.value)
                }
              />
            </label>

            <button
              type="submit"
              className="primary-btn"
            >
              Add Breaking
            </button>
          </form>

          <section className="admin-list">
            <h2>Active Ticker</h2>

            {data.breaking.map(item => (
              <article key={item.id}>
                <h3>{item.text}</h3>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api(
                        `/api/admin/breaking/${item.id}`,
                        {
                          method: 'DELETE',
                        },
                      )

                      await refresh()
                    } catch (error) {
                      setMsg(error.message)
                    }
                  }}
                >
                  Delete
                </button>
              </article>
            ))}
          </section>
        </div>
      )}

      {tab === 'contacts' && (
        <section className="message-list">
          {data.contacts.length ? (
            data.contacts.map(item => (
              <article
                className={
                  item.status === 'new' ? 'new' : ''
                }
                key={item.id}
              >
                <div>
                  <span>{item.subject}</span>
                  <h3>
                    {item.name} — {item.email}
                  </h3>

                  <p>{item.message}</p>

                  <small>
                    {fmt(item.createdAt)}
                    {item.phone && ` • ${item.phone}`}
                  </small>
                </div>

                {item.status === 'new' && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await api(
                          `/api/admin/contact/${item.id}`,
                          {
                            method: 'PUT',
                            body: JSON.stringify({
                              status: 'read',
                            }),
                          },
                        )

                        await refresh()
                      } catch (error) {
                        setMsg(error.message)
                      }
                    }}
                  >
                    Mark Read
                  </button>
                )}
              </article>
            ))
          ) : (
            <p>अभी कोई संदेश नहीं है।</p>
          )}
        </section>
      )}
    </main>
  )
}
