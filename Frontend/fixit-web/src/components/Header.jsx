import { Link } from 'react-router-dom'
import logoFixit from '../assets/Images/Logo.png'

export default function Header() {
  return (
    <header>
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          <Link to="/" className="logo-fixit">
            <img src={logoFixit} alt="FixIt Logo" />
          </Link>

          <div className="top-buttons">
            <Link to="/entrar">Entrar</Link>
            <Link to="/criar-conta">Criar Conta</Link>
          </div>

        </div>

        <div className="nav-right">
          <Link className="nav-btn" to="/clube">Faça parte do clube</Link>
          <Link className="nav-btn" to="/sobre">Sobre nós</Link>
          <Link className="nav-btn" to="/seja-colaborador">Seja um colaborador</Link>

          <div className="dropdown"></div>
        </div>
      </nav>
    </header>
  )
}



  
