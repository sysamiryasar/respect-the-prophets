import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { setArtMode } from './lib/art'

// Applied before the first render so the opening frame is already themed.
const stored = localStorage.getItem('rtp:theme')
const theme =
  stored === 'dark' || stored === 'light'
    ? stored
    : matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
document.documentElement.dataset.theme = theme
setArtMode(theme)

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root was not found')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
