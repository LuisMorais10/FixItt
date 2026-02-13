import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import "../Styles/auth.css"

export default function ContaVerificada() {
  const navigate = useNavigate()

  return (
    <div className="auth-container">
      <div className="auth-card success-card">
        
        <CheckCircle size={80} color="#2563eb" strokeWidth={1.5} />

        <h1>Conta verificada com sucesso</h1>

        <p>Agora você já pode acessar sua conta.</p>

        <button onClick={() => navigate("/entrar")}>
          Entrar
        </button>

      </div>
    </div>
  )
}
