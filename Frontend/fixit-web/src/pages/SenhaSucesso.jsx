import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"

export default function SenhaSucesso() {
  const navigate = useNavigate()

  return (
    <div className="auth-container">
      <div className="auth-card success-card">

        <CheckCircle size={80} color="#2563eb" strokeWidth={1.5} />

        <h1>Senha atualizada com sucesso!</h1>

        <p>Agora você já pode acessar sua conta normalmente.</p>

        <button onClick={() => navigate("/entrar")}>
          Ir para login
        </button>

      </div>
    </div>
  )
}