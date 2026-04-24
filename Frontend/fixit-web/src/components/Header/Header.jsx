import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoFixit from '../../assets/Images/Logo.png'
import avatarDefault from '../../assets/Images/AvatarPerfil.png'
import { useState } from 'react'
import "./Header.css"

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(false)
  const [destinoModal, setDestinoModal] = useState(null)

  const location = useLocation()
  const prestadorLogado =
    !!localStorage.getItem('access') && location.pathname.startsWith('/colaborador')

  const isActive = (path) => location.pathname === path

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
      <header className="header">
        <nav className="nav-container">

          {/* ESQUERDA — Logo */}
          <div className="nav-left">
            <Link to="/" className="logo-fixit" onClick={(e) => handleNavPortal(e, '/')}>
              <img src={logoFixit} alt="FixIt Logo" />
            </Link>
          </div>

          {/* CENTRO — Links */}
          <div className="nav-center">
            <Link to="/" className={`nav-link${isActive('/') ? ' nav-link-active' : ''}`} onClick={(e) => handleNavPortal(e, '/')}>Início</Link>
            <Link to="/faxina" className={`nav-link${isActive('/faxina') ? ' nav-link-active' : ''}`} onClick={(e) => handleNavPortal(e, '/faxina')}>Serviços</Link>
            <Link to="/sobre" className={`nav-link${isActive('/sobre') ? ' nav-link-active' : ''}`} onClick={(e) => handleNavPortal(e, '/sobre')}>Sobre</Link>
            <Link to="/como-funciona" className={`nav-link${isActive('/como-funciona') ? ' nav-link-active' : ''}`} onClick={(e) => handleNavPortal(e, '/como-funciona')}>Como funciona</Link>
            <Link to="/contato" className={`nav-link${isActive('/contato') ? ' nav-link-active' : ''}`} onClick={(e) => handleNavPortal(e, '/contato')}>Contato</Link>
          </div>

          {/* DIREITA — Ações */}
          <div className="nav-right">

            {/* NÃO LOGADO */}
            {!user && !prestadorLogado && (
              <div className="nav-actions">
                {/* Portal do colaborador — outline (branco c/ borda azul, hover vira azul) */}
                <Link to="/colaborador" className="hdr-btn-outline">
                  Portal do colaborador
                </Link>
                {/* Entrar — azul sólido */}
                <Link to="/entrar" className="hdr-btn-primary">
                  Entrar
                </Link>
                {/* Criar conta — azul sólido (idêntico ao Entrar) */}
                <Link to="/criar-conta" className="hdr-btn-primary">
                  Criar conta
                </Link>
              </div>
            )}

            {/* USUÁRIO LOGADO */}
            {user && (
              <div className="user-area">
                <img
                  src={avatarDefault}
                  alt="Avatar"
                  className="avatar"
                  onClick={() => setOpen(!open)}
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

            {/* PRESTADOR LOGADO */}
            {prestadorLogado && !user && (
              <div className="nav-actions">
                <button
                  className="hdr-btn-outline"
                  onClick={() => { setDestinoModal('/'); setModal(true) }}
                >
                  Sair do portal
                </button>
              </div>
            )}

          </div>
        </nav>
      </header>

      {/* MODAL SAÍDA DO PORTAL */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: '380px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <span onClick={() => setModal(false)} style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#888', fontWeight: 700, lineHeight: 1 }}>✕</span>
            </div>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🚪</div>
            <h3 style={{ color: '#0d47a1', marginBottom: '10px' }}>Tem certeza que deseja sair?</h3>
            <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '24px' }}>
              Você será desconectado do portal do colaborador.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setModal(false)} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', color: '#555', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                Cancelar
              </button>
              <button onClick={confirmarSaida} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#d32f2f', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}