import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function NovaSenha() {
  const { uid, token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirm) {
      setError("As senhas não coincidem")
      return
    }

    const response = await fetch("http://127.0.0.1:8000/api/password-reset-confirm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, token, password }),
    })

    if (response.ok) {
      navigate("/senha-sucesso")
    } else {
      setError("Link inválido ou expirado")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Nova senha</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button>Atualizar senha</button>
        </form>

      </div>
    </div>
  )
}