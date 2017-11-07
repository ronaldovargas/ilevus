// https://github.com/diegohaz/arc/wiki/Example-app
import 'react-hot-loader/patch'
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { browserHistory } from 'react-router'

import configureStore from 'store/configure'
import api from 'services/api'
import App from 'components/App'

const store = configureStore({}, browserHistory)

require('bootstrap/scss/bootstrap.scss')
require('ilevus/css/html5-boilerplate/main.css')
require('ilevus/sass/anvil.scss')

window.jQuery = require('jquery')
require('jquery-maskmoney/dist/jquery.maskMoney.js')
require('daterangepicker/daterangepicker.js')
require('blueimp-file-upload/js/jquery.iframe-transport.js')
require('blueimp-file-upload')
window.Tether = require('tether')
require('bootstrap/dist/js/bootstrap.js')
// require("ilevus/jsx/AppSetup.jsx");

const renderApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

const root = document.getElementById('app')
render(renderApp(), root)

if (module.hot) {
  module.hot.accept('components/App', () => {
    require('components/App')
    render(renderApp(), root)
  })
}



// import 'react-hot-loader/patch'
// import 'babel-polyfill'
// import React from 'react'
// import { render } from 'react-dom'
// import { Provider } from 'react-redux'
// import { AppContainer } from 'react-hot-loader'
// import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
// import { syncHistoryWithStore } from 'react-router-redux'
// import { useScroll } from 'react-router-scroll'
// import configureStore from 'store/configure'

// import { Routes } from './routes'

// const history = syncHistoryWithStore(browserHistory, store)
// const root = document.getElementById('app')


//   <Router history={history} render={applyRouterMiddleware(useScroll())} />