import React, { Component } from 'react'
import { createBrowserHistory as history } from 'history'
import { Router } from 'react-router-dom'
import { PageLayout, PageLeftCol, PageRightCol } from '../styles/global.styles'
import NavBar from '../components/NavBar'
import LoadingSpinner from '../components/LoadingSpinner'
import SocialMenu from '../components/SocialMenu'
import BasedRoutes from '../router'

export default class App extends Component {
  render() {
    return (
      <Router history={history()}>
        <LoadingSpinner isShow={false} />
        <PageLayout>
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
        </PageLayout>
      </Router>
    )
  }
}
