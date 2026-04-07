import React, { useEffect, useState } from "react"


const SERVICO_LABELS = {
  faxina_residencial: 'Faxina Residencial',
  faxina_empresarial: 'Faxina Empresarial',
  hotelaria: 'Apoio a Redes Hoteleiras',
  mudanca: 'Mudança',
  eletrodomesticos: 'Técnico de Eletrodomésticos',
  eletricista: 'Eletricista',
  servicos_gerais: 'Serviços Gerais',
}

function StarRating({ value }) {
  return (
    <div className="perfil-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  )
}

function PedidoDetalhesModal({ pedido, onClose, modo = "user" }) {
  const [statusAvaliacao, setStatusAvaliacao] = useState(null)
  const [mostrarModalAvaliacao, setMostrarModalAvaliacao] = useState(false)
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState("")

  // 🔥 ADICIONADO: resetar estado ao trocar pedido
  useEffect(() => {
    setStatusAvaliacao(null)
    setNota(0)
    setComentario("")
  }, [pedido])

  useEffect(() => {
    if (!pedido) return

    const token = localStorage.getItem("access")

    fetch(`http://localhost:8000/api/orders/${pedido.id}/status-avaliacao/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => setStatusAvaliacao(data))
    .catch(err => console.error(err))

  }, [pedido])
  
  if (!pedido) return null


  const prestador = pedido.prestador_detalhes
  const usuario = pedido.user_detalhes

  const iniciaisPrestador = prestador?.nome
    ?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  const nomeUsuario = usuario
    ? `${usuario.first_name} ${usuario.last_name}`.trim() || usuario.email
    : '—'

  const iniciaisUsuario = nomeUsuario
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h3>Detalhes do Pedido #{pedido.id}</h3>

        <p><strong>Serviço:</strong> {pedido.service_nome}</p>
        <p><strong>Tipo de Faxina:</strong> {pedido.tipo_faxina || '—'}</p>
        <p><strong>Endereço:</strong> {pedido.logradouro}, {pedido.numero}{pedido.complemento ? ` - ${pedido.complemento}` : ''}</p>
        <p><strong>Data:</strong> {pedido.date}</p>
        <p><strong>Turno:</strong> {pedido.turno || '—'}</p>
        <p><strong>Quartos:</strong> {pedido.quartos}</p>
        <p><strong>Banheiros:</strong> {pedido.banheiros}</p>
        <p><strong>Criado em:</strong> {new Date(pedido.created_at).toLocaleDateString('pt-BR')}</p>

         <hr className="perfil-divider" />

        {/* MODO USER — vê o prestador */}
        {modo === "user" && (
          <>
            {(pedido.status === 'confirmed' || pedido.status === 'completed') && prestador ? (
              <>
                <h4 className="modal-section-title">Profissional responsável</h4>
                <div className="prestador-resumo-card">
                  <div className="prestador-resumo-avatar">
                    {prestador.foto
                      ? <img src={prestador.foto} alt="foto" />
                      : iniciaisPrestador}
                  </div>
                  <div className="prestador-resumo-info">
                    <strong>{prestador.nome}</strong>
                    <span>{SERVICO_LABELS[prestador.servico] || prestador.servico}</span>
                    <span>{prestador.anos_experiencia} anos de experiência</span>
                    <span>📞 {prestador.telefone}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="aguardando-prestador">⏳ Aguardando um profissional aceitar o pedido...</p>
            )}
          </>
        )}

        {/* MODO PRESTADOR — vê o usuário */}
        {modo === "prestador" && usuario && (
          <>
            <h4 className="modal-section-title">Cliente</h4>
            <div className="prestador-resumo-card">
              <div className="prestador-resumo-avatar">
                {iniciaisUsuario}
              </div>
              <div className="prestador-resumo-info">
                <strong>{nomeUsuario}</strong>
                <StarRating value={4.0} />
                <span style={{ fontSize: '12px', color: '#888' }}>4.0 / 5 · avaliação mockada</span>
              </div>
            </div>
          </>
        )}

        {pedido.status === "completed" && statusAvaliacao?.pode_avaliar && !statusAvaliacao?.ja_avaliou && (
          <button className="btn-avaliar" onClick={() => setMostrarModalAvaliacao(true)}>
            Avaliar serviço ⭐
          </button>
        )}

        {statusAvaliacao?.ja_avaliou && (
          <p style={{ color: "green" }}>Você já avaliou este serviço ✅</p>
        )}

        {statusAvaliacao && !statusAvaliacao.pode_avaliar && !statusAvaliacao.ja_avaliou && (
          <p style={{ color: "gray" }}>{statusAvaliacao.motivo}</p>
        )}

        {mostrarModalAvaliacao && (
          <div className="avaliacao-popup">
            <div className="avaliacao-modal-content">
              <h3 className="avaliacao-title">Avaliar serviço</h3>

              <div className="avaliacao-stars">
                {[1,2,3,4,5].map(i => (
                  <span
                    key={i}
                    onMouseEnter={() => setNota(i)}
                    onClick={() => setNota(i)}
                    className={`star-click ${i <= nota ? "ativa" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                className="avaliacao-textarea"
                placeholder="Conte como foi sua experiência (opcional)"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />

              <div className="avaliacao-actions">
                <button
                  className="btn-enviar"
                  onClick={async () => {

              // 🔥 ADICIONADO: validação de nota
              if (nota === 0) {
                alert("Selecione uma nota de 1 a 5")
                return
              }

              const token = localStorage.getItem("access")

              const res = await fetch("http://localhost:8000/api/avaliacoes/criar/", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                order: pedido.id,
                nota,
                comentario
                })
              })

              const data = await res.json()

              if (res.ok) {
                alert("Avaliação enviada!")
                setMostrarModalAvaliacao(false)

                setStatusAvaliacao({
                  pode_avaliar: false,
                  ja_avaliou: true
                })

                // 🔥 ADICIONADO: limpar estado após envio
                setNota(0)
                setComentario("")

              } else {
                alert(data.error || "Erro ao avaliar")
              }

            }}>
              Enviar
            </button>

            <button
              className="btn-cancelar"
              onClick={() => setMostrarModalAvaliacao(false)}
            >
              Cancelar
            </button>
      </div>
    </div>
  </div>
)}

        <button onClick={onClose} className="btn-close">Fechar</button>
      </div>
    </div>
  )
}

export default PedidoDetalhesModal