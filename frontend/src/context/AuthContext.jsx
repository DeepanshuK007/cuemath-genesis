import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user on mount
    const storedUser = localStorage.getItem('user')
    const isSignedIn = localStorage.getItem('isSignedIn')

    if (storedUser && isSignedIn === 'true') {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isSignedIn', 'true')
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('isSignedIn')
    localStorage.removeItem('tutorId')
    localStorage.removeItem('tutorName')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, isSignedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
