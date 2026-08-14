import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './i18n/config'  // ← THIS MUST BE HERE, before App renders
import './index.css'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="595840578738-3mp41437rm01n8u295etee01raofa9qn.apps.googleusercontent.com">
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)