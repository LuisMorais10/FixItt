import { useLocation } from "react-router-dom"

function PaginaContatoEmpresarial() {
  const location = useLocation()

  const isHotel = location.pathname.includes("hotel")

  const titulo = isHotel
    ? "Apoio de Limpeza para Redes Hoteleiras"
    : "Faxina Comercial"

  const descricaoPlaceholder = isHotel
    ? "Descreva a necessidade da rede hoteleira, quantidade de quartos, turnos e período desejado..."
    : "Descreva o tipo de serviço comercial, metragem e frequência desejada..."

  const whatsappLink = "https://wa.me/5511999999999" // coloque seu número real

  return (
    <section className="contato">
      <h2>{titulo}</h2>

      <div className="form-wrapper">
        <form className="agendamento-form">
          <label>Nome completo</label>
          <input type="text" required />

          <label>E-mail</label>
          <input type="email" required />

          <label>Telefone</label>
          <input type="tel" required />

          <label>Descreva sua necessidade</label>
          <textarea
            rows={5}
            placeholder={descricaoPlaceholder}
            required
          />

          <button type="submit">Enviar</button>
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