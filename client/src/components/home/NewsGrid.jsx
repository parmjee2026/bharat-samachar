import React from 'react'

export default function NewsGrid({
  items = [],
  category,
  labels = {},
  openNews,
  fmt,
  Visual,
}) {
  if (!items.length) {
    return null
  }

  return (
    <section className="news-grid-section">
      <div className="news-grid-heading">
        <div>
          <span className="section-kicker">LATEST STORIES</span>
          <h2>आज की प्रमुख खबरें</h2>
        </div>

        <a href="#top" className="view-all-link">
          सभी खबरें देखें →
        </a>
      </div>

      <div className="news-grid">
        {items.map((item, index) => {
          const itemCategory = item.category || category
          const categoryLabel = labels[itemCategory] || 'खबर'

          return (
            <article
              className={`news-card ${
                index === 0 ? 'news-card-featured' : ''
              }`}
              key={item.id || `${item.title}-${index}`}
            >
              <button
                type="button"
                className="news-card-button"
                onClick={() => openNews(item)}
                aria-label={`${item.title} पढ़ें`}
              >
                <div className="news-card-visual">
                  <Visual item={item} />

                  <span className="news-category-badge">
                    {categoryLabel}
                  </span>
                </div>

                <div className="news-card-content">
                  <h3>{item.title}</h3>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  <div className="news-card-footer">
                    <small>
                      <span>{item.source || 'भारत समाचार'}</span>

                      {item.pubDate && (
                        <>
                          <i aria-hidden="true">•</i>
                          <time dateTime={item.pubDate}>
                            {fmt(item.pubDate)}
                          </time>
                        </>
                      )}
                    </small>

                    <span className="news-read-more">
                      पढ़ें <b>→</b>
                    </span>
                  </div>
                </div>
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
