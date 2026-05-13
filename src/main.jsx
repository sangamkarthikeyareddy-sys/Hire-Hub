import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HireHubAuthProvider } from './context/AuthContext'
import { BookmarkProvider } from './context/BookmarkContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HireHubAuthProvider>
      <BookmarkProvider>
        <App />
      </BookmarkProvider>
    </HireHubAuthProvider>
  </StrictMode>,
)
