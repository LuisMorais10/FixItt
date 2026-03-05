import { useNavigate, useLocation } from "react-router-dom"
import { useState,useEffect } from "react"


function FormularioFaxina() {
  const navigate = useNavigate()
  const location = useLocation()

      let serviceId = 1

      if (location.pathname.includes("residencial-flash")) {
          serviceId = 2
        }


  const [tipoFaxina, setTipoFaxina] = useState("")      
  const [tipoImovel, setTipoImovel] = useState("")
  const [quartos, setQuartos] = useState("")
  const [banheiros, setBanheiros] = useState("")
  const [metragem, setMetragem] = useState("")
  const [cep, setCep] = useState("")
  const [logradouro, setLogradouro] = useState("")
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")
  const [cidade, setCidade] = useState("")
  const [bairro, setBairro] = useState("")

  useEffect(() => {
  const savedAddress = JSON.parse(localStorage.getItem("selectedAddress"))

  if (savedAddress) {
    setCep(savedAddress.cep || "")
    setCidade(savedAddress.cidade || "")
    setBairro(savedAddress.bairro || "")
    setLogradouro(savedAddress.logradouro || "")
  }
}, [])

  const savedDate = JSON.parse(localStorage.getItem("agendamentoData"))
  const savedTurno = localStorage.getItem("agendamentoTurno")

    if (!savedDate || !savedTurno) {
      alert("Agendamento não encontrado.")
      return
    }

  const formattedDate = `${savedDate.year}-${savedDate.month + 1}-${savedDate.day}`

  const handleSubmit = (e) => {
    e.preventDefault()

    const orderData = {
      service: serviceId,
      date: formattedDate,
      tipo_faxina: tipoFaxina,
      tipo_imovel: tipoImovel,
      quartos,
      banheiros,
      metragem,
      cep,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento,
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
            <label>Tipo de Faxina</label>
            <select
              required
              value={tipoFaxina}
              onChange={(e) => setTipoFaxina(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="padrao">Faxina Padrão</option>
              <option value="diaria-completa">Diária Completa</option>
            </select>
          </div>


          <div className="form-group">
            <label>Casa ou Apartamento</label>
            <select
              required
              value={tipoImovel}
              onChange={(e) => setTipoImovel(e.target.value)}
          >
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>

            </select>
          </div>

          <div className="form-group">
            <label>Número de Quartos</label>
            <input
              type="number"
              value={quartos}
              onChange={(e) => setQuartos(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Número de Banheiros</label>
            <input
              type="number"
              value={banheiros}
              onChange={(e) => setBanheiros(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Metragem Aproximada (m²)</label>
            <input 
              type="number"
              value={metragem}
              onChange={(e) => setMetragem(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>CEP</label>
            <input 
              type="number"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Cidade</label>
            <input 
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Bairro</label>
            <input 
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Logradouro</label>
            <input 
              type="text"
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Número</label>
            <input 
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Complemento</label>
            <input 
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
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
