import 'babel-polyfill'
import React from "react"
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './js/app'
import './index.css'
import registerServiceWorker from './js/utils/registerServiceWorker'

ReactDOM.render (
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
)

registerServiceWorker()