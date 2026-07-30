import React from 'react'

export default function NewsGrid({
  items = [],
  category,
  labels,
  openNews,
  fmt,
  Visual,
}) {
  if (!items.length) {
    return null
  }

  return (
    <section className="bbc-section">
      <h2>आज की प्रमुख खबरें</h2>

      <div className="bbc-news-grid">
        {items.map(item => (
          <button
            type="button"
            className="bbc-news-card"
            key={item.id}
            onClick={() => openNews(item)}
          >
            <div className="bbc-news-card-visual">
              <Visual item={item} />
            </div>

            <span>
              {labels[item.category || category] || 'खबर'}
            </span>

            <h3>{item.title}</h3>
            <p>{item.description}</p>

            <small>
              {item.source} • {fmt(item.pubDate)}
            </small>
          </button>
        ))}
      </div>
    </section>
  )
}
