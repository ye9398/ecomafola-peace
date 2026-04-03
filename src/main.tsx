import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CartProvider } from './context/CartContext'
import './index.css'
import App from './App'
import { reportWebVitals, sendToAnalytics } from './lib/analytics'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <HelmetProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
)

// 注册性能监控
reportWebVitals(sendToAnalytics);
