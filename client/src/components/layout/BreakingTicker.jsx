function BreakingTicker({
  items = [],
  label = 'ब्रेकिंग',
  isLoading = false,
  error = '',
}) {
  const validItems = Array.isArray(items)
    ? items
        .map((item, index) => ({
          id: item?.id || item?._id || `breaking-${index}`,
          title: item?.title || item?.text || '',
          url: item?.url || item?.link || '',
          slug: item?.slug || '',
        }))
        .filter((item) => item.title.trim())
    : []

  const getItemUrl = (item) => {
    if (item.url) {
      return item.url
    }

    if (item.slug) {
      return `/news/${item.slug}`
    }

    return ''
  }

  if (isLoading) {
    return (
      <section
        className="breaking-ticker breaking-ticker-loading"
        aria-label="ब्रेकिंग न्यूज़ लोड हो रही है"
        aria-live="polite"
      >
        <div className="container breaking-ticker-inner">
          <div className="breaking-ticker-label">
            <span
              className="breaking-live-dot"
              aria-hidden="true"
            />
            {label}
          </div>

          <div className="breaking-ticker-window">
            <div className="breaking-ticker-loading-text">
              ब्रेकिंग न्यूज़ लोड हो रही है...
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="breaking-ticker breaking-ticker-error"
        aria-label="ब्रेकिंग न्यूज़"
        aria-live="polite"
      >
        <div className="container breaking-ticker-inner">
          <div className="breaking-ticker-label">
            <span
              className="breaking-live-dot"
              aria-hidden="true"
            />
            {label}
          </div>

          <div className="breaking-ticker-window">
            <div className="breaking-ticker-error-text">
              ब्रेकिंग न्यूज़ अभी उपलब्ध नहीं है।
            </div>
          </div>
        </div>
      </section>
    )
  }

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
      aria-live="polite"
    >
      <div className="container breaking-ticker-inner">
        <div className="breaking-ticker-label">
          <span
            className="breaking-live-dot"
            aria-hidden="true"
          />
          {label}
        </div>

        <div className="breaking-ticker-window">
          <div className="breaking-ticker-track">
            {tickerItems.map((item, index) => {
              const itemUrl = getItemUrl(item)

              return itemUrl ? (
                <a
                  className="breaking-ticker-item"
                  href={itemUrl}
                  key={`${item.id}-${index}`}
                  target={item.url ? '_blank' : undefined}
                  rel={item.url ? 'noopener noreferrer' : undefined}
                >
                  <span
                    className="breaking-ticker-separator"
                    aria-hidden="true"
                  >
                    ●
                  </span>

                  <span className="breaking-ticker-title">
                    {item.title}
                  </span>
                </a>
              ) : (
                <span
                  className="breaking-ticker-item"
                  key={`${item.id}-${index}`}
                >
                  <span
                    className="breaking-ticker-separator"
                    aria-hidden="true"
                  >
                    ●
                  </span>

                  <span className="breaking-ticker-title">
                    {item.title}
                  </span>
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BreakingTicker
