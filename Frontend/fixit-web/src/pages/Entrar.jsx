import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Entrar() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, // 👈 SimpleJWT usa username
          password: password,
        }),
      })

      if (!response.ok) {
        throw new Error("Credenciais inválidas")
      }

      const data = await response.json()

      login({
         access: data.access,
         refresh: data.refresh,
         email: email,
           })

      navigate("/")

    } catch (error) {
      alert("E-mail ou senha incorretos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login-page">
      <div className="login-box">
        <h2>Entrar na sua conta</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Entrando..." : "Acessar"}
          </button>
        </form>

        <div className="login-links">
          <span className="link" onClick={() => navigate("/recuperar-senha")}>
            Esqueceu sua senha?
          </span>

          <p>
            Não possui conta?{" "}
            <span className="link" onClick={() => navigate("/criar-conta")}>
              Registre-se
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Entrar
