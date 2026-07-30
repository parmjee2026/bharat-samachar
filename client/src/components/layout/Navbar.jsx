import { NavLink } from 'react-router-dom'
import '../../styles/navbar.css'

const navItems = [
  { name: 'होम', path: '/' },
  { name: 'भारत', path: '/india' },
  { name: 'विश्व', path: '/world' },
  { name: 'राजनीति', path: '/politics' },
  { name: 'बिजनेस', path: '/business' },
  { name: 'टेक्नोलॉजी', path: '/technology' },
  { name: 'खेल', path: '/sports' },
  { name: 'मनोरंजन', path: '/entertainment' },
  { name: 'स्वास्थ्य', path: '/health' },
  { name: 'शिक्षा', path: '/education' },
  { name: 'ऑटो', path: '/auto' },
  { name: 'लाइफस्टाइल', path: '/lifestyle' }
]

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
