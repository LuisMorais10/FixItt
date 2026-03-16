import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const SERVICO_CHOICES = [
  { value: 'faxina_residencial', label: 'Faxina Residencial' },
  { value: 'faxina_empresarial', label: 'Faxina Empresarial' },
  { value: 'hotelaria', label: 'Apoio a Redes Hoteleiras' },
  { value: 'mudanca', label: 'Mudança' },
  { value: 'eletrodomesticos', label: 'Técnico de Eletrodomésticos' },
  { value: 'eletricista', label: 'Eletricista' },
  { value: 'servicos_gerais', label: 'Serviços Gerais' },
]

export default function CadastroPrestador() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    email: '',
    cep: '',
    cidade: '',
    servico: '',
    eletrodomesticos: '',
    comentarios: '',
    anos_experiencia: '',
    aceita_contato: false,
    foto: null,
  })
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, foto: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleCep = async (e) => {
    const cep = e.target.value.replace(/\D/g, '')
    setForm(prev => ({ ...prev, cep }))
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setForm(prev => ({ ...prev, cidade: data.localidade }))
        }
      } catch {}
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(null)

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setSalvando(true)

    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        payload.append(key, value)
      }
    })
    payload.append('password', senha)

    try {
      const res = await fetch('http://localhost:8000/api/prestador/register/', {
        method: 'POST',
        body: payload,
      })

      if (res.ok) {
        navigate('/colaborador/cadastro-enviado')
      } else {
        const data = await res.json()
        const firstError = Object.values(data)[0]
        setErro(Array.isArray(firstError) ? firstError[0] : 'Erro ao cadastrar. Verifique os campos.')
      }
    } catch {
      setErro('Erro de conexão com o servidor.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="login-page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="login-box" style={{ maxWidth: '560px' }}>
        <h2>Cadastro de Prestador</h2>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center' }}>
          Preencha seus dados para fazer parte da nossa equipe
        </p>

        {erro && (
          <p style={{ color: '#c62828', background: '#ffebee', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
            {erro}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <div
              style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#e3f2fd', border: '2px dashed #0d47a1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', marginBottom: '8px' }}
              onClick={() => document.getElementById('fotoInput').click()}
            >
              {preview
                ? <img src={preview} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '28px' }}>📷</span>
              }
            </div>
            <span style={{ fontSize: '0.82rem', color: '#0d47a1', cursor: 'pointer', fontWeight: 600 }} onClick={() => document.getElementById('fotoInput').click()}>
              Adicionar foto
            </span>
            <input id="fotoInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} />
          </div>

          <label>Nome completo</label>
          <input name="nome" type="text" placeholder="Seu nome completo" value={form.nome} onChange={handleChange} required />

          <label>Telefone / WhatsApp</label>
          <PhoneInput
            country="br"
            value={form.telefone}
            onChange={(val) => setForm(prev => ({ ...prev, telefone: val }))}
            inputStyle={{ width: '100%', height: '44px', fontSize: '14px' }}
            buttonStyle={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}
            containerStyle={{ marginBottom: '18px' }}
          />

          <label>CPF</label>
          <input name="cpf" type="text" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} required />

          <label>E-mail</label>
          <input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />

          <label>CEP</label>
          <input name="cep" type="text" placeholder="00000-000" value={form.cep} onChange={handleCep} required maxLength={9} />

          <label>Cidade onde realiza atendimentos</label>
          <input name="cidade" type="text" placeholder="Cidade" value={form.cidade} onChange={handleChange} required />

          <label>Qual serviço você oferece?</label>
          <select name="servico" value={form.servico} onChange={handleChange} required
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '18px', fontSize: '0.95rem' }}
          >
            <option value="">Selecione um serviço</option>
            {SERVICO_CHOICES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {form.servico === 'eletrodomesticos' && (
            <>
              <label>Quais eletrodomésticos você conserta?</label>
              <input name="eletrodomesticos" type="text" placeholder="Ex: geladeira, máquina de lavar, fogão..." value={form.eletrodomesticos} onChange={handleChange} />
            </>
          )}

          <label>Comentários sobre o serviço prestado</label>
          <textarea
            name="comentarios"
            placeholder="Descreva sua experiência, diferenciais, etc."
            value={form.comentarios}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '18px', fontSize: '0.95rem', resize: 'vertical' }}
          />

          <label>Anos de experiência</label>
          <input name="anos_experiencia" type="number" min="0" max="60" placeholder="Ex: 5" value={form.anos_experiencia} onChange={handleChange} required />

          <label>Senha de acesso ao portal</label>
          <input type="password" placeholder="Crie uma senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />

          <label>Confirmar senha</label>
          <input type="password" placeholder="Confirme sua senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px', marginTop: '4px' }}>
            <input name="aceita_contato" type="checkbox" checked={form.aceita_contato} onChange={handleChange} style={{ marginTop: '3px', accentColor: '#0d47a1', width: '16px', height: '16px' }} />
            <label style={{ fontSize: '0.9rem', color: '#444', fontWeight: 'normal', cursor: 'pointer' }}>
              Concordo que a FixIt pode entrar em contato via E-mail e/ou WhatsApp
            </label>
          </div>

          <button type="submit" disabled={salvando}>
            {salvando ? 'Enviando...' : 'Enviar cadastro'}
          </button>

        </form>
      </div>
    </div>
  )
}