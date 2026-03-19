import { useNavigate } from 'react-router-dom'

export default function BannerCTA() {
  const navigate = useNavigate()

  return (
    <section style={{ padding: '60px 20px', background: 'white' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

        {/* CARD SUPORTE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '32px', borderRadius: '20px', background: 'linear-gradient(135deg, #e3f2fd, #f8fbff)', position: 'relative', overflow: 'hidden' }}>
          {/* Blob decorativo */}
          <div style={{ position: 'absolute', left: '-20px', top: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(13,71,161,0.07)' }} />

          {/* Ícone chave de fenda */}
          <div style={{ flexShrink: 0, zIndex: 1 }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="#e3f2fd" />
              <g transform="translate(20, 20)">
                <path d="M30.5 5.5C28.1 3.1 24.7 2 21.3 2.5L27 8.2L24.2 11L18.5 5.3C18 8.7 19.1 12.1 21.5 14.5C23.8 16.8 27 17.9 30.2 17.6L36.8 24.2C37.6 25 38.8 25 39.6 24.2C40.4 23.4 40.4 22.2 39.6 21.4L33 14.8C33.3 11.6 32.2 8.4 30.5 5.5Z" fill="#0d47a1" stroke="#0d47a1" strokeWidth="1"/>
                <path d="M8 32L18 22" stroke="#0d47a1" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M5 35C3.3 36.7 3.3 39.4 5 41.1C6.7 42.8 9.4 42.8 11.1 41.1L18 34.2L11.9 28.1L5 35Z" fill="#1565c0" stroke="#0d47a1" strokeWidth="1"/>
              </g>
            </svg>
          </div>

          <div style={{ zIndex: 1 }}>
            <h3 style={{ color: '#0d47a1', fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>Ajuda</h3>
            <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
              Como podemos ajudar? Acesse nosso canal de suporte.
            </p>
            <button
              onClick={() => navigate('/suporte')}
              style={{ background: '#0d47a1', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(13,71,161,0.25)' }}
              onMouseOver={e => e.currentTarget.style.background = '#08306b'}
              onMouseOut={e => e.currentTarget.style.background = '#0d47a1'}
            >
              Suporte
            </button>
          </div>
        </div>

        {/* CARD CHATBOT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '32px', borderRadius: '20px', background: 'linear-gradient(135deg, #e3f2fd, #f8fbff)', position: 'relative', overflow: 'hidden' }}>
          {/* Blob decorativo */}
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(13,71,161,0.07)' }} />

          {/* Ícone vassoura */}
          <div style={{ flexShrink: 0, zIndex: 1 }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="#e3f2fd" />
              <g transform="translate(18, 14)">
                <path d="M28 4L12 28" stroke="#0d47a1" strokeWidth="3" strokeLinecap="round"/>
                <path d="M10 26L6 38C5.5 39.5 6.5 41 8 41H24C25.5 41 26.5 39.5 26 38L22 26H10Z" fill="#1565c0" stroke="#0d47a1" strokeWidth="1.5"/>
                <path d="M8 32H24" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 36H25" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="28" cy="4" r="3" fill="#0d47a1"/>
              </g>
            </svg>
          </div>

          <div style={{ zIndex: 1 }}>
            <h3 style={{ color: '#0d47a1', fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>Chatbot</h3>
            <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
              Fale com nosso assistente virtual para dúvidas rápidas.
            </p>
            <button
              onClick={() => navigate('/chatbot')}
              style={{ background: '#0d47a1', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(13,71,161,0.25)' }}
              onMouseOver={e => e.currentTarget.style.background = '#08306b'}
              onMouseOut={e => e.currentTarget.style.background = '#0d47a1'}
            >
              Chatbot
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}