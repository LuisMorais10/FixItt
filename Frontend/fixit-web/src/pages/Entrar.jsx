import { useNavigate } from "react-router-dom"

function Entrar() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // integração com backend depois
  }

  return (
    <>
      <section className="login-section">
        <div className="login-container">
          <h2>Entrar na sua conta</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              required
            />

            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              required
            />

            <button type="submit">Acessar</button>
          </form>

          <div className="extra-links">
            <p>
              <span
                className="link-action"
                onClick={() => navigate("/recuperar-senha")}
              >
                Esqueceu sua senha?
              </span>
            </p>

            <p>
              Não possui conta?{" "}
              <span
                className="link-action"
                onClick={() => navigate("/criar-conta")}
              >
                Registre-se
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Entrar
