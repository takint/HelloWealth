import React, { Component } from 'react'
import { createBrowserHistory as history } from 'history'
import { Router } from 'react-router-dom'
import { PageLayout } from '../styles/global.styles'
import NavBar from '../components/NavBar'
import BasedRoutes from '../router'

export default class App extends Component {
  render() {
    return (
      <PageLayout>
        <Router history={history()}>
          <NavBar />
          <BasedRoutes />
        </Router>
      </PageLayout>
    )
  }
}
