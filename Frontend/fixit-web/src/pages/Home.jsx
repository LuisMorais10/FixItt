import Eletricista from "../assets/Images/Eletricista.png"
import Eletrodomestico from "../assets/Images/Eletrodomestico.png"
import Hotel from "../assets/Images/Hotel.png"
import Residencial from "../assets/Images/Residencial.png"
import Empresarial from "../assets/Images/Empresarial.png"
import Servicos_gerais from "../assets/Images/Servicos_gerais.png"
import Mudanca from "../assets/Images/Mudanca.png"
import Clube from "../assets/Images/Clube.png"


function Home() {
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

      <section className="services">
        <h2>Nossos Serviços</h2>

        <div className="services-grid">
          <div className="service-card">
            <img src={Eletricista} alt="Eletricista" />
            <h3>Eletricista</h3>
            <p>Serviços elétricos com segurança e qualidade, desde instalações até reparos.</p>
          </div>

          <div className="service-card">
            <img src={Eletrodomestico} alt="Eletrodoméstico" />
            <h3>Técnico de Eletrodomésticos</h3>
            <p>Conserto e manutenção de geladeiras, fogões, máquinas de lavar e mais.</p>
          </div>

          <div className="service-card">
            <img src={Hotel} alt="Hotel" />
            <h3>Apoio a Redes Hoteleiras</h3>
            <p>Equipe treinada para limpeza de quartos, recepções e áreas comuns de hotéis.</p>
          </div>

          <div className="service-card">
            <img src={Residencial} alt="Residencial" />
            <h3>Faxina Residencial</h3>
            <p>Limpeza completa em casas, apartamentos e condomínios. Conforto e bem-estar para seu lar.</p>
          </div>

          <div className="service-card">
            <img src={Empresarial} alt="Empresarial" />
            <h3>Faxina Empresarial</h3>
            <p>Limpeza profissional em escritórios, consultórios e estabelecimentos comerciais.</p>
          </div>

          <div className="service-card">
            <img src={Servicos_gerais} alt="Serviços Gerais" />
            <h3>Serviços Gerais</h3>
            <p>Manutenções diversas, pequenos reparos e o que mais você precisar para seu espaço.</p>
          </div>

          <div className="service-card">
            <img src={Mudanca} alt="Mudança" />
            <h3>Caminhão de mudança</h3>
            <p>Transporte seguro e eficiente para mudanças residenciais e comerciais.</p>
          </div>

          <div className="service-card">
            <img src={Clube} alt="Clube" />
            <h3>Clube FixIt</h3>
            <p>Aproveite os melhores serviços por um valor mensal.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
