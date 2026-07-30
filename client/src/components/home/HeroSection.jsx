import React from "react";

export default function HeroSection({
  hero,
  filtered = [],
  openNews,
  fmt,
  Visual,
}) {
  if (!hero) return null;

  return (
    <section className="bbc-top-grid">
      <button
        type="button"
        className="bbc-lead"
        onClick={() => openNews(hero)}
      >
        <Visual item={hero} />

        <h1>{hero.title}</h1>

        {hero.description && <p>{hero.description}</p>}

        {hero.pubDate && <small>{fmt(hero.pubDate)}</small>}
      </button>

      <div className="bbc-mini-grid">
        {filtered.slice(1, 5).map((item, index) => (
          <button
            key={item?.id || item?.link || item?.title || index}
            type="button"
            className="bbc-mini-card"
            onClick={() => openNews(item)}
          >
            <Visual item={item} />

            <h2>{item.title}</h2>

            {item.pubDate && <small>{fmt(item.pubDate)}</small>}
          </button>
        ))}
      </div>
    </section>
  );
}
