import { useEffect, useState } from "react"
import cleaningImg from "../assets/Images/CleaningQuemSomos.svg"

export default function QuemSomos() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 200)
  }, [])

  return (
    <section className={`quem-somos-premium ${visible ? "show" : ""}`}>

      <div className="quem-wrapper">

        {/* TEXTO */}
        <div className="quem-texto">

          <span className="badge">🚀 Plataforma moderna</span>

          <h2>
            Transformando a forma de contratar <span>serviços domésticos</span>
          </h2>

          <p>
            A <strong>FixIt</strong> conecta você aos melhores profissionais de forma rápida, segura e sem burocracia — como um <strong>Uber dos serviços domésticos</strong>.
          </p>

          <div className="quem-diferenciais">

            <div className="card">
              <span>⚡</span>
              <h4>Rápido</h4>
              <p>Solicite um serviço em poucos minutos</p>
            </div>

            <div className="card">
              <span>🔒</span>
              <h4>Seguro</h4>
              <p>Perfis verificados e sistema de avaliações</p>
            </div>

            <div className="card">
              <span>💼</span>
              <h4>Oportunidade</h4>
              <p>Geração de renda para prestadores</p>
            </div>

          </div>

        </div>

        {/* ILUSTRAÇÃO */}
        <div className="quem-ilustracao">
          <img
            src={cleaningImg}
            alt="serviços"
          />
        </div>

      </div>
    </section>
  )
}