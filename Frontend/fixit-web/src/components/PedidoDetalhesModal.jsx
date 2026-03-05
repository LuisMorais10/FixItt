import React from "react"

function PedidoDetalhesModal({ pedido, onClose }) {
  if (!pedido) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h3>Detalhes do Pedido</h3>

        <p><strong>Serviço:</strong> {pedido.service_nome}</p>

        <p><strong>Tipo de Faxina:</strong> {pedido.tipo_faxina}</p>

        <p><strong>Endereço:</strong> 
          {pedido.logradouro}, {pedido.numero} - {pedido.complemento}
        </p>

        <p><strong>Data do Serviço:</strong> {pedido.date}</p>
        <p><strong>Turno:</strong> {pedido.turno}</p>

        <p><strong>Quartos:</strong> {pedido.quartos}</p>
        <p><strong>Banheiros:</strong> {pedido.banheiros}</p>

        <p><strong>Pedido criado em:</strong> {pedido.created_at}</p>

        <button onClick={onClose} className="btn-close">
          Fechar
        </button>

      </div>
    </div>
  )
}

export default PedidoDetalhesModal