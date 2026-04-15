import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ReputacaoInfoModal from "../components/ReputacaoInfoModal"

export default function Dados() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    first_name: '',
    email: '',
    telefone: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mensagem, setMensagem] = useState(null)
  const [erro, setErro] = useState(null)
  const [mediaAval, setMediaAval] = useState(null)
  const [totalAval, setTotalAval] = useState(0)
  const [userId, setUserId] = useState(null)
  const [foto, setFoto] = useState(null)
  const [previewFoto, setPreviewFoto] = useState(null)
  const [showInfo, setShowInfo] = useState(false)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/user/data/', {
          headers: { Authorization: `Bearer ${user.access}` },
        })
        const data = await res.json()
        setUserId(data.id)
        setForm({
          first_name: data.first_name || data.username || '',
          email: data.email || '',
          telefone: data.telefone || '',
        })
      } catch {
        setErro('Erro ao carregar dados.')
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchData()
  }, [user])

  useEffect(() => {
    if (!userId || !user) return

    const fetchAvaliacoes = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/orders/my/', {
          headers: { Authorization: `Bearer ${user.access}` },
        })
        const orders = await res.json()
        const completed = orders.filter((o) => o.status === 'completed')

        const promises = completed.map((o) =>
          fetch(`http://localhost:8000/api/avaliacoes/order/${o.id}/recebidas/`, {
            headers: { Authorization: `Bearer ${user.access}` },
          })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )

        const resultados = await Promise.all(promises)
        const todasAval = resultados
          .filter(Boolean)
          .flatMap((r) => r.avaliacoes || [])

        setTotalAval(todasAval.length)

        if (todasAval.length > 0) {
          const soma = todasAval.reduce((acc, a) => acc + a.nota, 0)
          setMediaAval((soma / todasAval.length).toFixed(1))
        }
      } catch {
        // silencia erros de avaliação
      }
    }

    fetchAvaliacoes()
  }, [userId, user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFoto(file)
      setPreviewFoto(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMensagem(null)
    setErro(null)

    try {
      const res = await fetch('http://localhost:8000/api/user/data/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          first_name: form.first_name,
          email: form.email,
          telefone: form.telefone,
        }),
      })

      if (res.ok) {
        setMensagem('Dados atualizados com sucesso!')
      } else {
        setErro('Erro ao salvar. Tente novamente.')
      }
    } catch {
      setErro('Erro de conexão.')
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: '100px' }}>Carregando...</p>

  const temAvaliacao = totalAval > 0

  return (
    <div className="login-page">
      <div className="login-box" style={{ maxWidth: '520px' }}>
        <h2>Meus Dados</h2>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            onClick={() => document.getElementById('fotoUserInput').click()}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '2px dashed #0d47a1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              cursor: 'pointer',
              overflow: 'hidden',
              background: '#f5f5f5'
            }}
          >
            {previewFoto ? (
              <img
                src={previewFoto}
                alt="Foto"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '26px' }}>📷</span>
            )}
          </div>

          <p
            style={{
              color: '#0d47a1',
              fontSize: '0.9rem',
              marginTop: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => document.getElementById('fotoUserInput').click()}
          >
            Adicionar foto
          </p>

          <input
            id="fotoUserInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFotoChange}
          />
        </div>

        {/* ── Reputação ── */}
        <div
          style={{
            background: '#f8fbff',
            border: '1px solid #e3edf9',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
          }}
        >
          <span
            className="info-icon"
            onClick={() => setShowInfo(true)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px'
            }}
            title="Informações sobre sua reputação"
          >
            i
          </span>

          <div style={{ flexShrink: 0, textAlign: 'center' }}>
          </div>

          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            {temAvaliacao ? (
              <>
                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      style={{
                        fontSize: '20px',
                        color: n <= Math.round(parseFloat(mediaAval)) ? '#EF9F27' : '#ccc',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#EF9F27', fontWeight: 600 }}>
                  {mediaAval} / 5
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#888' }}>
                  {totalAval} {totalAval === 1 ? 'avaliação' : 'avaliações'}
                </p>
              </>
            ) : (
              <span
                style={{
                  display: 'inline-block',
                  background: '#e3f2fd',
                  color: '#0d47a1',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1.5px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                }}
              >
                NOVO
              </span>
            )}
          </div>

          <div style={{ width: '1px', height: '44px', background: '#dce8f7', flexShrink: 0 }} />

          <div>
            <p style={{ margin: 0, fontWeight: 600, color: '#0d47a1', fontSize: '14px' }}>
              {temAvaliacao ? 'Sua reputação' : 'Sem avaliações ainda'}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#666' }}>
              {temAvaliacao
                ? 'Nota média baseada nas avaliações dos prestadores.'
                : 'Sua nota aparecerá aqui após o primeiro serviço concluído.'}
            </p>
          </div>
        </div>

        {mensagem && (
          <p style={{ color: '#2e7d32', background: '#e8f5e9', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
            {mensagem}
          </p>
        )}
        {erro && (
          <p style={{ color: '#c62828', background: '#ffebee', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
            {erro}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Nome</label>
          <input
            name="first_name"
            type="text"
            placeholder="Nome"
            value={form.first_name}
            onChange={handleChange}
          />

          <label>E-mail</label>
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
          />

          <label>Telefone</label>
          <input
            name="telefone"
            type="tel"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
          />

          <button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
      {showInfo && <ReputacaoInfoModal onClose={() => setShowInfo(false)} />}
    </div>
  )
}