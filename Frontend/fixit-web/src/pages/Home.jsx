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
         <section id="contato" className="contato">
  <h2>Agende seu atendimento</h2>

  <div className="form-wrapper">
    <form className="agendamento-form">
      <label htmlFor="nome">Nome completo</label>
      <input
        id="nome"
        name="nome"
        type="text"
        placeholder="Nome completo"
        required
      />

      <label htmlFor="email">E-mail</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="E-mail"
        required
      />

      <label htmlFor="telefone">Telefone</label>
      <input
        id="telefone"
        name="telefone"
        type="tel"
        placeholder="Telefone"
        required
      />

      <label htmlFor="descricao">
        Descreva o tipo de serviço e a data desejada
      </label>
      <textarea
        id="descricao"
        name="descricao"
        placeholder="Descreva o tipo de serviço e a data desejada"
        rows={5}
        required
      />

      <button type="submit">Enviar</button>
    </form>
  </div>
</section>


      </section>
    </>
  )
}

export default Home
