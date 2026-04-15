import { useEffect, useState } from 'react'
import { authFetch } from '../services/api'

function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatData(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR')
}

const STATUS_LABELS = {
  completed: 'Concluído',
  pending:   'Pendente',
  canceled:  'Cancelado',
}

export default function CarteiraPrestador() {
  const [carteira, setCarteira]       = useState(null)
  const [extrato, setExtrato]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [modalSaque, setModalSaque]   = useState(false)
  const [valorSaque, setValorSaque]   = useState('')
  const [sacando, setSacando]         = useState(false)
  const [msgSaque, setMsgSaque]       = useState(null)
  const [erroSaque, setErroSaque]     = useState(null)

  useEffect(() => {
    Promise.all([
      authFetch('http://127.0.0.1:8000/api/carteira/').then((r) => r.json()),
      authFetch('http://127.0.0.1:8000/api/carteira/extrato/').then((r) => r.json()),
    ])
      .then(([carteiraData, extratoData]) => {
        setCarteira(carteiraData)
        setExtrato(extratoData.extrato || [])
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  async function handleSaque(e) {
    e.preventDefault()
    setSacando(true)
    setMsgSaque(null)
    setErroSaque(null)

    const valor = parseFloat(valorSaque.replace(',', '.'))

    if (!valor || valor <= 0) {
      setErroSaque('Informe um valor válido.')
      setSacando(false)
      return
    }

    if (valor > parseFloat(carteira?.saldo_disponivel || 0)) {
      setErroSaque('Valor maior que o saldo disponível.')
      setSacando(false)
      return
    }

    try {
      const res = await authFetch('http://127.0.0.1:8000/api/carteira/sacar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor }),
      })

      const data = await res.json()

      if (res.ok) {
        setMsgSaque('Solicitação de saque enviada com sucesso!')
        setCarteira((prev) => ({
          ...prev,
          saldo_disponivel: (parseFloat(prev.saldo_disponivel) - valor).toFixed(2),
        }))
        setValorSaque('')
        setTimeout(() => setModalSaque(false), 2000)
      } else {
        setErroSaque(data.error || 'Erro ao solicitar saque.')
      }
    } catch {
      setErroSaque('Erro de conexão.')
    } finally {
      setSacando(false)
    }
  }

  if (loading)
    return <p style={{ textAlign: 'center', paddingTop: '100px' }}>Carregando...</p>

  return (
    <div className="perfil-page" style={{ maxWidth: '600px' }}>

      {/* ── Cabeçalho ── */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#0d47a1', margin: '0 0 4px', fontSize: '22px' }}>
          Carteira FixIt
        </h2>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Seus ganhos e histórico de pagamentos
        </p>
      </div>

      {/* ── Cards de saldo ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {/* Saldo disponível */}
        <div
          style={{
            background: '#0d47a1',
            borderRadius: '16px',
            padding: '20px',
            gridColumn: '1 / -1',
          }}
        >
          <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Saldo disponível
          </p>
          <p style={{ margin: '0 0 16px', fontSize: '32px', fontWeight: 700, color: '#fff' }}>
            {formatBRL(carteira?.saldo_disponivel || 0)}
          </p>
          <button
            onClick={() => { setModalSaque(true); setMsgSaque(null); setErroSaque(null) }}
            disabled={parseFloat(carteira?.saldo_disponivel || 0) <= 0}
            style={{
              background: parseFloat(carteira?.saldo_disponivel || 0) > 0 ? '#fff' : 'rgba(255,255,255,0.3)',
              color: parseFloat(carteira?.saldo_disponivel || 0) > 0 ? '#0d47a1' : 'rgba(255,255,255,0.5)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 24px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: parseFloat(carteira?.saldo_disponivel || 0) > 0 ? 'pointer' : 'not-allowed',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => { if (parseFloat(carteira?.saldo_disponivel || 0) > 0) e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)' }}
          >
            Solicitar saque
          </button>
        </div>

        {/* Total recebido */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e3edf9',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Total recebido
          </p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#2e7d32' }}>
            {formatBRL(carteira?.total_recebido || 0)}
          </p>
        </div>

        {/* Total sacado */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e3edf9',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Total sacado
          </p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1565c0' }}>
            {formatBRL(carteira?.total_sacado || 0)}
          </p>
        </div>
      </div>

      {/* ── Extrato ── */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e3edf9',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e3edf9',
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, color: '#0d47a1', fontSize: '15px' }}>
            Extrato
          </p>
        </div>

        {extrato.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>
              Nenhuma movimentação ainda.
            </p>
          </div>
        ) : (
          <div>
            {extrato.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 20px',
                  borderBottom: idx < extrato.length - 1 ? '1px solid #f0f4fb' : 'none',
                }}
              >
                {/* Tipo + descrição */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: item.tipo === 'saque' ? '#fff3e0' : '#e8f5e9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '16px',
                    }}
                  >
                    {item.tipo === 'saque' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: '#333' }}>
                      {item.tipo === 'saque'
                        ? 'Saque solicitado'
                        : `Serviço #${item.order_id}`}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                      {formatData(item.data)}
                      {item.tipo !== 'saque' && item.status && (
                        <span
                          style={{
                            marginLeft: '8px',
                            background: '#e8f5e9',
                            color: '#2e7d32',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '20px',
                          }}
                        >
                          {STATUS_LABELS[item.status] || item.status}
                        </span>
                      )}
                      {item.tipo === 'saque' && item.status_saque && (
                        <span
                          style={{
                            marginLeft: '8px',
                            background: item.status_saque === 'aprovado' ? '#e8f5e9' : '#fff8e1',
                            color: item.status_saque === 'aprovado' ? '#2e7d32' : '#ef6c00',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '20px',
                          }}
                        >
                          {item.status_saque === 'aprovado' ? 'Aprovado' : 'Pendente'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Valor */}
                <p
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: item.tipo === 'saque' ? '#c62828' : '#2e7d32',
                    flexShrink: 0,
                  }}
                >
                  {item.tipo === 'saque' ? '- ' : '+ '}
                  {formatBRL(item.valor)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal de saque ── */}
      {modalSaque && (
        <div
          className="modal-overlay"
          onClick={() => setModalSaque(false)}
        >
          <div
            className="modal-content"
            style={{ maxWidth: '400px', width: '92%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: '#0d47a1', marginBottom: '4px', fontSize: '18px' }}>
              Solicitar saque
            </h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Disponível:{' '}
              <strong style={{ color: '#2e7d32' }}>
                {formatBRL(carteira?.saldo_disponivel || 0)}
              </strong>
            </p>

            {/* Dados bancários do prestador */}
            {carteira?.dados_bancarios && (
              <div
                style={{
                  background: '#f8fbff',
                  border: '1px solid #e3edf9',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  fontSize: '13px',
                  color: '#555',
                }}
              >
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#0d47a1', fontSize: '13px' }}>
                  Destino do saque
                </p>
                {carteira.dados_bancarios.chave_pix ? (
                  <p style={{ margin: 0 }}>
                    PIX: <strong>{carteira.dados_bancarios.chave_pix}</strong>
                    {' '}({carteira.dados_bancarios.tipo_pix})
                  </p>
                ) : (
                  <p style={{ margin: 0 }}>
                    {carteira.dados_bancarios.banco} — Ag. {carteira.dados_bancarios.agencia} / CC {carteira.dados_bancarios.conta}
                  </p>
                )}
              </div>
            )}

            {msgSaque && (
              <p style={{ color: '#2e7d32', background: '#e8f5e9', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', textAlign: 'center' }}>
                {msgSaque}
              </p>
            )}
            {erroSaque && (
              <p style={{ color: '#c62828', background: '#ffebee', padding: '10px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', textAlign: 'center' }}>
                {erroSaque}
              </p>
            )}

            <form onSubmit={handleSaque}>
              <label style={{ display: 'block', fontWeight: 600, color: '#0d47a1', fontSize: '14px', marginBottom: '6px' }}>
                Valor do saque (R$)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={valorSaque}
                onChange={(e) => setValorSaque(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cfd8dc',
                  fontSize: '16px',
                  marginBottom: '16px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0d47a1'
                  e.target.style.boxShadow = '0 0 0 2px rgba(13,71,161,0.15)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cfd8dc'
                  e.target.style.boxShadow = 'none'
                }}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalSaque(false)}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    borderRadius: '10px',
                    border: '2px solid #0d47a1',
                    background: 'transparent',
                    color: '#0d47a1',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sacando}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0d47a1',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: sacando ? 'not-allowed' : 'pointer',
                    opacity: sacando ? 0.7 : 1,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => { if (!sacando) e.target.style.background = '#08306b' }}
                  onMouseLeave={(e) => { if (!sacando) e.target.style.background = '#0d47a1' }}
                >
                  {sacando ? 'Enviando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}