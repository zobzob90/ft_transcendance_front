import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './config/i18n' // ⚠️ Initialiser i18n AVANT le rendu de l'app

ReactDOM.createRoot(document.getElementById('root')).render
(
  <StrictMode>
    <App />
  </StrictMode>,
)
