import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/user/data/', {
          headers: { Authorization: `Bearer ${user.access}` },
        })
        const data = await res.json()
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMensagem(null)
    setErro(null)

    const payload = {
      first_name: form.first_name,
      email: form.email,
      telefone: form.telefone,
    }

    try {
      const res = await fetch('http://localhost:8000/api/user/data/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify(payload),
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

  if (loading) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Carregando...</p>

  return (
    <div className="login-page">
      <div className="login-box" style={{ maxWidth: '520px' }}>
        <h2>Meus Dados</h2>

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
    </div>
  )
}