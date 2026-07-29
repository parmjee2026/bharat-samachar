import React from 'react'

function BreakingTicker({
  items = [],
  label = 'ब्रेकिंग',
}) {
  const validItems = items
    .map(item => ({
      id: item?.id,
      title: item?.title || item?.text,
    }))
    .filter(item => item.title)

  if (!validItems.length) {
    return null
  }

  const tickerItems =
    validItems.length === 1
      ? [...validItems, ...validItems, ...validItems]
      : [...validItems, ...validItems]

  return (
    <section
      className="breaking-ticker"
      aria-label="ब्रेकिंग न्यूज़"
    >
      <div className="container breaking-ticker-inner">
        <div className="breaking-ticker-label">
          <span className="breaking-live-dot" />
          {label}
        </div>

        <div className="breaking-ticker-window">
          <div className="breaking-ticker-track">
            {tickerItems.map((item, index) => (
              <span
                className="breaking-ticker-item"
                key={`${item.id || 'breaking'}-${index}`}
              >
                <span aria-hidden="true">●</span>
                {item.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BreakingTicker
