import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode is intentionally not used: its dev-only double mount makes the
// WebGL backgrounds release their context and then try to reuse the same canvas.
createRoot(document.getElementById('root')!).render(<App />)
