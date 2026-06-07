import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initIAP } from '@/lib/iapService'

initIAP();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
