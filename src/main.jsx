import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Cinix from './app.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Cinix />
  </StrictMode>,
)
