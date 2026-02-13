import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import "../Styles/auth.css"

function CriarConta() {
  const navigate = useNavigate()
  
  
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  const validarSenha = (senha) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/
    return regex.test(senha)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarSenha(senha)) {
      alert(
        "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
      )
      return
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem")
      return
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, // Django usa username
          email: email,
          telefone: telefone,
          password: senha,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const firstError = Object.values(data)[0]
        alert(Array.isArray(firstError) ? firstError[0] : "Erro ao criar conta")
      return
      }

       navigate("/verificar-codigo", {
        state: { email }
     })
    } catch (error) {
      console.error(error)
      alert("Erro de conexão com o servidor")
    }
  }

  return (
    <section className="login-page">
      <div className="login-box">
        <h2>Criar Conta</h2>

        <form onSubmit={handleSubmit}>
          <label>Nome completo</label>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label>E-mail</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Telefone para contato</label>
          <PhoneInput
            country={"br"}
            value={telefone}
            onChange={setTelefone}
            inputStyle={{
             width: "100%",
             height: "44px",
             fontSize: "14px",
                  }}
            buttonStyle={{
             borderTopLeftRadius: "6px",
             borderBottomLeftRadius: "6px",
                  }}
            containerStyle={{
             marginBottom: "16px",
                  }}
            placeholder="Digite seu telefone"
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <label>Confirmar senha</label>
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />

          <button type="submit">Criar Conta</button>
        </form>

        <p className="login-link">
          Já possui conta? <Link to="/entrar">Entrar</Link>
        </p>
      </div>
    </section>
  )
}

export default CriarConta
