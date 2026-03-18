import { useNavigate } from 'react-router-dom'
import clientesImg1 from '../assets/Images/Colaborador_1.png'
import clientesImg2 from '../assets/Images/Colaborador_2.png'
import carteiraImg from '../assets/Images/Clube.png'
import perfilImg from '../assets/Images/Eletricista.png'

export default function PortalColaborador() {
  const navigate = useNavigate()
  const nome = localStorage.getItem('prestador_nome') || 'Colaborador'

  return (
    <div style={{ paddingTop: '80px' }}>

      <section className="hero">
        <h1>Bem-vindo, {nome}!</h1>
        <p>Gerencie seus serviços e acompanhe seus agendamentos</p>
      </section>

      <section className="services">
        <h2>Portal do Colaborador</h2>

        <div className="services-grid" style={{ flexWrap: 'wrap' }}>

          {/* SOLICITAÇÕES DISPONÍVEIS */}
          <div
            className="service-card clickable"
            onClick={() => navigate('/colaborador/solicitacoes')}
          >
            <img src={clientesImg1} alt="Solicitações disponíveis" style={{ width: '100%', height: '400px', objectFit: 'cover', objectPosition: 'center' }} />
            <h3>Solicitações disponíveis</h3>
            <p>Veja os pedidos de serviço disponíveis na sua região e aceite novos clientes.</p>
          </div>

          {/* MEUS AGENDAMENTOS */}
          <div
            className="service-card clickable"
            onClick={() => navigate('/colaborador/agendamentos')}
          >
            <img src={clientesImg2} alt="Meus agendamentos" style={{ width: '100%', height: '400px', objectFit: 'cover', objectPosition: 'center' }} />
            <h3>Meus agendamentos</h3>
            <p>Acompanhe os serviços que você aceitou e gerencie sua agenda de atendimentos.</p>
          </div>

          {/* CARTEIRA FIXIT */}
          <div
            className="service-card clickable"
            onClick={() => navigate('/colaborador/carteira')}
          >
            <img src={carteiraImg} alt="Carteira FixIt" style={{ width: '100%', height: '400px', objectFit: 'cover', objectPosition: 'center' }} />
            <h3>Carteira FixIt</h3>
            <p>Visualize seus ganhos, histórico de pagamentos e solicite saques.</p>
          </div>

          <div
            className="service-card clickable"
            onClick={() => navigate('/colaborador/perfil')}
        >
            <img src={perfilImg} alt="Perfil" style={{ width: '100%', height: '400px', objectFit: 'cover', objectPosition: 'center' }} />
            <h3>Perfil</h3>
            <p>Visualize e edite suas informações pessoais e de serviço.</p>
        </div>

        </div>
      </section>

    </div>
  )
}