import { useNavigate } from 'react-router-dom'
import "./PortalColaborador.css"
import clientesImg1 from '../../assets/Images/SolicitacoesDisponiveis.png'
import clientesImg2 from '../../assets/Images/MeusAgendamentos.png'
import carteiraImg from '../../assets/Images/CarteiraPrestador.png'
import perfilImg from '../../assets/Images/PerfilPrestador.png'
import continueImg from '../../assets/Images/PortalPrestadorCA.png'

export default function PortalColaborador() {
  const navigate = useNavigate()
  const nome = localStorage.getItem('prestador_nome') || 'Colaborador'

  return (
    <main className="portal-container">

      {/* HEADER DA PÁGINA */}
      <section className="portal-header">
        <h1>Olá, {nome}</h1>
        <p>Gerencie seus serviços e acompanhe seus agendamentos</p>
        <div className="divider"></div>
      </section>

      <section className="portal-grid">

    {/* SOLICITAÇÕES */}
     <div
    className="portal-card"
    onClick={() => navigate('/colaborador/solicitacoes')}
  >
    <div className="card-image">
      <img src={clientesImg1} alt="" />
      <div className="image-overlay"></div>
    </div>

    <div className="card-content">
      <h3>Solicitações disponíveis</h3>
      <p>Novos pedidos na sua região</p>
    </div>
  </div>

  {/* AGENDAMENTOS */}
  <div
    className="portal-card"
    onClick={() => navigate('/colaborador/agendamentos')}
  >
    <div className="card-image">
      <img src={clientesImg2} alt="" />
      <div className="image-overlay"></div>
    </div>

    <div className="card-content">
      <h3>Meus agendamentos</h3>
      <p>Gerencie sua agenda</p>
    </div>
  </div>

  {/* CARTEIRA */}
  <div
    className="portal-card"
    onClick={() => navigate('/colaborador/carteira')}
  >
    <div className="card-image">
      <img src={carteiraImg} alt="" />
      <div className="image-overlay"></div>
    </div>

    <div className="card-content">
      <h3>Carteira</h3>
      <p>Seus ganhos e saques</p>
    </div>
  </div>

  {/* PERFIL */}
  <div
    className="portal-card"
    onClick={() => navigate('/colaborador/perfil')}
  >
    <div className="card-image">
      <img src={perfilImg} alt="" />
      <div className="image-overlay"></div>
    </div>

    <div className="card-content">
      <h3>Perfil</h3>
      <p>Suas informações</p>
    </div>
  </div>

</section>


    </main>
  )
}