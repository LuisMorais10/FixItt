import logoMin from '../assets/Images/LogoFixitMin.png'

export default function Footer() {
  return (
    <footer className="fixit-footer">
      <div className="fixit-footer-inner">

        {/* Logo minimalista */}
        <div className="footer-logo">
          <img src={logoMin} alt="FixIt" style={{ height: '42px', opacity: 0.9 }} />
        </div>

        {/* Copyright */}
        <p className="footer-copy">© {new Date().getFullYear()} FixIt. Todos os direitos reservados.</p>

        {/* Social */}
        <div className="footer-social">
          <span className="footer-social-label">Social</span>
          <div className="footer-social-icons">

            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="social-icon" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="social-icon" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn" className="social-icon" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>

          </div>
        </div>

      </div>
    </footer>
  )
}

