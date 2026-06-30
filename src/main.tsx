import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { installAudioUnlock } from './lib/sound'

// Keep audio working on mobile / home-screen PWAs (iOS unlock + foreground resume).
installAudioUnlock()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
