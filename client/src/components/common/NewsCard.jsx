import React from "react";
import Visual from "./Visual";

export default function NewsCard({
  item,
  openNews,
  fmt,
  label = "खबर",
}) {
  if (!item) return null;

  return (
    <button
      type="button"
      className="bbc-news-card"
      onClick={() => openNews(item)}
    >
      <Visual item={item} />

      <span className="bbc-news-card-label">
        {label}
      </span>

      <h3>{item.title}</h3>

      {item.description && (
        <p>{item.description}</p>
      )}

      <small>
        {item.source || "भारत समाचार"}
        {item.pubDate ? ` • ${fmt(item.pubDate)}` : ""}
      </small>
    </button>
  );
}
