import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

function EntrarColaborador() {
  const navigate = useNavigate()
  const [telefone, setTelefone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/prestador/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telefone, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "E-mail ou senha incorretos")
        return
      }

      localStorage.setItem("prestador_access", data.access)
      localStorage.setItem("prestador_refresh", data.refresh)
      localStorage.setItem("prestador_telefone", data.telefone)
      localStorage.setItem("prestador_nome", data.nome)

      navigate("/colaborador/portal")

    } catch (error) {
      alert("Erro de conexão com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login-page">
      <div className="login-box">
        <h2>Portal do Colaborador</h2>
        <p style={{ textAlign: 'center', color: '#555', fontSize: '0.9rem', marginBottom: '24px' }}>
          Acesse sua conta para gerenciar seus serviços
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Telefone / WhatsApp</label>
            <PhoneInput
                country="br"
                value={telefone}
                onChange={(val) => setTelefone(val)}
                inputStyle={{ width: '100%', height: '44px', fontSize: '14px' }}
                buttonStyle={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}
                containerStyle={{ marginBottom: '18px' }}
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
            {loading ? "Entrando..." : "Acessar portal"}
          </button>
        </form>

        <div className="login-links">
          <p>
            Ainda não é colaborador?{" "}
            <span className="link" onClick={() => navigate("/prestador/cadastro")}>
              Cadastre-se aqui
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default EntrarColaborador