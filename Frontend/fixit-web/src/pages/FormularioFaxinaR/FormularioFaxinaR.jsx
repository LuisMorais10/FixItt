import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import FaxinaInfoModal from "../../components/FaxinaInfoModal"
import MateriaisInfoModal from "../../components/MateriaisInfoModal"
import "./FormularioFaxinaR.css"

function FormularioFaxinaR() {
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
  const [tipoImovel, setTipoImovel] = useState("casa")
  const [quartos, setQuartos] = useState("")
  const [banheiros, setBanheiros] = useState("")
  const [metragem, setMetragem] = useState("")
  const [cep, setCep] = useState("")
  const [logradouro, setLogradouro] = useState("")
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")
  const [cidade, setCidade] = useState("")
  const [bairro, setBairro] = useState("")
  const [cepLoading, setCepLoading] = useState(false)

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "")
    if (cepLimpo.length !== 8) return
    setCepLoading(true)
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
    } finally {
      setCepLoading(false)
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
      value: 150,
    }
    localStorage.setItem("pendingOrder", JSON.stringify(orderData))
    if (serviceId === 2) {
      navigate("/pagamento")
    } else {
      navigate("/faxina/residencial-agendada/profissionais")
    }
  }

  return (
    <div className="ffr-page">
      {/* ── LEFT PANEL ── */}
      <aside className="ffr-aside">
        <div className="ffr-aside-illustration">
          {/* Simple SVG illustration of cleaning supplies */}
          <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="110" cy="110" r="100" fill="#dbeafe" />
            {/* bucket */}
            <rect x="70" y="120" width="50" height="55" rx="6" fill="#3b82f6" />
            <rect x="65" y="113" width="60" height="14" rx="4" fill="#2563eb" />
            {/* handle */}
            <path d="M80 113 Q95 95 115 113" stroke="#2563eb" strokeWidth="4" fill="none" strokeLinecap="round"/>
            {/* spray bottle */}
            <rect x="130" y="100" width="28" height="60" rx="6" fill="#60a5fa" />
            <rect x="130" y="93" width="20" height="14" rx="4" fill="#3b82f6" />
            <rect x="150" y="98" width="18" height="6" rx="3" fill="#3b82f6" />
            {/* bubbles */}
            <circle cx="165" cy="85" r="5" fill="white" opacity="0.7" />
            <circle cx="155" cy="76" r="3" fill="white" opacity="0.5" />
            <circle cx="172" cy="73" r="4" fill="white" opacity="0.6" />
            {/* mop stick */}
            <rect x="58" y="60" width="6" height="80" rx="3" fill="#93c5fd" />
            <rect x="46" y="135" width="30" height="10" rx="5" fill="#60a5fa" />
          </svg>
        </div>

        <h2 className="ffr-aside-title">Preencha as informações</h2>
        <p className="ffr-aside-sub">
          Assim conseguimos indicar o profissional ideal para sua necessidade.
        </p>

        <ul className="ffr-features">
          <li>
            <span className="ffr-feat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <div>
              <strong>Profissionais verificados</strong>
              <p>Todos os profissionais são avaliados e verificados.</p>
            </div>
          </li>
          <li>
            <span className="ffr-feat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <div>
              <strong>Ambiente seguro</strong>
              <p>Seus dados estão protegidos com segurança.</p>
            </div>
          </li>
          <li>
            <span className="ffr-feat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
            </span>
            <div>
              <strong>Pagamento facilitado</strong>
              <p>Pague com cartão ou PIX de forma rápida e segura.</p>
            </div>
          </li>
        </ul>
      </aside>

      {/* ── RIGHT PANEL ── */}
      <main className="ffr-main">
        {/* Page title */}
        

        <form className="ffr-form" onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="ffr-row">
            <div className="ffr-field">
              <label className="ffr-label">
                <span className="ffr-label-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </span>
                Tipo de Faxina
                <button type="button" className="ffr-info-btn" onClick={() => setShowInfo(true)}>i</button>
              </label>
              <select required value={tipoFaxina} onChange={(e) => setTipoFaxina(e.target.value)}>
                <option value="">Selecione</option>
                <option value="padrao">Faxina Padrão</option>
                <option value="diaria-completa">Diária Completa</option>
              </select>
            </div>

            <div className="ffr-field">
              <label className="ffr-label">
                <span className="ffr-label-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                </span>
                Casa ou Apartamento
              </label>
              <select required value={tipoImovel} onChange={(e) => setTipoImovel(e.target.value)}>
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="ffr-row">
            <div className="ffr-field">
              <label className="ffr-label">
                <span className="ffr-label-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4h20v16H2z"/><path d="M8 4v16"/></svg>
                </span>
                Número de Quartos
              </label>
              <input type="number" placeholder="Ex.: 2" value={quartos} onChange={(e) => setQuartos(e.target.value)} required min="0" />
            </div>

            <div className="ffr-field">
              <label className="ffr-label">
                <span className="ffr-label-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16M4 12a8 8 0 0 1 16 0"/><rect x="6" y="12" width="12" height="6" rx="2"/></svg>
                </span>
                Número de Banheiros
              </label>
              <input type="number" placeholder="Ex.: 1" value={banheiros} onChange={(e) => setBanheiros(e.target.value)} required min="0" />
            </div>
          </div>

          {/* Metragem full width */}
          <div className="ffr-field">
            <label className="ffr-label">
              <span className="ffr-label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18M3 3v18M3 9h6M3 15h12M9 3v6M15 3v12"/></svg>
              </span>
              Metragem Aproximada (m²)
            </label>
            <input type="number" placeholder="Ex.: 70" value={metragem} onChange={(e) => setMetragem(e.target.value)} required min="0" />
          </div>

          {/* CEP full width */}
          <div className="ffr-field">
            <label className="ffr-label">
              <span className="ffr-label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              CEP
            </label>
            <div className="ffr-cep-wrap">
              <input
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => { setCep(e.target.value); buscarCEP(e.target.value) }}
              />
              <button
                type="button"
                className="ffr-cep-btn"
                onClick={() => buscarCEP(cep)}
                disabled={cepLoading}
              >
                {cepLoading
                  ? <span className="ffr-spinner" />
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Row 3: Cidade + Bairro */}
          <div className="ffr-row">
            <div className="ffr-field">
              <label className="ffr-label">
                <span className="ffr-label-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                </span>
                Cidade
              </label>
              <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
            </div>

            <div className="ffr-field">
              <label className="ffr-label">
                <span className="ffr-label-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/></svg>
                </span>
                Bairro
              </label>
              <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
            </div>
          </div>

          {/* Logradouro full width */}
          <div className="ffr-field">
            <label className="ffr-label">
              <span className="ffr-label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="15" y2="18"/></svg>
              </span>
              Logradouro
            </label>
            <input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} required />
          </div>

          {/* Row 4: Número + Complemento */}
          <div className="ffr-row">
            <div className="ffr-field">
              <label className="ffr-label">
                <span className="ffr-label-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                </span>
                Número
              </label>
              <input type="number" value={numero} onChange={(e) => setNumero(e.target.value)} required />
            </div>

            <div className="ffr-field">
              <label className="ffr-label">
                <span className="ffr-label-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/></svg>
                </span>
                Complemento
              </label>
              <input type="text" placeholder="Apto, bloco..." value={complemento} onChange={(e) => setComplemento(e.target.value)} />
            </div>
          </div>

          {/* Materiais */}
          <div className="ffr-field">
            <label className="ffr-label">
              <span className="ffr-label-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
              </span>
              Materiais de limpeza
              <button type="button" className="ffr-info-btn" onClick={() => setShowMateriaisInfo(true)}>i</button>
            </label>

            <div className="ffr-radio-group">
              <label className={`ffr-radio-option ${materiaisLimpeza === "cliente" ? "ffr-radio-option--selected" : ""}`}>
                <input
                  type="radio"
                  name="materiais"
                  value="cliente"
                  checked={materiaisLimpeza === "cliente"}
                  onChange={(e) => setMateriaisLimpeza(e.target.value)}
                />
                <span className="ffr-radio-dot" />
                Declaro que possuo os materiais de limpeza citados para a faxina selecionada
              </label>

              <label className={`ffr-radio-option ${materiaisLimpeza === "profissional" ? "ffr-radio-option--selected" : ""}`}>
                <input
                  type="radio"
                  name="materiais"
                  value="profissional"
                  checked={materiaisLimpeza === "profissional"}
                  onChange={(e) => setMateriaisLimpeza(e.target.value)}
                />
                <span className="ffr-radio-dot" />
                Solicito que o profissional leve os materiais de limpeza
              </label>
            </div>
          </div>

          <button type="submit" className="ffr-submit">Avançar</button>
        </form>
      </main>

      {showInfo && <FaxinaInfoModal onClose={() => setShowInfo(false)} />}
      {showMateriaisInfo && <MateriaisInfoModal onClose={() => setShowMateriaisInfo(false)} />}
    </div>
  )
}

export default FormularioFaxinaR