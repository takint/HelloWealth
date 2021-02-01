import { Link } from 'react-router-dom'
const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/contact-us'>Contact us</Link>
        </li>
        <li>
          <Link to='/our-service'>Our service</Link>
        </li>
        <li>
          <Link to='/forgot-password'>Forgot password</Link>
        </li>
        <li>
          <Link to='/news'>News</Link>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
