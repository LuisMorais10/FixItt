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

const CIDADES = ['Niterói', 'Rio de Janeiro', 'São Paulo']

function UploadFoto({ label, id, preview, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div
        style={{ width: '100%', height: '120px', borderRadius: '10px', background: '#e3f2fd', border: '2px dashed #0d47a1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => document.getElementById(id).click()}
      >
        {preview
          ? <img src={preview} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ textAlign: 'center', color: '#0d47a1' }}>
              <div style={{ fontSize: '28px' }}>📎</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '0.72rem', color: '#888' }}>Clique para enviar ou tirar foto</div>
            </div>
        }
      </div>
      <input id={id} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={onChange} />
    </div>
  )
}

export default function CadastroPrestador() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    email: '',
    cep: '',
    cidades: [],
    servicos: [],
    eletrodomesticos: '',
    comentarios: '',
    anos_experiencia: '',
    aceita_contato: false,
    foto: null,
    doc_frente: null,
    doc_verso: null,
    comprovante: null,
  })
  const [previews, setPreviews] = useState({
    foto: null,
    doc_frente: null,
    doc_verso: null,
    comprovante: null,
  })
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [cepValido, setCepValido] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, [field]: file }))
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }))
    }
  }

  const handleCep = async (e) => {
  const cep = e.target.value.replace(/\D/g, '')
  setForm(prev => ({ ...prev, cep }))
  setCepValido(null)

  if (cep.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      setCepValido(!data.erro)
    } catch {
      setCepValido(false)
    }
  }
}

  const toggleCidade = (cidade) => {
    setForm(prev => ({
      ...prev,
      cidades: prev.cidades.includes(cidade)
        ? prev.cidades.filter(c => c !== cidade)
        : [...prev.cidades, cidade]
    }))
  }

  const toggleServico = (valor) => {
    setForm(prev => ({
      ...prev,
      servicos: prev.servicos.includes(valor)
        ? prev.servicos.filter(v => v !== valor)
        : [...prev.servicos, valor]
    }))
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
    payload.append('nome', form.nome)
    payload.append('telefone', form.telefone)
    payload.append('cpf', form.cpf)
    payload.append('email', form.email)
    payload.append('cep', form.cep)
    payload.append('cidade', form.cidades.join(','))
    payload.append('servico', form.servicos.join(','))
    payload.append('eletrodomesticos', form.eletrodomesticos)
    payload.append('comentarios', form.comentarios)
    payload.append('anos_experiencia', form.anos_experiencia)
    payload.append('aceita_contato', form.aceita_contato)
    payload.append('password', senha)
    if (form.foto) payload.append('foto', form.foto)
    if (form.doc_frente) payload.append('doc_frente', form.doc_frente)
    if (form.doc_verso) payload.append('doc_verso', form.doc_verso)
    if (form.comprovante) payload.append('comprovante', form.comprovante)

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

          {/* FOTO DE PERFIL */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <div
              style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#e3f2fd', border: '2px dashed #0d47a1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', marginBottom: '8px' }}
              onClick={() => document.getElementById('fotoInput').click()}
            >
              {previews.foto
                ? <img src={previews.foto} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '28px' }}>📷</span>
              }
            </div>
            <span style={{ fontSize: '0.82rem', color: '#0d47a1', cursor: 'pointer', fontWeight: 600 }} onClick={() => document.getElementById('fotoInput').click()}>
              Adicionar foto
            </span>
            <input id="fotoInput" type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={handleFileChange('foto')} />
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

          <label>E-mail <span style={{ color: '#999', fontSize: '0.8rem' }}>(opcional)</span></label>
          <input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} />

          <label>CEP</label>
          <div style={{ position: 'relative', marginBottom: '18px' }}>
          <input
            name="cep"
            type="text"
            placeholder="00000-000"
            value={form.cep}
            onChange={handleCep}
            maxLength={9}
            style={{ marginBottom: 0, paddingRight: '40px', width: '100%',
            borderColor: cepValido === true ? '#2e7d32' : cepValido === false ? '#c62828' : undefined
            }}
          />
          {cepValido === true && (
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#2e7d32', fontSize: '18px' }}>✓</span>
            )}
          {cepValido === false && (
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#c62828', fontSize: '18px' }}>✗</span>
            )}
          </div>

          <label>Cidade onde realiza atendimentos</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {CIDADES.map(cidade => (
              <label key={cidade} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', fontSize: '0.95rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.cidades.includes(cidade)} onChange={() => toggleCidade(cidade)} style={{ accentColor: '#0d47a1', width: '16px', height: '16px' }} />
                {cidade}
              </label>
            ))}
          </div>

          <label>Qual serviço você oferece?</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {SERVICO_CHOICES.map(s => (
              <label key={s.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', fontSize: '0.95rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.servicos.includes(s.value)} onChange={() => toggleServico(s.value)} style={{ accentColor: '#0d47a1', width: '16px', height: '16px' }} />
                {s.label}
              </label>
            ))}
          </div>

          {form.servicos.includes('eletrodomesticos') && (
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

          <label style={{ marginTop: '8px' }}>Documento (RG/CNH)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <UploadFoto label="Frente" id="docFrente" preview={previews.doc_frente} onChange={handleFileChange('doc_frente')} />
            <UploadFoto label="Verso" id="docVerso" preview={previews.doc_verso} onChange={handleFileChange('doc_verso')} />
          </div>

          <label>Comprovante de residência</label>
          <div style={{ marginBottom: '18px' }}>
            <UploadFoto label="Ex: conta telefônica com endereço" id="comprovante" preview={previews.comprovante} onChange={handleFileChange('comprovante')} />
          </div>

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