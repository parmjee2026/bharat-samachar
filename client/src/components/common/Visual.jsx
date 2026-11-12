import React, { useState } from "react";
import "./visual.css";

export default function Visual({ item, className = "", alt }) {
  const [failedImage, setFailedImage] = useState(null);
  const image =
    item?.image || item?.imageUrl || item?.thumbnail || item?.enclosure?.link;

  if (!image || image === failedImage) {
    return <div className={`news-image-placeholder ${className}`} aria-hidden="true" />;
  }

  return (
    <img
      className={className}
      src={image}
      alt={alt || item?.title || "News"}
      loading="lazy"
      onError={() => setFailedImage(image)}
    />
  );
}
