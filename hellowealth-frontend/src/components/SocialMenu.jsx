const SocialMenu = () => {
  const menuItems = [
    {
      url: 'https://facebook.com',
      label: 'static/fb.png',
      onMenuItemClick: () => {},
    },
    {
      url: 'https://instagram.com',
      label: 'static/inst.png',
      onMenuItemClick: () => {},
    },
    {
      url: 'https://twitter.com',
      label: 'static/twt.png',
      onMenuItemClick: () => {},
    },
  ]

  return (
    <nav>
      <ul className='flex flex-row justify-center'>
        {menuItems.map((item, idx) => {
          return (
            <li key={idx}>
              <a
                href={item.url}
                target='_blank'
                rel='noreferrer'
                onClick={item.onMenuItemClick}
              >
                <img alt={item.label} width='48px' src={item.label} />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default SocialMenu
