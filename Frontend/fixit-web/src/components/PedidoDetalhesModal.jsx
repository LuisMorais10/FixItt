import React from "react"

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
            {pedido.status === 'confirmed' || pedido.status === 'completed' && prestador ? (
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

        <button onClick={onClose} className="btn-close">Fechar</button>
      </div>
    </div>
  )
}

export default PedidoDetalhesModal