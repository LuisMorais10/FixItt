import React from "react"

export default function ReputacaoInfoModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          maxWidth: "420px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          position: "relative"
        }}
      >

        {/* ❌ FECHAR */}
        <span
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "14px",
            cursor: "pointer",
            fontSize: "20px",
            color: "#666"
          }}
        >
          ×
        </span>

        {/* 🔵 HEADER COM ILUSTRAÇÃO */}
        <div
          style={{
            background: "#e3f2fd",
            padding: "20px",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            textAlign: "center"
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
            alt="avaliação"
            style={{ width: "80px", marginBottom: "10px" }}
          />
          <h2 style={{ margin: 0, color: "#0d47a1" }}>
            Como funciona sua reputação
          </h2>
        </div>

        <div style={{ padding: "20px" }}>

          {/* 📄 TEXTO */}
          <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
            Sua reputação na FixIt é baseada nas avaliações dos prestadores após cada serviço concluído.
          </p>

          {/* ⭐ BLOCO */}
          <div style={{ marginTop: "20px" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616489.png"
              alt="estrelas"
              style={{ width: "60px", marginBottom: "8px" }}
            />
            <h3 style={{ margin: "5px 0", color: "#0d47a1" }}>
              Como a nota é calculada
            </h3>
            <p style={{ fontSize: "14px", color: "#555" }}>
              A média é calculada com base nas notas de 1 a 5 estrelas que você recebe.
            </p>
          </div>

          {/* 💡 DICAS */}
          <div style={{ marginTop: "20px" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png"
              alt="dicas"
              style={{ width: "60px", marginBottom: "8px" }}
            />
            <h3 style={{ margin: "5px 0", color: "#0d47a1" }}>
              Como melhorar sua reputação
            </h3>

            <ul style={{ paddingLeft: "18px", color: "#555", fontSize: "14px" }}>
              <li>Seja claro nas informações</li>
              <li>Esteja presente no horário</li>
              <li>Comunique-se bem</li>
              <li>Mantenha o ambiente organizado</li>
            </ul>
          </div>

          {/* 🔐 IMPORTÂNCIA */}
          <div style={{ marginTop: "20px" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
              alt="importância"
              style={{ width: "60px", marginBottom: "8px" }}
            />
            <h3 style={{ margin: "5px 0", color: "#0d47a1" }}>
              Por que isso importa?
            </h3>
            <p style={{ fontSize: "14px", color: "#555" }}>
              Uma boa reputação aumenta sua confiança na plataforma e melhora sua experiência com os prestadores.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}