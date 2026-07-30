import React from 'react'

export default function HeroSection({
  hero,
  filtered,
  openNews,
  fmt,
  Visual,
}) {
  return (
    <section className="bbc-top-grid">
      <button
        type="button"
        className="bbc-lead"
        onClick={() => openNews(hero)}
      >
        <div className="visual">
          <Visual item={hero} />
        </div>

        <h1>{hero.title}</h1>
        <p>{hero.description}</p>
        <small>{fmt(hero.pubDate)}</small>
      </button>

      <div className="bbc-mini-grid">
        {filtered.slice(1, 5).map(item => (
          <button
            key={item.id}
            type="button"
            className="bbc-mini-card"
            onClick={() => openNews(item)}
          >
            <div className="visual">
              <Visual item={item} />
            </div>

            <h2>{item.title}</h2>
            <small>{fmt(item.pubDate)}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
