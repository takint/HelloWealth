import { Link } from 'react-router-dom'
import { HomeMenu } from '../styles/global.styles'

const NavBar = () => {
  const menuItems = [
    { url: '/', label: 'Home', onMenuItemClick: () => {} },
    { url: '/login', label: 'Log In', onMenuItemClick: () => {} },
    { url: '/register', label: 'Register', onMenuItemClick: () => {} },
    { url: '/news', label: 'News', onMenuItemClick: () => {} },
    { url: '/our-service', label: 'Our service', onMenuItemClick: () => {} },
  ]

  return (
    <nav>
      <HomeMenu>
        {menuItems.map((item, idx) => {
          return (
            <li key={idx}>
              {item.url === '/news' ? (
                <a href='/news'>{item.label}</a>
              ) : (
                <Link to={item.url} onClick={item.onMenuItemClick}>
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </HomeMenu>
    </nav>
  )
}

export default NavBar
