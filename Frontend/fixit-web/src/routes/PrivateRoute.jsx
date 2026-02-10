import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // Aguarda carregar o estado de autenticação
  if (loading) {
    return null // ou um spinner
  }

  // Não autenticado → login
  if (!user) {
    return <Navigate to="/entrar" replace />
  }

  // Autenticado → libera a rota
  return children
}

export default PrivateRoute
