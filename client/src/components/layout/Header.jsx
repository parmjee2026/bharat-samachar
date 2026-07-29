import React from 'react';

const categories = [
  { id: 'top', label: 'होम' },
  { id: 'nation', label: 'राष्ट्रीय' },
  { id: 'world', label: 'दुनिया' },
  { id: 'business', label: 'व्यापार' },
  { id: 'technology', label: 'टेक्नोलॉजी' },
  { id: 'sports', label: 'खेल' },
  { id: 'entertainment', label: 'मनोरंजन' },
  { id: 'health', label: 'स्वास्थ्य' },
];

function Header({
  category = 'top',
  onCategoryChange,
  query = '',
  onQueryChange,
  dark = false,
  onThemeToggle,
  menuOpen = false,
  onMenuToggle,
}) {
  const changeCategory = (categoryId) => {
    onCategoryChange?.(categoryId);

    if (window.location.hash !== '#/') {
      window.location.hash = '#/';
    }

    if (menuOpen) {
      onMenuToggle?.();
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="container header-top-inner">
          <span>भारत की खबर, भारत की भाषा में</span>

          <div className="header-top-links">
            <a href="#/about">हमारे बारे में</a>
            <a href="#/contact">संपर्क</a>
            <a href="#/admin">Editorial Panel</a>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-main-inner">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={onMenuToggle}
            aria-label={menuOpen ? 'मेन्यू बंद करें' : 'मेन्यू खोलें'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <a
            href="#/"
            className="site-logo"
            aria-label="भारत समाचार होम पेज"
            onClick={() => changeCategory('top')}
          >
            <span className="site-logo-mark">भा</span>

            <span className="site-logo-text">
              <strong>भारत समाचार</strong>
              <small>खबर जो मायने रखे</small>
            </span>
          </a>

          <label className="header-search">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>

            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange?.(event.target.value)}
              placeholder="समाचार खोजें..."
              aria-label="समाचार खोजें"
            />

            {query && (
              <button
                type="button"
                className="clear-search"
                onClick={() => onQueryChange?.('')}
                aria-label="खोज हटाएँ"
              >
                ×
              </button>
            )}
          </label>

          <div className="header-actions">
            <a
              href="#/bookmarks"
              className="header-action-button"
              aria-label="सेव की गई खबरें"
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
          {categories.map((item) => (
            <button
              type="button"
              key={item.id}
              className={category === item.id ? 'active' : ''}
              onClick={() => changeCategory(item.id)}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/bookmarks';

              if (menuOpen) {
                onMenuToggle?.();
              }
            }}
          >
            बुकमार्क
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
