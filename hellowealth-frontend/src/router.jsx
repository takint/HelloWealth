import { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ContactUsPage from './pages/ContactUs'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import OurServicePage from './pages/OurService'
import ForgotPasswordPage from './pages/ForgotPassword'
import NewsPage from './pages/News'
import LandingPage from './pages/LandingPage'
import PortfolioPage from './pages/Portfolio'
import DashboardPage from './pages/Dashboard'
import HelpPage from './pages/Help'

export const PrivateRoute = ({
  component: Component,
  isAuthorized,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthorized ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  )
}

export class PrivateRoutes extends Component {
  render() {
    const { isAuthorized } = this.props
    return (
      <Switch>
        <PrivateRoute
          isAuthorized={isAuthorized}
          path='/dashboard'
          component={DashboardPage}
        />
        <PrivateRoute
          isAuthorized={isAuthorized}
          path='/portfolio'
          component={PortfolioPage}
        />
        <Route path='/help' component={HelpPage} />
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
        <Route path='/dashboard'>
          <Redirect to='/login' />
        </Route>
        <Route path='/' component={LandingPage} exact={true} />
      </Switch>
    )
  }
}
