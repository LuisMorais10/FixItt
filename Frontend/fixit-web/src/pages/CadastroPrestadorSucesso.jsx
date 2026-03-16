import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import "../Styles/auth.css"

export default function CadastroPrestadorSucesso() {
  const navigate = useNavigate()

  return (
    <div className="auth-container">
      <div className="auth-card success-card">

        <CheckCircle size={80} color="#2563eb" strokeWidth={1.5} />

        <h1>Cadastro realizado com sucesso!</h1>

        <p>Recebemos seus dados. Nossa equipe entrará em contato em breve.</p>

        <button onClick={() => navigate("/colaborador")}>
          Fazer login no portal
        </button>

      </div>
    </div>
  )
}