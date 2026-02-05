import { useNavigate } from "react-router-dom"
import ImageSlider from "../components/ImageSlider"

// IMAGENS (use provisórias se ainda não tiver específicas)
import residencial1 from "../assets/Images/Residencial.png"
import residencial2 from "../assets/Images/Empresarial.png"
import residencial3 from "../assets/Images/Colaborador_2.png"

import comercial1 from "../assets/Images/Empresarial.png"
import comercial2 from "../assets/Images/Residencial.png"
import comercial3 from "../assets/Images/Colaborador_2.png"

import hotel1 from "../assets/Images/Hotel.png"
import hotel2 from "../assets/Images/Residencial.png"
import hotel3 from "../assets/Images/Empresarial.png"

function Faxina() {
  const navigate = useNavigate()

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Serviços de Faxina</h1>
          <p>Escolha o tipo de faxina ideal para sua necessidade</p>
        </div>
      </section>

      <section className="services">
        <div className="services-grid">

          {/* FAXINA RESIDENCIAL AGENDADA */}
          <div
            className="service-card clickable"
            onClick={() => navigate("/faxina/residencial-agendada")}
          >
            <ImageSlider images={[residencial1, residencial2, residencial3]} />
            <h3>Faxina Residencial Agendada</h3>
            <p>
              Limpeza completa agendada com antecedência, ideal para manter sua
              casa sempre organizada.
            </p>
          </div>

          {/* FAXINA RESIDENCIAL FLASH */}
          <div
            className="service-card clickable"
            onClick={() => navigate("/faxina/residencial-flash")}
          >
            <ImageSlider images={[residencial2, residencial1, residencial3]} />
            <h3>Faxina Residencial Flash</h3>
            <p>
              Atendimento rápido para emergências e necessidades imediatas,
              com eficiência e praticidade.
            </p>
          </div>

          {/* FAXINA COMERCIAL */}
          <div
            className="service-card clickable"
            onClick={() => navigate("/faxina/comercial")}
          >
            <ImageSlider images={[comercial1, comercial2, comercial3]} />
            <h3>Faxina Comercial</h3>
            <p>
              Limpeza profissional para escritórios, lojas e ambientes
              corporativos.
            </p>
          </div>

          {/* APOIO A REDES HOTELEIRAS */}
          <div
            className="service-card clickable"
            onClick={() => navigate("/faxina/hotelaria")}
          >
            <ImageSlider images={[hotel1, hotel2, hotel3]} />
            <h3>Apoio de Limpeza a Redes Hoteleiras</h3>
            <p>
              Equipes treinadas para limpeza de quartos, áreas comuns e
              alta rotatividade.
            </p>
          </div>

        </div>
      </section>
    </>
  )
}

export default Faxina

