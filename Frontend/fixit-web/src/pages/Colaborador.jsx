import "../Styles/global.css"

import colaborador1 from "../Assets/Images/Colaborador_1.png"
import colaborador2 from "../Assets/Images/Colaborador_2.png"
import colaborador3 from "../Assets/Images/Colaborador_3.png"

export default function Colaborador() {

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Inscrição enviada com sucesso!")
  }

  return (
    <div>

      <section className="hero">
        <h1>Trabalhe com a FixIt</h1>
        <p>
          Conecte-se a milhares de clientes e ofereça seus serviços
          com autonomia, segurança e total suporte da nossa equipe.
        </p>
      </section>

      <section className="section">
        <h2>Por que ser um colaborador FixIt?</h2>

        <div className="benefits-grid">

          <div className="card">
            <img src={colaborador1} alt="Ganhos maiores" />
            <h3>Ganhos maiores</h3>
            <p>
              Receba por serviço prestado com remuneração justa
              e repasse imediato.
            </p>
          </div>

          <div className="card">
            <img src={colaborador2} alt="Flexibilidade" />
            <h3>Flexibilidade total</h3>
            <p>
              Monte sua própria agenda e escolha quando
              e onde deseja trabalhar.
            </p>
          </div>

          <div className="card">
            <img src={colaborador3} alt="Mais clientes" />
            <h3>Mais clientes</h3>
            <p>
              A FixIt conecta sua especialidade diretamente
              à demanda da sua região.
            </p>
          </div>

        </div>
      </section>

      <section className="section colaborador-cta">

  <div className="cta-box">

    <h2>Já tenho conta</h2>

    <p>
      Se você já possui cadastro na FixIt, acesse seu portal
      para gerenciar serviços e oportunidades.
    </p>

    <a href="/entrar" className="cta-btn">
      Fazer login no portal
    </a>

  </div>


  <div className="cta-box">

    <h2>Quero ser um colaborador FixIt</h2>

    <p>
      Cadastre-se agora e comece a receber solicitações
      de serviços na sua região.
    </p>

    <a href="/criar-conta" className="cta-btn">
      Inscrever-se agora
    </a>

  </div>

</section>


    </div>
  )
}