import "./Colaborador.css"
import colaboradorHero from "../../assets/Images/Colaborador_1.png"

export default function Colaborador() {
  return (
    <main className="colab-container">

      {/* HERO */}
      <section className="colab-hero">

        <div className="hero-text">
          <h1>Trabalhe com a FixIt</h1>
          <p>
            Conecte-se a milhares de clientes e ofereça seus serviços
            com autonomia, segurança e total suporte da nossa equipe.
          </p>

          <div className="hero-line"></div>

          <a href="/colaborador/cadastro" className="primary-btn">
            Começar agora →
          </a>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-bg"></div>
          <img src={colaboradorHero} alt="" />
        </div>

      </section>

      {/* BENEFÍCIOS */}
      <section className="colab-benefits">

        {/* GANHOS */}
        <div className="benefit-card">
          <div className="icon-box blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 7v10M9.5 9.5C9.5 8.67 10.4 8 12 8s2.5.67 2.5 1.5S13.6 11 12 11s-2.5.67-2.5 1.5S10.4 14 12 14s2.5.67 2.5 1.5S13.6 17 12 17"/>
            </svg>
          </div>
          <div>
            <h3>Ganhos maiores</h3>
            <p>Receba com remuneração justa e repasse imediato.</p>
          </div>
        </div>

        {/* AGENDA */}
        <div className="benefit-card">
          <div className="icon-box orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="3"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <h3>Flexibilidade total</h3>
            <p>Monte sua agenda e escolha quando trabalhar.</p>
          </div>
        </div>

        {/* CLIENTES */}
        <div className="benefit-card">
          <div className="icon-box green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="7" r="4"/>
              <path d="M17 11c1.66 0 3-1.34 3-3S18.66 5 17 5"/>
              <path d="M3 21c0-3.31 2.69-6 6-6"/>
              <path d="M21 21c0-3.31-2.69-6-6-6"/>
            </svg>
          </div>
          <div>
            <h3>Mais clientes</h3>
            <p>Alta demanda na sua região.</p>
          </div>
        </div>

        {/* SUPORTE */}
        <div className="benefit-card">
          <div className="icon-box purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h3>Suporte dedicado</h3>
            <p>Equipe pronta para ajudar sempre.</p>
          </div>
        </div>

      </section>

      {/* CTA */}
      <section className="colab-cta">

        <div className="cta-card login">
          <h4>Já tenho conta</h4>
          <p>Acesse seu portal e gerencie seus serviços.</p>
          <a href="/colaborador/entrar" className="secondary-btn">
            Fazer login
          </a>
        </div>

        <div className="cta-card register">
          <h4>Quero ser colaborador FixIt</h4>
          <p>Comece agora e receba novos serviços.</p>
          <a href="/colaborador/cadastro" className="primary-btn">
            Inscrever-se →
          </a>
        </div>

      </section>

    </main>
  )
}