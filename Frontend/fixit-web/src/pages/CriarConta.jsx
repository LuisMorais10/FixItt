import { useState } from "react"
import { Link } from "react-router-dom"

function CriarConta() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault() // 🔥 impede reload da página

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
          password: senha,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Erro ao criar conta")
        return
      }

      alert("Conta criada com sucesso!")
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
          />

          <label>E-mail</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <label>Confirmar senha</label>
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
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
