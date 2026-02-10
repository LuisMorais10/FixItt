import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const access = localStorage.getItem("access")
    const email = localStorage.getItem("user_email")

    if (access && email) {
      setUser({ email })
    }

    setLoading(false)
  }, [])

  const login = ({ access, refresh, email }) => {
    localStorage.setItem("access", access)
    localStorage.setItem("refresh", refresh)
    localStorage.setItem("user_email", email)

    setUser({ email })
  }

  const logout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user_email")

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }

  return context
}
