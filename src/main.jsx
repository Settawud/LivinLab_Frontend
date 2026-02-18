import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ValueProvider } from './context/valueProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<ValueProvider >
      <App />
      </ValueProvider>
  </StrictMode>,
)
