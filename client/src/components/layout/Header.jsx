import React from 'react'
import '../../styles.css'

const navItems = [
  ['top', 'होम'],
  ['nation', 'राष्ट्रीय'],
  ['world', 'दुनिया'],
  ['business', 'व्यापार'],
  ['technology', 'टेक्नोलॉजी'],
  ['sports', 'खेल'],
  ['entertainment', 'मनोरंजन'],
  ['health', 'स्वास्थ्य'],
]

export default function Header({
  category = 'top',
  onCategoryChange,
  query = '',
  onQueryChange,
  dark = false,
  onThemeToggle,
  menuOpen = false,
  onMenuToggle,
}) {
  const selectCategory = id => {
    onCategoryChange?.(id)

    if (menuOpen) {
      onMenuToggle?.()
    }

    window.location.hash = '#/'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="site-header">
      <div className="header-main">
        <div className="container header-main-inner">
          <button
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? 'मेन्यू बंद करें' : 'मेन्यू खोलें'}
            aria-expanded={menuOpen}
            onClick={onMenuToggle}
          >
            {menuOpen ? (
              '✕'
            ) : (
              <>
                <span />
                <span />
                <span />
              </>
            )}
          </button>

          <a
            href="#/"
            className="site-logo"
            aria-label="भारत समाचार होम"
            onClick={() => onCategoryChange?.('top')}
          >
            <span className="site-logo-mark">BS</span>

            <span className="site-logo-text">
              <strong>भारत समाचार</strong>
              <small>खबर जो मायने रखे</small>
            </span>
          </a>

          <div className="header-search">
            <span className="search-icon" aria-hidden="true">⌕</span>

            <input
              type="search"
              value={query}
              placeholder="समाचार खोजें..."
              aria-label="समाचार खोजें"
              onChange={event => onQueryChange?.(event.target.value)}
            />

            {query && (
              <button
                type="button"
                className="clear-search"
                aria-label="खोज हटाएँ"
                onClick={() => onQueryChange?.('')}
              >
                ×
              </button>
            )}
          </div>

          <div className="header-actions">
            <a
              href="#/bookmarks"
              className="header-action-button"
              aria-label="बुकमार्क"
              title="बुकमार्क"
            >
              ☆
            </a>

            <button
              type="button"
              className="header-action-button"
              onClick={onThemeToggle}
              aria-label={dark ? 'लाइट मोड चालू करें' : 'डार्क मोड चालू करें'}
              title={dark ? 'लाइट मोड' : 'डार्क मोड'}
            >
              {dark ? '☀' : '☾'}
            </button>
          </div>
        </div>
      </div>

      <nav className={`category-navigation ${menuOpen ? 'open' : ''}`}>
        <div className="container category-navigation-inner">
          {navItems.map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={category === id ? 'active' : ''}
              onClick={() => selectCategory(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}
