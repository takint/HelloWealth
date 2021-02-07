import { Link } from 'react-router-dom'

const SocialMenu = () => {
  const menuItems = [
    { url: '#', label: 'static/fb.png', onMenuItemClick: () => {} },
    { url: '#', label: 'static/inst.png', onMenuItemClick: () => {} },
    { url: '#', label: 'static/twt.png', onMenuItemClick: () => {} },
  ]

  return (
    <nav>
      <ul className='flex flex-row justify-center'>
        {menuItems.map((item, idx) => {
          return (
            <li key={idx}>
              <Link to={item.url} onClick={item.onMenuItemClick}>
                <img alt={item.label} width='48px' src={item.label} />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default SocialMenu
