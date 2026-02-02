import ImageSlider from "../components/ImageSlider"
import AddressSearch from "../components/AddressSearch"
import { useNavigate } from "react-router-dom"

// FAXINA
import faxina1 from "../assets/Images/Residencial.png"
import faxina2 from "../assets/Images/Empresarial.png"
import faxina3 from "../assets/Images/Colaborador_2.png"

// SERVIÇOS GERAIS
import gerais1 from "../assets/Images/Eletrodomestico.png"
import gerais2 from "../assets/Images/Eletricista.png"
import gerais3 from "../assets/Images/Mudanca.png"




function Home() {
  const navigate = useNavigate()
  return (
    <>
      <section className="hero">
        
        <div className="hero-content">
          <h1>O seu portal de serviços</h1>
          <p>Ambientes limpos, clientes felizes. Atendemos residências, empresas e redes hoteleiras.</p>
          <div className="hero-buttons">
            <a href="#" className="btn-primary">Encontrar serviços</a>
            <a href="#" className="btn-secondary">Seja um profissional</a>
          </div>
        </div>
      </section>

      <AddressSearch />

      <section className="services">
        <h2>Nossos Serviços</h2>

        <div className="services-grid">         

          <div 
            className="service-card clickable"
            onClick={() => navigate("/faxina")}
             >
             <ImageSlider images={[faxina1, faxina2, faxina3]} />
          <h3>Faxina</h3>
           <p>Limpeza completa em casas, apartamentos e condomínios. Conforto e bem-estar para seu lar.</p>
      </div>

<div className="service-card">
  <ImageSlider images={[gerais1, gerais2, gerais3]} />

  <h3>Serviços Gerais</h3>
  <p>Manutenções diversas, pequenos reparos e o que mais você precisar para seu espaço.</p>
</div>

        </div>
      </section>
    </>
  )
}

export default Home
