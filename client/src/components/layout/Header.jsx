import { Link } from 'react-router-dom'
import { FiMenu, FiSearch, FiUser } from 'react-icons/fi'
import { useState } from 'react'

import '../../styles/header.css'

function Header({ onMenuClick }) {
  const [search, setSearch] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!search.trim()) return

    console.log('Search:', search)

    // Future:
    // navigate(`/search?q=${encodeURIComponent(search)}`)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">

        {/* Mobile Menu */}

        <button
          className="mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open Menu"
        >
          <FiMenu />
        </button>

        {/* Logo */}

        <Link
          to="/"
          className="logo"
        >
          <span className="logo-red">
            भारत
          </span>

          <span className="logo-black">
            समाचार
          </span>
        </Link>

        {/* Search */}

        <form
          className="header-search"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="समाचार खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="submit"
            aria-label="Search"
          >
            <FiSearch />
          </button>
        </form>

        {/* Right */}

        <div className="header-right">

          <button
            className="login-btn"
            type="button"
          >
            <FiUser />

            <span>
              Login
            </span>

          </button>

        </div>

      </div>
    </header>
  )
}

export default Header
