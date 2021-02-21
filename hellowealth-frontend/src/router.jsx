import { Component, useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { UserContext } from './services/context'
import ContactUsPage from './pages/ContactUs'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import OurServicePage from './pages/OurService'
import ForgotPasswordPage from './pages/ForgotPassword'
import NewsPage from './pages/News'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/Dashboard'

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const currentUser = useContext(UserContext)

  return (
    <Route
      {...rest}
      render={(props) =>
        !currentUser.isAuthorized ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  )
}

export class PrivateRoutes extends Component {
  render() {
    return (
      <Switch>
        <PrivateRoute path='/dashboard' component={DashboardPage} />
      </Switch>
    )
  }
}

export default class BasedRoutes extends Component {
  render() {
    return (
      <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/register' component={RegisterPage} />
        <Route path='/our-service' component={OurServicePage} />
        <Route path='/contact-us' component={ContactUsPage} />
        <Route path='/forgot-password' component={ForgotPasswordPage} />
        <Route path='/news' component={NewsPage} />
        <Route path='/' component={LandingPage} />
        {/* Private router go here */}
      </Switch>
    )
  }
}
