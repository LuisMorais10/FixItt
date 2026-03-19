import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const passos = [
  {
    numero: '1º PASSO',
    titulo: 'Preencha as informações do serviço',
    descricao: 'Informe o tipo de serviço, os detalhes do local e o endereço de atendimento.',
    conteudo: (
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 24px rgba(13,71,161,0.10)', maxWidth: '340px', width: '100%' }}>
        <p style={{ color: '#0d47a1', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Preencha as informações abaixo</p>
        {['Tipo de serviço', 'Casa ou Apartamento', 'Número de Quartos', 'CEP'].map(campo => (
          <div key={campo} style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.78rem', color: '#0d47a1', fontWeight: 600, marginBottom: '4px' }}>{campo}</div>
            <div style={{ height: '36px', borderRadius: '8px', border: '1px solid #cfd8e3', background: '#f8fbff' }} />
          </div>
        ))}
      </div>
    )
  },
  {
    numero: '2º PASSO',
    titulo: 'Escolha um profissional',
    descricao: 'Selecione um profissional de confiança ou deixe que a FixIt encontre o melhor para você.',
    conteudo: (
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 24px rgba(13,71,161,0.10)', maxWidth: '340px', width: '100%' }}>
        <p style={{ color: '#0d47a1', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Profissionais disponíveis</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          {[{ nome: 'João Lima', nota: '4.9', servicos: 12 }, { nome: 'Ana Souza', nota: '4.8', servicos: 8 }].map(p => (
            <div key={p.nome} style={{ border: '1px solid #e3f2fd', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#cfd8e3', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#333' }}>{p.nome}</div>
              <div style={{ color: '#fbc02d', fontSize: '0.78rem', fontWeight: 700 }}>★ {p.nota}</div>
              <div style={{ fontSize: '0.72rem', color: '#888' }}>{p.servicos} serviços</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', border: '2px dashed #0d47a1', borderRadius: '20px', padding: '6px 16px', fontSize: '0.78rem', color: '#0d47a1', fontWeight: 600 }}>
            Não tenho preferência
          </div>
        </div>
      </div>
    )
  },
  {
    numero: '3º PASSO',
    titulo: 'Escolha a forma de pagamento',
    descricao: 'Pague com PIX ou cartão de crédito em até 12x. Seguro e rápido.',
    conteudo: (
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 24px rgba(13,71,161,0.10)', maxWidth: '340px', width: '100%' }}>
        <p style={{ color: '#333', fontWeight: 700, marginBottom: '4px', fontSize: '1rem' }}>Pagamento</p>
        <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '16px' }}>Escolha como deseja pagar</p>
        {[
          { label: 'PIX', sub: 'Pagamento instantâneo', ativo: true },
          { label: 'Cartão de crédito', sub: 'Em até 12x', ativo: false },
        ].map(op => (
          <div key={op.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: `2px solid ${op.ativo ? '#0d47a1' : '#e0e0e0'}`, marginBottom: '10px', background: op.ativo ? '#e3f2fd' : 'white' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${op.ativo ? '#0d47a1' : '#bbb'}`, background: op.ativo ? '#0d47a1' : 'white' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>{op.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>{op.sub}</div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, color: '#333' }}>Total</span>
          <span style={{ fontWeight: 700, color: '#0d47a1' }}>R$ 150,00</span>
        </div>
      </div>
    )
  },
  {
    numero: '4º PASSO',
    titulo: 'Solicitação criada — aguardando confirmação',
    descricao: 'Seu pedido foi registrado com sucesso. Um profissional irá aceitar em breve.',
    conteudo: (
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 24px rgba(13,71,161,0.10)', maxWidth: '340px', width: '100%' }}>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#333', marginBottom: '16px' }}>Meus Pedidos</p>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, color: '#333' }}>Pedido #16</span>
            <span style={{ background: '#fff8e1', color: '#f57f17', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>PENDING</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '4px' }}><b>Serviço:</b> Serviço Faxina</div>
          <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '12px' }}><b>Status:</b> pending</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#0d47a1', fontWeight: 700 }}>R$ 150,00</span>
            <div style={{ background: '#0d47a1', color: 'white', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px', fontWeight: 600 }}>Detalhes do Pedido</div>
          </div>
        </div>
      </div>
    )
  },
  {
    numero: '5º PASSO',
    titulo: 'Confirmado! Profissional a caminho',
    descricao: 'Sua solicitação foi aceita por um profissional. Prepare-se para o atendimento!',
    conteudo: (
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 24px rgba(13,71,161,0.10)', maxWidth: '340px', width: '100%' }}>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#333', marginBottom: '16px' }}>Meus Pedidos</p>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '16px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, color: '#333' }}>Pedido #16</span>
            <span style={{ background: '#fff8e1', color: '#f57f17', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>PENDING</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '4px' }}><b>Serviço:</b> Serviço Faxina</div>
          <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '12px' }}><b>Status:</b> pending</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#0d47a1', fontWeight: 700 }}>R$ 150,00</span>
            <div style={{ background: '#0d47a1', color: 'white', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px', fontWeight: 600 }}>Detalhes do Pedido</div>
          </div>
        </div>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, color: '#333' }}>Pedido #17</span>
            <span style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>CONFIRMADO</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '4px' }}><b>Serviço:</b> Serviço Faxina</div>
          <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '12px' }}><b>Status:</b> confirmado</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#0d47a1', fontWeight: 700 }}>R$ 150,00</span>
            <div style={{ background: '#0d47a1', color: 'white', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px', fontWeight: 600 }}>Detalhes do Pedido</div>
          </div>
        </div>
      </div>
    )
  },
]

export default function ComoFunciona() {
  const [passoAtivo, setPassoAtivo] = useState(0)
  const navigate = useNavigate()

  return (
    <section style={{ padding: '80px 20px', background: 'linear-gradient(to bottom, #f8fbff, #eef4ff)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <h2 style={{ textAlign: 'center', color: '#0d47a1', fontSize: '2rem', marginBottom: '8px' }}>Como funciona?</h2>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '40px', fontSize: '1rem' }}>
          Do pedido à conclusão, tudo simples e rápido
        </p>

        {/* TABS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {passos.map((p, i) => (
            <button
              key={i}
              onClick={() => setPassoAtivo(i)}
              style={{
                padding: '8px 18px',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
                background: passoAtivo === i ? '#0d47a1' : 'white',
                color: passoAtivo === i ? 'white' : '#0d47a1',
                boxShadow: passoAtivo === i ? '0 4px 12px rgba(13,71,161,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
                borderBottom: passoAtivo === i ? 'none' : '2px solid transparent',
              }}
            >
              {p.numero}
            </button>
          ))}
        </div>

        {/* CONTEÚDO */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>

          {/* MOCK */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {passos[passoAtivo].conteudo}
          </div>

          {/* TEXTO */}
          <div style={{ maxWidth: '380px' }}>
            <p style={{ color: '#0d47a1', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', letterSpacing: '0.05em' }}>
              {passos[passoAtivo].numero}
            </p>
            <h3 style={{ color: '#0d47a1', fontSize: '1.7rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3 }}>
              {passos[passoAtivo].titulo}
            </h3>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px' }}>
              {passos[passoAtivo].descricao}
            </p>
            <button
              onClick={() => navigate('/faxina')}
              style={{ background: '#0d47a1', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '30px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseOver={e => e.target.style.background = '#08306b'}
              onMouseOut={e => e.target.style.background = '#0d47a1'}
            >
              AGENDAR SERVIÇO
            </button>
          </div>

        </div>

        {/* NAVEGAÇÃO */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '40px' }}>
          <button
            onClick={() => setPassoAtivo(prev => Math.max(0, prev - 1))}
            disabled={passoAtivo === 0}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #0d47a1', background: 'white', color: '#0d47a1', fontSize: '1.1rem', cursor: passoAtivo === 0 ? 'not-allowed' : 'pointer', opacity: passoAtivo === 0 ? 0.3 : 1 }}
          >‹</button>
          <button
            onClick={() => setPassoAtivo(prev => Math.min(passos.length - 1, prev + 1))}
            disabled={passoAtivo === passos.length - 1}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #0d47a1', background: 'white', color: '#0d47a1', fontSize: '1.1rem', cursor: passoAtivo === passos.length - 1 ? 'not-allowed' : 'pointer', opacity: passoAtivo === passos.length - 1 ? 0.3 : 1 }}
          >›</button>
        </div>

      </div>
    </section>
  )
}