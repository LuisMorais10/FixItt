import { useNavigate } from "react-router-dom"

function FormularioFaxina() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const orderData = {
      service: "faxina_residencial",
      value: 150
    }

    localStorage.setItem("pendingOrder", JSON.stringify(orderData))

    navigate("/pagamento")
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Preencha as informações abaixo</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Casa ou Apartamento</label>
            <select required>
              <option value="">Selecione</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
            </select>
          </div>

          <div className="form-group">
            <label>Número de Quartos</label>
            <input type="number" placeholder="Ex: 2" required />
          </div>

          <div className="form-group">
            <label>Número de Banheiros</label>
            <input type="number" placeholder="Ex: 1" required />
          </div>

          <div className="form-group">
            <label>Metragem Aproximada (m²)</label>
            <input type="number" placeholder="Ex: 85" required />
          </div>

          <div className="form-group">
            <label>CEP</label>
            <input type="text" placeholder="Digite seu CEP" required />
          </div>

          <div className="form-group">
            <label>Logradouro</label>
            <input type="text" placeholder="Rua, Avenida..." required />
          </div>

          <div className="form-group">
            <label>Número</label>
            <input type="text" placeholder="Ex: 145" required />
          </div>

          <div className="form-group">
            <label>Complemento</label>
            <input type="text" placeholder="Ex: Apartamento 302 (opcional)" />
          </div>

          <button type="submit" className="btn-submit">
            Avançar
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormularioFaxina
