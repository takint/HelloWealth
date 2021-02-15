import { GlobalStyle } from './styles/global.styles'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './pages/App'

ReactDOM.render(
  <React.StrictMode>
    <App />
    <GlobalStyle />
  </React.StrictMode>,
  document.getElementById('root')
)
