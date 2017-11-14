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

window.Tether = require('tether')
window.jQuery = require('jquery')

require('ilevus/css/html5-boilerplate/main.css')

require('jquery-maskmoney/dist/jquery.maskMoney.js')
require('daterangepicker/daterangepicker.js')
require('blueimp-file-upload/js/jquery.iframe-transport.js')
require('blueimp-file-upload')
// require("ilevus/jsx/AppSetup.jsx");
require('bootstrap/css/bootstrap.min.css')
require('bootstrap/js/bootstrap.min.js')

require('ilevus/sass/anvil.scss')

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