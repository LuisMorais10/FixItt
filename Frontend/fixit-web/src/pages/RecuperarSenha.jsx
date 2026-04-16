import { useState } from "react"

export default function RecuperarSenha() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    await fetch("http://127.0.0.1:8000/api/password-reset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Recuperar senha</h1>
        <p>Digite seu e-mail para receber o link</p>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button disabled={loading}>
              {loading ? "Enviando..." : "Enviar link"}
            </button>
          </form>
        ) : (
          <p>Email enviado! Verifique sua caixa de entrada 📩</p>
        )}

      </div>
    </div>
  )
}