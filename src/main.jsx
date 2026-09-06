import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

import { UserProvider } from './contexts/UserProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <UserProvider>
      <App />
    </UserProvider>,
)