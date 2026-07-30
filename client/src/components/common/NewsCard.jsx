import React from "react";
import NewsCard from "../common/NewsCard";

export default function NewsGrid({
  items = [],
  category = "top",
  labels = {},
  openNews,
  fmt,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <section className="bbc-section">
      <h2 className="bbc-section-title">आज की प्रमुख खबरें</h2>

      <div className="bbc-news-grid">
        {items.map((item, index) => (
          <NewsCard
            key={item?.id || item?.link || item?.title || index}
            item={item}
            openNews={openNews}
            fmt={fmt}
            label={
              labels[item?.category || category] ||
              labels[category] ||
              "खबर"
            }
          />
        ))}
      </div>
    </section>
  );
}
