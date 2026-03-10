import { useNavigate, useLocation } from "react-router-dom"
import { useState,useEffect } from "react"
import FaxinaInfoModal from "../components/FaxinaInfoModal"
import MateriaisInfoModal from "../components/MateriaisInfoModal"


function FormularioFaxina() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showInfo, setShowInfo] = useState(false)
  const [showMateriaisInfo, setShowMateriaisInfo] = useState(false)
  const [materiaisLimpeza, setMateriaisLimpeza] = useState("")

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
  const buscarCEP = async (cep) => {

  const cepLimpo = cep.replace(/\D/g, "")

  if (cepLimpo.length !== 8) return

  try {

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    const data = await response.json()

    if (!data.erro) {
      setCidade(data.localidade || "")
      setBairro(data.bairro || "")
      setLogradouro(data.logradouro || "")
    }

  } catch (error) {
    console.error("Erro ao buscar CEP:", error)
  }

}

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
      materiais_limpeza: materiaisLimpeza,
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
            <label className="label-info">
              Tipo de Faxina

              <span 
                className="info-icon"
                onClick={() => setShowInfo(true)}
                title="Saiba a diferença entre os tipos de faxina"
              >
                i

              </span>

            </label>

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
              type="text"
              value={cep}
              onChange={(e) => {
                const value = e.target.value
                setCep(value)
                buscarCEP(value)
            }}
            placeholder="00000-000"
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

          <div className="form-group">

            <label className="label-info">
            Materiais de limpeza

            <span
              className="info-icon"
              onClick={() => setShowMateriaisInfo(true)}
              title="Veja os materiais necessários para a faxina"
            >
              i
          </span>

        </label>

          <div className="materiais-flags">

            <label className="flag-option">
            <input
              type="radio"
              name="materiais"
              value="cliente"
              checked={materiaisLimpeza === "cliente"}
              onChange={(e) => setMateriaisLimpeza(e.target.value)}
            />
          Declaro que possuo os materiais de limpeza citados para a faxina selecionada
        </label>

            <label className="flag-option">
            <input
              type="radio"
              name="materiais"
              value="profissional"
              checked={materiaisLimpeza === "profissional"}
              onChange={(e) => setMateriaisLimpeza(e.target.value)}
            />
          Solicito que o profissional leve os materiais de limpeza
        </label>

      </div>

    </div>

          <button type="submit" className="btn-submit">
            Avançar
          </button>
        </form>
      </div>

      {showInfo && (
        <FaxinaInfoModal
          onClose={() => setShowInfo(false)}
        />
      )}


      {showMateriaisInfo && (
        <MateriaisInfoModal onClose={() => setShowMateriaisInfo(false)} />
      )}
    </div>
  )
}

export default FormularioFaxina
