export default function MateriaisInfoModal({ onClose }) {
  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <h3>Materiais básicos para a faxina</h3>

        <ul className="materiais-list">
          <li>Vassoura</li>
          <li>Rodo</li>
          <li>Escova de bacia sanitária</li>
          <li>Esponja de pratos</li>
          <li>Pano de chão</li>
          <li>Pano de limpeza</li>
          <li>Detergente / Lava-louças</li>
          <li>Água sanitária</li>
          <li>Desinfetante / Multi-uso</li>
          <li>Balde</li>
          <li>Limpa-vidros</li>
        </ul>

        <button onClick={onClose}>Entendi</button>

      </div>

    </div>
  )
}