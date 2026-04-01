import { useEffect, useState } from 'react'
import { authFetch } from '../services/api'

const SERVICO_LABELS = {
  faxina_residencial: 'Faxina Residencial',
  faxina_empresarial: 'Faxina Empresarial',
  hotelaria: 'Apoio a Redes Hoteleiras',
  mudanca: 'Mudança',
  eletrodomesticos: 'Técnico de Eletrodomésticos',
  eletricista: 'Eletricista',
  servicos_gerais: 'Serviços Gerais',
}

function StarRating({ value }) {
  return (
    <div className="perfil-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  )
}

export default function PerfilColaborador() {
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  const avaliacaoMock = 4.0

  useEffect(() => {
  authFetch('http://127.0.0.1:8000/api/prestador/me/')
    .then(res => res.json())
    .then(data => setPerfil(data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false))
}, [])

  if (loading) return <p style={{ textAlign: 'center', paddingTop: '100px' }}>Carregando...</p>
  if (!perfil) return <p style={{ textAlign: 'center', paddingTop: '100px' }}>Perfil não encontrado.</p>

  const iniciais = perfil.nome
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="perfil-page">
      <div className="perfil-card">

        <div className="perfil-header">
          <div className="perfil-avatar">
            {perfil.foto
              ? <img src={perfil.foto} alt="foto" />
              : iniciais}
          </div>
          <div>
            <h2 className="perfil-nome">{perfil.nome}</h2>
            <span className="perfil-badge">
              {SERVICO_LABELS[perfil.servico] || perfil.servico}
            </span>
          </div>
        </div>

        <hr className="perfil-divider" />

        <div className="perfil-stats">
          <div className="perfil-stat-card">
            <span className="perfil-stat-label">Avaliação</span>
            <StarRating value={avaliacaoMock} />
            <span className="perfil-stat-sub">{avaliacaoMock.toFixed(1)} / 5</span>
          </div>
          <div className="perfil-stat-card">
            <span className="perfil-stat-label">Serviços</span>
            <span className="perfil-stat-value">{perfil.total_servicos ?? 0}</span>
            <span className="perfil-stat-sub">concluídos</span>
          </div>
          <div className="perfil-stat-card">
            <span className="perfil-stat-label">Experiência</span>
            <span className="perfil-stat-value">{perfil.anos_experiencia}</span>
            <span className="perfil-stat-sub">anos</span>
          </div>
        </div>

        <hr className="perfil-divider" />

        {[
          { label: 'Telefone', value: perfil.telefone },
          { label: 'E-mail', value: perfil.email },
          { label: 'Cidade', value: perfil.cidade },
        ].map(({ label, value }) => (
          <div key={label} className="perfil-info-row">
            <span className="perfil-info-label">{label}</span>
            <span className="perfil-info-value">{value || '—'}</span>
          </div>
        ))}

      </div>
    </div>
  )
}