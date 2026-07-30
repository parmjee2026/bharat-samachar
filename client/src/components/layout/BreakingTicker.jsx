import React from "react";

function BreakingTicker({
  items = [],
  label = "ब्रेकिंग न्यूज़",
}) {
  const validItems = items
    .map((item, index) => ({
      id: item?.id || `breaking-${index}`,
      title: item?.title || item?.text || "",
    }))
    .filter(item => item.title.trim());

  if (!validItems.length) {
    return null;
  }

  const tickerItems =
    validItems.length === 1
      ? [...validItems, ...validItems, ...validItems, ...validItems]
      : [...validItems, ...validItems];

  return (
    <section
      className="breaking-ticker"
      aria-label="ब्रेकिंग न्यूज़ अपडेट"
    >
      <div className="container breaking-ticker-inner">
        <div className="breaking-ticker-label">
          <span
            className="breaking-live-dot"
            aria-hidden="true"
          />

          <span>{label}</span>
        </div>

        <div className="breaking-ticker-window">
          <div className="breaking-ticker-track">
            {tickerItems.map((item, index) => (
              <span
                className="breaking-ticker-item"
                key={`${item.id}-${index}`}
              >
                <span
                  className="breaking-item-dot"
                  aria-hidden="true"
                />

                <span className="breaking-item-text">
                  {item.title}
                </span>
              </span>
            ))}
          </div>
        </div>

        <span className="breaking-update-status">
          LIVE
        </span>
      </div>
    </section>
  );
}

export default BreakingTicker;
