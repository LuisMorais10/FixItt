import "../Styles/global.css"

export default function FaxinaInfoModal({ onClose }) {
  return (
    <div className="modal-overlay">

      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Tipos de Faxina</h2>

        <div className="faxina-info">

          <h3>Faxina Padrão</h3>
          <p>
            Ideal para manutenção da limpeza do ambiente. Inclui limpeza de
            superfícies, pisos, banheiros, cozinha e organização geral.
          </p>

          <h3>Diária Completa</h3>
          <p>
            Indicada para ambientes muito sujos ou pós-obra. Inclui limpeza
            profunda, remoção de sujeira acumulada, gordura, poeira pesada e
            áreas difíceis.
          </p>

        </div>
      </div>

    </div>
  )
}