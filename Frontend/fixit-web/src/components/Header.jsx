import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoFixit from '../assets/Images/Logo.png'
import avatarDefault from '../assets/Images/AvatarPerfil.png'
import { useState } from 'react'


export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(false)
  const [destinoModal, setDestinoModal] = useState(null)
  
  const location = useLocation()
  const prestadorLogado = !!localStorage.getItem('access') && location.pathname.startsWith('/colaborador')

  const handleNavPortal = (e, destino) => {
    if (prestadorLogado) {
      e.preventDefault()
      setDestinoModal(destino)
      setModal(true)
    }
  }
 
  const confirmarSaida = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('prestador_nome')
    setModal(false)
    navigate(destinoModal)
  }


  return (
    <>
      <header>
        <nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
 
            {/* LOGO */}
            <Link
              to="/"
              className="logo-fixit"
              onClick={(e) => handleNavPortal(e, '/')}
            >
              <img src={logoFixit} alt="FixIt Logo" />
            </Link>
 
            {/* 🔹 NÃO LOGADO */}
            {!user && !prestadorLogado && (
              <div className="top-buttons">
                <Link to="/entrar">Entrar</Link>
                <Link to="/criar-conta">Criar Conta</Link>
              </div>
            )}
 
            {/* 🔹 LOGADO */}
            {user && (
              <div className="user-area">
                <img
                  src={avatarDefault}
                  alt="Avatar do usuário"
                  className="avatar"
                  onClick={() => setOpen(!open)}
                  style={{ cursor: 'pointer' }}
                />
                {open && (
                  <div className="dropdown-menu">
                    <span onClick={() => { navigate('/dados'); setOpen(false) }}>Dados</span>
                    <span onClick={() => { navigate('/meus-pedidos'); setOpen(false) }}>Meus pedidos</span>
                    <span onClick={() => { navigate('/Suporte'); setOpen(false) }}>Ajude-me</span>
                    <hr />
                    <span className="logout" onClick={() => { logout(); navigate('/'); setOpen(false) }}>Sair</span>
                  </div>
                )}
              </div>
            )}
          </div>
 
          <div className="nav-right">
            <Link className="nav-btn" to="/clube" onClick={(e) => handleNavPortal(e, '/clube')}>Faça parte do clube</Link>
            <Link className="nav-btn" to="/sobre" onClick={(e) => handleNavPortal(e, '/sobre')}>Sobre nós</Link>
            {!user && (
              <Link className="nav-btn" to="/colaborador" onClick={(e) => handleNavPortal(e, '/colaborador')}>Portal do colaborador</Link>
            )}
          </div>
        </nav>
      </header>
 
      {/* MODAL SAÍDA DO PORTAL */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: '380px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <span
                onClick={() => setModal(false)}
                style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#888', fontWeight: 700, lineHeight: 1 }}
              >✕</span>
            </div>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🚪</div>
            <h3 style={{ color: '#0d47a1', marginBottom: '10px' }}>Tem certeza que deseja sair?</h3>
            <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '24px' }}>
              Você será desconectado do portal do colaborador.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setModal(false)}
                style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', color: '#555', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarSaida}
                style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#d32f2f', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}