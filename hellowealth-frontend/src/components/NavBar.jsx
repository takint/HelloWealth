import { Link } from 'react-router-dom'
const NavBar = () => {
  const menuItems = [
    { url: '/', label: 'Home', onMenuItemClick: () => {} },
    { url: '/login', label: 'Login', onMenuItemClick: () => {} },
    { url: '/register', label: 'Register', onMenuItemClick: () => {} },
    { url: '/news', label: 'News', onMenuItemClick: () => {} },
    { url: '/contact-us', label: 'Contact us', onMenuItemClick: () => {} },
    { url: '/our-service', label: 'Our service', onMenuItemClick: () => {} },
    {
      url: '/forgot-password',
      label: 'Forgot password',
      onMenuItemClick: () => {},
    },
  ]

  return (
    <nav>
      <ul>
        {menuItems.map((item, idx) => {
          return (
            <li key={idx}>
              <Link to={item.url} onClick={item.onMenuItemClick}>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavBar
