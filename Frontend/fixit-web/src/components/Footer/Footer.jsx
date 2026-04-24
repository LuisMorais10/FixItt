import './footer.css'
import logo from '../../assets/Images/Logo.png'

export default function Footer() {
  return (
    <footer className="footer-v1">
      <div className="footer-container">

        {/* LOGO + DESCRIÇÃO + SOCIAIS */}
        <div className="footer-column footer-brand">
          <img src={logo} alt="FixIt" className="footer-logo" />
          <p className="footer-description">
            Conectamos você a profissionais confiáveis para resolver qualquer
            problema, com rapidez e segurança.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        {/* NAVEGAÇÃO */}
        <div className="footer-column">
          <h4>Navegação</h4>
          <a href="#">Início</a>
          <a href="#">Serviços</a>
          <a href="#">Sobre</a>
          <a href="#">Como funciona</a>
          <a href="#">Contato</a>
        </div>

        {/* PARA CLIENTES */}
        <div className="footer-column">
          <h4>Para clientes</h4>
          <a href="#">Criar conta</a>
          <a href="#">Entrar</a>
          <a href="#">Como contratar</a>
          <a href="#">Central de ajuda</a>
          <a href="#">Segurança</a>
        </div>

        {/* PARA COLABORADORES */}
        <div className="footer-column">
          <h4>Para colaboradores</h4>
          <a href="#">Portal do colaborador</a>
          <a href="#">Como funciona</a>
          <a href="#">Seja um parceiro</a>
          <a href="#">Regras e diretrizes</a>
          <a href="#">Suporte</a>
        </div>

        {/* NEWSLETTER */}
        <div className="footer-column">
          <h4>Newsletter</h4>
          <p className="footer-newsletter-text">Receba novidades e dicas exclusivas.</p>
          <div className="footer-newsletter">
            <input type="email" placeholder="Seu melhor e-mail" />
            <button aria-label="Inscrever">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

      </div>

      {/* LINHA FINAL */}
      <div className="footer-bottom">
        <span>🔒 Pagamento seguro</span>
        <span>© 2026 Fixit. Todos os direitos reservados.</span>
        <span>
          <a href="#">Termos de uso</a> · <a href="#">Privacidade</a>
        </span>
      </div>
    </footer>
  )
}