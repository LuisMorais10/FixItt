import { useState } from "react"
import { useNavigate } from "react-router-dom"

function EscolhaProfissional() {
  const navigate = useNavigate()
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null)

  // 🔹 MOCK — depois vem da API
  const profissionaisHistorico = [
    {
      id: 1,
      nome: "Maria Silva",
      avaliacao: 4.9,
      servicos: 12,
      foto: "https://i.pravatar.cc/100?img=47",
    },
    {
      id: 2,
      nome: "Ana Souza",
      avaliacao: 4.8,
      servicos: 8,
      foto: "https://i.pravatar.cc/100?img=32",
    },
  ]

  const profissionaisRegiao = [
    {
      id: 3,
      nome: "João Lima",
      avaliacao: 4.7,
      servicos: 5,
      foto: "https://i.pravatar.cc/100?img=12",
    },
    {
      id: 4,
      nome: "Carlos Mendes",
      avaliacao: 4.6,
      servicos: 6,
      foto: "https://i.pravatar.cc/100?img=15",
    },
  ]

  const handleSelecionar = (profissional) => {
    setProfissionalSelecionado(profissional)
  }

  const handleAvancar = () => {
    // aqui depois você envia o ID do profissional (ou null)
    navigate("/pagamento")
  }

  return (
    <div className="escolha-profissional-page">
      <h2>Escolha um profissional (opcional)</h2>
      <p className="subtitle">
        Você pode escolher alguém de confiança ou deixar que a FixIt selecione
        por você.
      </p>

      {/* 🔹 HISTÓRICO */}
      {profissionaisHistorico.length > 0 && (
        <>
          <h3>Profissionais que já atenderam você</h3>
          <div className="profissionais-grid">
            {profissionaisHistorico.map((p) => (
              <div
                key={p.id}
                className={`profissional-card ${
                  profissionalSelecionado?.id === p.id ? "selected" : ""
                }`}
                onClick={() => handleSelecionar(p)}
              >
                <img src={p.foto} alt={p.nome} />
                <strong>{p.nome}</strong>
                <span>⭐ {p.avaliacao}</span>
                <small>{p.servicos} serviços realizados</small>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🔹 REGIÃO */}
      <h3>Profissionais disponíveis na sua região</h3>
      <div className="profissionais-grid">
        {profissionaisRegiao.map((p) => (
          <div
            key={p.id}
            className={`profissional-card ${
              profissionalSelecionado?.id === p.id ? "selected" : ""
            }`}
            onClick={() => handleSelecionar(p)}
          >
            <img src={p.foto} alt={p.nome} />
            <strong>{p.nome}</strong>
            <span>⭐ {p.avaliacao}</span>
            <small>{p.servicos} serviços realizados</small>
          </div>
        ))}
      </div>

      {/* 🔹 SEM PREFERÊNCIA */}
      <div className="sem-preferencia">
        <button
         type="button"
         onClick={() => navigate("/pagamento")}
       >
        Não tenho preferência
       </button>
    </div>

      {/* 🔹 AVANÇAR */}
      <button className="btn-avancar" onClick={handleAvancar}>
        Avançar
      </button>
    </div>
  )
}

export default EscolhaProfissional
