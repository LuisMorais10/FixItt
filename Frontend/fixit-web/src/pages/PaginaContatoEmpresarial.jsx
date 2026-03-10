import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { authFetch } from "../Services/api"

function PaginaContatoEmpresarial() {

  const location = useLocation()
  const navigate = useNavigate()

  const isHotel = location.pathname.includes("hotel")

  const titulo = isHotel
    ? "Apoio de Limpeza para Redes Hoteleiras"
    : "Faxina Comercial"

  const descricaoPlaceholder = isHotel
    ? "Descreva a necessidade da rede hoteleira, quantidade de quartos, turnos e período desejado..."
    : "Descreva o tipo de serviço comercial, metragem e frequência desejada..."

  const whatsappLink = "https://wa.me/5511999999999"

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    area: "",
    cep: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    mensagem: ""
  })

  const buscarCEP = async (cepDigitado) => {

  const cepLimpo = cepDigitado.replace(/\D/g, "")

  if (cepLimpo.length !== 8) return

  try {

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    const data = await response.json()

    if (!data.erro) {

      setFormData(prev => ({
        ...prev,
        cidade: data.localidade || "",
        bairro: data.bairro || "",
        logradouro: data.logradouro || ""
      }))

    }

  } catch (error) {
    console.error("Erro ao buscar CEP:", error)
  }

}

  const handleChange = (e) => {

  const { name, value } = e.target

  setFormData(prev => ({
    ...prev,
    [name]: value
  }))

  if (name === "cep") {
    buscarCEP(value)
  }

}

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const response = await authFetch(
        "http://localhost:8000/api/contato-empresarial/",
        {
          method: "POST",
          body: JSON.stringify(formData)
        }
      )

      if (!response.ok) {
        console.error("Erro ao enviar mensagem")
        return
      }

      navigate("/mensagem-enviada")

    } catch (error) {
      console.error("Erro:", error)
    }
  }

  return (
    <section className="contato">

      <h2>{titulo}</h2>

      <div className="form-wrapper">

        <form className="agendamento-form" onSubmit={handleSubmit}>

          <label>Nome completo</label>
          <input
            type="text"
            name="nome"
            required
            onChange={handleChange}
          />

          <label>E-mail</label>
          <input
            type="email"
            name="email"
            required
            onChange={handleChange}
          />

          <label>Telefone</label>
          <input
            type="tel"
            name="telefone"
            required
            onChange={handleChange}
          />

          <label>Área útil</label>
          <input
            type="number"
            name="area"
            required
            onChange={handleChange}
          />

          <label>CEP</label>
          <input
            type="text"
            name="cep"
            required
            value={formData.cep}
            onChange={handleChange}
          />

          <label>Cidade</label>
          <input
            type="text"
            name="cidade"
            required
            value={formData.cidade}
            onChange={handleChange}
          />

          <label>Bairro</label>
          <input
            type="text"
            name="bairro"
            required
            value={formData.bairro}
            onChange={handleChange}
          />

          <label>Logradouro</label>
          <input
            type="text"
            name="logradouro"
            required
            value={formData.logradouro}
            onChange={handleChange}
          />

          <label>Número</label>
          <input
            type="number"
            name="numero"
            required
            onChange={handleChange}
          />

          <label>Complemento</label>
          <input
            type="text"
            name="complemento"
            onChange={handleChange}
          />

          <label>Descreva sua necessidade</label>

          <textarea
            rows={5}
            name="mensagem"
            placeholder={descricaoPlaceholder}
            required
            onChange={handleChange}
          />

          <button type="submit">
            Enviar
          </button>

        </form>

      </div>

      <div className="whatsapp-section">

        <p className="whatsapp-text">
          Ou converse com um de nossos especialistas
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          Falar no WhatsApp
        </a>

      </div>

    </section>
  )
}

export default PaginaContatoEmpresarial