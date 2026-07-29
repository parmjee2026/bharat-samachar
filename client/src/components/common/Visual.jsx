import React from "react";

const FALLBACK =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80&auto=format&fit=crop";

export default function Visual({
  item,
  className = "",
  alt,
}) {
  const image =
    item?.image ||
    item?.imageUrl ||
    item?.thumbnail ||
    item?.enclosure?.link ||
    FALLBACK;

  return (
    <img
      className={className}
      src={image}
      alt={alt || item?.title || "News"}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = FALLBACK;
      }}
    />
  );
}
