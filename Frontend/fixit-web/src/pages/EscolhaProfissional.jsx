import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const API = "http://127.0.0.1:8000/api"

function PrestadorCard({ p, selecionado, onSelecionar, badge }) {
  const iniciais = p.nome
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const isSelected = selecionado?.id === p.id

  return (
    <div
      className={`profissional-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelecionar(p)}
      style={{
        position: "relative",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
    >
      {/* Badge "Já atendeu você" ou "Novo" */}
      {badge && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: badge === "historico" ? "#e3f2fd" : "#e8f5e9",
            color: badge === "historico" ? "#0d47a1" : "#2e7d32",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.6px",
            padding: "3px 8px",
            borderRadius: "20px",
            textTransform: "uppercase",
          }}
        >
          {badge === "historico" ? "Já te atendeu" : "Novo"}
        </span>
      )}

      {/* Foto ou iniciais */}
      {p.foto ? (
        <img
          src={`${API.replace("/api", "")}${p.foto}`}
          alt={p.nome}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "10px",
            border: isSelected ? "3px solid #0d47a1" : "3px solid #e3f2fd",
            transition: "border 0.2s",
          }}
        />
      ) : (
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: isSelected ? "#0d47a1" : "#e3f2fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: 700,
            color: isSelected ? "#fff" : "#0d47a1",
            marginBottom: "10px",
            transition: "all 0.2s",
            border: isSelected ? "3px solid #0d47a1" : "3px solid #e3f2fd",
          }}
        >
          {iniciais}
        </div>
      )}

      <strong style={{ display: "block", fontSize: "15px", marginBottom: "4px", color: "#1a1a2e" }}>
        {p.nome}
      </strong>

      {/* Avaliação */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginBottom: "4px" }}>
        {p.media_avaliacao ? (
          <>
            <div style={{ display: "flex", gap: "1px" }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  style={{
                    fontSize: "13px",
                    color: n <= Math.round(parseFloat(p.media_avaliacao)) ? "#EF9F27" : "#ddd",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span style={{ fontSize: "12px", color: "#666", fontWeight: 600 }}>
              {parseFloat(p.media_avaliacao).toFixed(1)}
            </span>
          </>
        ) : (
          <span
            style={{
              background: "#e3f2fd",
              color: "#0d47a1",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "20px",
              letterSpacing: "0.8px",
            }}
          >
            NOVO
          </span>
        )}
      </div>

      <small style={{ color: "#888", fontSize: "12px" }}>
        {p.total_servicos ?? 0} {(p.total_servicos ?? 0) === 1 ? "serviço" : "serviços"} realizados
      </small>

      {/* Experiência */}
      {p.anos_experiencia > 0 && (
        <small style={{ display: "block", color: "#aaa", fontSize: "11px", marginTop: "2px" }}>
          {p.anos_experiencia} {p.anos_experiencia === 1 ? "ano" : "anos"} de experiência
        </small>
      )}

      {/* Check de selecionado */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "#0d47a1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          ✓
        </div>
      )}
    </div>
  )
}

function EscolhaProfissional() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [selecionado, setSelecionado] = useState(null)
  const [historico, setHistorico] = useState([])
  const [disponiveis, setDisponiveis] = useState([])
  const [loading, setLoading] = useState(true)
  const [semPreferencia, setSemPreferencia] = useState(false)

  // Pega o tipo de serviço vindo do formulário anterior via location.state
  const tipoServico = location.state?.tipoServico || null

  useEffect(() => {
    if (!user) return

    const headers = { Authorization: `Bearer ${user.access}` }

    const fetchPrestadores = async () => {
      try {
        // Busca todos os prestadores ativos
        const [prestRes, pedidosRes] = await Promise.all([
          fetch(`${API}/prestadores/`, { headers }),
          fetch(`${API}/orders/my/`, { headers }),
        ])

        const prestadores = prestRes.ok ? await prestRes.json() : []
        const pedidos = pedidosRes.ok ? await pedidosRes.json() : []

        // IDs dos prestadores que já atenderam o user
        const idsHistorico = new Set(
          pedidos
            .filter((o) => o.status === "completed" && o.prestador)
            .map((o) => o.prestador)
        )

        // Filtra por tipo de serviço se informado
        const filtrados = tipoServico
          ? prestadores.filter((p) => p.servico === tipoServico)
          : prestadores

        setHistorico(filtrados.filter((p) => idsHistorico.has(p.id)))
        setDisponiveis(filtrados.filter((p) => !idsHistorico.has(p.id)))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrestadores()
  }, [user, tipoServico])

  const handleSelecionar = (p) => {
    setSemPreferencia(false)
    setSelecionado((prev) => (prev?.id === p.id ? null : p))
  }

  const handleSemPreferencia = () => {
    setSelecionado(null)
    setSemPreferencia(true)
  }

  const handleAvancar = () => {
    // Passa o prestador escolhido (ou null) para a página de pagamento
    navigate("/pagamento", {
      state: {
        ...location.state,
        prestadorId: selecionado?.id ?? null,
        prestadorNome: selecionado?.nome ?? null,
      },
    })
  }

  const podeAvancar = selecionado !== null || semPreferencia

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "120px" }}>
        <p style={{ color: "#0d47a1", fontSize: "15px" }}>Buscando profissionais...</p>
      </div>
    )
  }

  return (
    <div className="escolha-profissional-page">

      {/* ── Cabeçalho ── */}
      <div style={{ marginBottom: "8px" }}>
        <h2 style={{ marginBottom: "8px" }}>Escolha um profissional</h2>
        <p className="subtitle">
          Selecione um profissional de confiança ou deixe a FixIt escolher por você.
        </p>
      </div>

      {/* ── Sem preferência (topo, destaque) ── */}
      <div
        onClick={handleSemPreferencia}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "16px 20px",
          borderRadius: "14px",
          border: semPreferencia ? "2px solid #0d47a1" : "2px dashed #b3c9e8",
          background: semPreferencia ? "#e3f2fd" : "#f8fbff",
          cursor: "pointer",
          marginBottom: "36px",
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: semPreferencia ? "#0d47a1" : "#e3f2fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {semPreferencia ? (
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>✓</span>
          ) : (
            <span style={{ fontSize: "18px" }}>🎲</span>
          )}
        </div>
        <div>
          <p
            style={{
              margin: "0 0 2px",
              fontWeight: 700,
              color: semPreferencia ? "#0d47a1" : "#333",
              fontSize: "15px",
            }}
          >
            Não tenho preferência
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
            A FixIt vai selecionar o melhor profissional disponível para você.
          </p>
        </div>
      </div>

      {/* ── Histórico ── */}
      {historico.length > 0 && (
        <section style={{ marginBottom: "36px" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              fontSize: "16px",
              color: "#0d47a1",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#0d47a1",
                display: "inline-block",
              }}
            />
            Profissionais que já atenderam você
          </h3>
          <div className="profissionais-grid">
            {historico.map((p) => (
              <PrestadorCard
                key={p.id}
                p={p}
                selecionado={selecionado}
                onSelecionar={handleSelecionar}
                badge="historico"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Disponíveis ── */}
      {disponiveis.length > 0 && (
        <section style={{ marginBottom: "36px" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              fontSize: "16px",
              color: "#0d47a1",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#0d47a1",
                display: "inline-block",
              }}
            />
            Profissionais disponíveis
          </h3>
          <div className="profissionais-grid">
            {disponiveis.map((p) => (
              <PrestadorCard
                key={p.id}
                p={p}
                selecionado={selecionado}
                onSelecionar={handleSelecionar}
                badge="novo"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Nenhum prestador ── */}
      {historico.length === 0 && disponiveis.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#f8fbff",
            borderRadius: "14px",
            marginBottom: "36px",
            color: "#888",
            fontSize: "14px",
          }}
        >
          Nenhum profissional disponível no momento. Selecione "Não tenho preferência" para continuar.
        </div>
      )}

      {/* ── Selecionado: resumo ── */}
      {selecionado && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#e3f2fd",
            border: "1px solid #b3c9e8",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#0d47a1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "13px",
              flexShrink: 0,
            }}
          >
            {selecionado.nome?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: "#0d47a1", fontSize: "14px" }}>
              {selecionado.nome} selecionado(a)
            </p>
            {selecionado.media_avaliacao && (
              <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>
                ★ {parseFloat(selecionado.media_avaliacao).toFixed(1)} · {selecionado.total_servicos ?? 0} serviços
              </p>
            )}
          </div>
          <button
            onClick={() => setSelecionado(null)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1,
              padding: "0 4px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Botão avançar ── */}
      <button
        className={`btn-avancar ${podeAvancar ? "ativo" : ""}`}
        onClick={handleAvancar}
        disabled={!podeAvancar}
        style={{ marginTop: "4px" }}
      >
        {podeAvancar
          ? selecionado
            ? `Avançar com ${selecionado.nome.split(" ")[0]}`
            : "Avançar sem preferência"
          : "Selecione um profissional ou continue sem preferência"}
      </button>
    </div>
  )
}

export default EscolhaProfissional
