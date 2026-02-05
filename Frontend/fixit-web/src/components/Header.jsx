import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoFixit from '../assets/Images/Logo.png'
import avatarDefault from '../assets/Images/AvatarPerfil.png'
import { useState } from 'react'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <header>
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          <Link to="/" className="logo-fixit">
            <img src={logoFixit} alt="FixIt Logo" />
          </Link>

          {/* 🔹 NÃO LOGADO */}
          {!user && (
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
        <span onClick={() => {
          navigate('/dados')
          setOpen(false)
        }}>
          Dados
        </span>

        <span onClick={() => {
          navigate('/meus-pedidos')
          setOpen(false)
        }}>
          Meus pedidos
        </span>

        <span onClick={() => {
          navigate('/metodos-pagamento')
          setOpen(false)
        }}>
          Métodos de pagamento
        </span>

        <hr />

        <span
          className="logout"
          onClick={() => {
            logout()
            navigate('/')
            setOpen(false)
          }}
        >
          Sair
        </span>
      </div>
    )}
  </div>
)}
        </div>

        <div className="nav-right">
          <Link className="nav-btn" to="/clube">Faça parte do clube</Link>
          <Link className="nav-btn" to="/sobre">Sobre nós</Link>
          <Link className="nav-btn" to="/seja-colaborador">Portal do colaborador</Link>
        </div>
      </nav>
    </header>
  )
}
