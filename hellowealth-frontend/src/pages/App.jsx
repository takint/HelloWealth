import { Component } from 'react'
import { createBrowserHistory as history } from 'history'
import { BrowserRouter as Router } from 'react-router-dom'
import {
  GlobalStyle,
  PageLayout,
  PageLeftCol,
  PageRightCol,
} from '../styles/global.styles'
import NavBar from '../components/NavBar'
import SocialMenu from '../components/SocialMenu'
import BasedRoutes, { PrivateRoutes } from '../router'
import { checkAccess, getUser } from '../services/api'
import { initialUserContext, UserContext } from '../services/context'
import { getCookie, JWT_COOKIE } from '../services/cookies'
import { isNullOrEmpty } from '../services/helper'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userContext: initialUserContext,
    }
  }

  static defaultProps = {
    token: getCookie(JWT_COOKIE),
  }

  setUserContext = (newContext) => {
    this.setState((prevState) => ({
      ...prevState,
      userContext: newContext,
    }))
  }

  async componentDidMount() {
    const { token } = this.props
    let currentUser = { ...initialUserContext }

    if (!isNullOrEmpty(token)) {
      const [authResponse, userResponse] = await Promise.all([
        checkAccess(token),
        getUser(token),
      ])

      if (authResponse.ok && authResponse.statusCode === 200) {
        currentUser.isAuthorized = true
        currentUser.token = token
        currentUser = {
          ...currentUser,
          userProfile: {
            email: userResponse.email,
            first_name: userResponse.first_name,
            last_name: userResponse.last_name,
            userId: userResponse.pk,
            username: userResponse.username,
          },
        }
      }
    }

    this.setState({
      userContext: {
        ...currentUser,
        setContext: this.setUserContext,
      },
    })

    if (currentUser.isAuthorized) {
      history().push('/dashboard')
    }
  }

  render() {
    const { isAuthorized } = this.state.userContext

    return (
      <UserContext.Provider value={this.state.userContext}>
        <Router history={history()}>
          <GlobalStyle isAuthPage={isAuthorized} />
          <PageLayout>
            {isAuthorized ? (
              <PrivateRoutes isAuthorized={isAuthorized} />
            ) : (
              <>
                <PageLeftCol>
                  <img
                    className='w-3/4 p-4'
                    alt='Hello Wealth'
                    src='static/logo.png'
                  />
                </PageLeftCol>
                <PageRightCol>
                  <NavBar />
                  <BasedRoutes />
                  <SocialMenu />
                </PageRightCol>
              </>
            )}
          </PageLayout>
        </Router>
      </UserContext.Provider>
    )
  }
}

export default App
