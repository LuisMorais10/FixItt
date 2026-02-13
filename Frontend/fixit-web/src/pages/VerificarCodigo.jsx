import { useState } from "react"
import { useLocation } from "react-router-dom"
import "../Styles/auth.css"
import { useNavigate } from "react-router-dom"

export default function VerificarCodigo() {
  const navigate = useNavigate()

  const { state } = useLocation()
  const email = state?.email

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e, index) {
    const value = e.target.value.replace(/\D/, "")
    if (!value) return

    const newCode = code.split("")
    newCode[index] = value
    const finalCode = newCode.join("")

    setCode(finalCode)

    if (index < 5 && value) {
      e.target.nextSibling?.focus()
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      const newCode = code.split("")
      newCode[index] = ""
      setCode(newCode.join(""))

      if (index > 0) {
        e.target.previousSibling?.focus()
      }
    }
  }

  async function handleVerify() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://127.0.0.1:8000/api/verify-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Código inválido")
        return
      }

      navigate("/conta-verificada")
    } catch {
      setError("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/resend-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Erro ao reenviar código")
        return
      }

      alert("Código reenviado com sucesso!")
    } catch {
      alert("Erro de conexão")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card verify-card">
        <h1>Verifique seu email</h1>

        <p>
          Enviamos um código de verificação para <strong>{email}</strong>
        </p>

        <div className="code-inputs">
          {Array(6).fill("").map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={code[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={handleVerify} disabled={loading}>
          {loading ? "Verificando..." : "Verificar"}
        </button>

        <span className="resend">
          Não recebeu o código?{" "}
          <button type="button" onClick={handleResend} className="resend-btn">
            Reenviar
          </button>
        </span>
      </div>
    </div>
  )
}
