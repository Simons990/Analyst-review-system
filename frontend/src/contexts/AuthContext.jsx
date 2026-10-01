// import { createContext, useContext, useState } from 'react'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)

//   const login = (userData, token) => {
//     localStorage.setItem('token', token)
//     localStorage.setItem('user', JSON.stringify(userData))
//     setUser(userData)
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     setUser(null)
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   return useContext(AuthContext)
// }

import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  // When the app loads check if a token exists in localStorage
  // If yes fetch the user data to restore the session automatically
  // This keeps the user logged in even after refreshing the page
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then(res => setUser(res.data))
        .catch(() => {
          // Token is expired or invalid — clear storage and show login
          localStorage.removeItem('token')
          localStorage.removeItem('refresh')
        })
        .finally(() => setLoading(false))
    }
  }, [])

  const login = (userData, token, refresh) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refresh', refresh)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    setUser(null)
  }

  // Show a loading screen while checking for existing session
  // Prevents the login page flashing before the user is restored
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
        fontSize: '14px',
        color: '#64748b',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// The context provider and its hook intentionally share this module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}