import { useContext } from 'react'
import { UserContext } from '../services/context'
import { createBrowserHistory as history } from 'history'
import { Router } from 'react-router-dom'
import { PageLayout, PageLeftCol, PageRightCol } from '../styles/global.styles'
import NavBar from '../components/NavBar'
import SocialMenu from '../components/SocialMenu'
import BasedRoutes, { PrivateRoutes } from '../router'

export const App = () => {
  const currentUser = useContext(UserContext)
  console.log(currentUser)
  return (
    <Router history={history()}>
      <PageLayout>
        {!currentUser.isAuthorized ? (
          <PrivateRoutes />
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
  )
}

export default App
