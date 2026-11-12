import React from 'react'
import './project-promotion.css'

const promotion = {
  title: 'भारत समाचार',
  description: 'हिंदी में ताज़ा खबरें, दैनिक पंचांग और राशिफल एक जगह।',
  href: '#/about',
  linkLabel: 'प्रोजेक्ट के बारे में',
}

export default function ProjectPromotion() {
  return (
    <aside className="project-promotion" aria-labelledby="project-promotion-title">
      <div>
        <span className="project-promotion-label">प्रचार</span>
        <h2 id="project-promotion-title">{promotion.title}</h2>
        <p>{promotion.description}</p>
      </div>
      <a href={promotion.href}>{promotion.linkLabel}</a>
    </aside>
  )
}
