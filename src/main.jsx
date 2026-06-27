import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'

// Em hospedagem estática sob subcaminho (GitHub Pages) usamos HashRouter,
// que dispensa fallback de servidor para deep-links. Em produção própria, BrowserRouter.
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
