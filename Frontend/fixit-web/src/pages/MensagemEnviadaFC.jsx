import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import "../Styles/auth.css"

export default function MensagemEnviadafc() {

  const navigate = useNavigate()

  return (
    <div className="auth-container">
      <div className="auth-card success-card">

        <CheckCircle size={80} color="#2563eb" strokeWidth={1.5} />

        <h1>Mensagem enviada com sucesso</h1>

        <p>
          Fique ligado no seu email. 
          Te responderemos em instantes!
        </p>

        <button onClick={() => navigate("/meus-pedidos")}>
          Meus pedidos
        </button>

      </div>
    </div>
  )
}