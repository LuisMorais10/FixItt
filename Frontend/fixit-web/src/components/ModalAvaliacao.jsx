import { useState } from "react";
import api from "../services/api"; // ajuste para o seu caminho de instância axios

/**
 * ModalAvaliacao
 *
 * Props:
 *  - order        {object}   — objeto do pedido (deve ter id, prestador_detalhes, user_detalhes)
 *  - onClose      {function} — fecha o modal
 *  - onAvaliado   {function} — callback chamado após avaliação bem-sucedida
 *  - isPrestador  {boolean}  — true se o usuário logado for prestador
 */
export default function ModalAvaliacao({ order, onClose, onAvaliado, isPrestador }) {
  const [nota, setNota]           = useState(0);
  const [hoveredNota, setHovered] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading]     = useState(false);
  const [erro, setErro]           = useState("");
  const [sucesso, setSucesso]     = useState(false);

  // Quem será avaliado
  const avaliado = isPrestador
    ? (order.user_detalhes?.first_name || order.user_detalhes?.email || "Cliente")
    : (order.prestador_detalhes?.nome || "Prestador");

  const notaLabels = ["", "Ruim", "Regular", "Bom", "Ótimo", "Excelente"];

  async function handleSubmit() {
    if (nota === 0) {
      setErro("Selecione uma nota antes de enviar.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      await api.post("/avaliacoes/criar/", {
        order: order.id,
        nota,
        comentario,
      });

      setSucesso(true);
      setTimeout(() => {
        onAvaliado?.();
        onClose();
      }, 1800);
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.order?.[0] ||
        "Erro ao enviar avaliação. Tente novamente.";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 440, width: "92%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Cabeçalho ── */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ color: "#0d47a1", marginBottom: 4, fontSize: 18 }}>
            Avaliar {isPrestador ? "cliente" : "prestador"}
          </h3>
          <p style={{ color: "#666", fontSize: 14 }}>
            Pedido <strong>#{order.id}</strong> — {avaliado}
          </p>
        </div>

        {sucesso ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 48 }}>🎉</span>
            <p style={{ color: "#2e7d32", fontWeight: 600, fontSize: 16 }}>
              Avaliação enviada com sucesso!
            </p>
          </div>
        ) : (
          <>
            {/* ── Estrelas ── */}
            <div style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontWeight: 600,
                  color: "#0d47a1",
                  marginBottom: 10,
                  fontSize: 14,
                }}
              >
                Nota
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  marginBottom: 6,
                }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNota(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                      fontSize: 36,
                      color:
                        n <= (hoveredNota || nota) ? "#EF9F27" : "#ccc",
                      transition: "color 0.15s, transform 0.1s",
                      transform:
                        n <= (hoveredNota || nota)
                          ? "scale(1.15)"
                          : "scale(1)",
                    }}
                    aria-label={`Nota ${n}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {(hoveredNota || nota) > 0 && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#EF9F27",
                    fontWeight: 600,
                    fontSize: 14,
                    minHeight: 20,
                  }}
                >
                  {notaLabels[hoveredNota || nota]}
                </p>
              )}
            </div>

            {/* ── Comentário ── */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "#0d47a1",
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                Comentário <span style={{ color: "#999", fontWeight: 400 }}>(opcional)</span>
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Conte como foi a experiência..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1px solid #cfd8dc",
                  fontSize: 14,
                  resize: "vertical",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0d47a1";
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(13, 71, 161, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#cfd8dc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* ── Erro ── */}
            {erro && (
              <p
                style={{
                  color: "#c62828",
                  fontSize: 13,
                  marginBottom: 14,
                  background: "#ffebee",
                  padding: "8px 12px",
                  borderRadius: 8,
                }}
              >
                {erro}
              </p>
            )}

            {/* ── Botões ── */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  border: "2px solid #0d47a1",
                  background: "transparent",
                  color: "#0d47a1",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "#e3f2fd")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "transparent")
                }
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || nota === 0}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  border: "none",
                  background:
                    nota === 0 ? "#ccc" : "#0d47a1",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: nota === 0 ? "not-allowed" : "pointer",
                  transition: "background 0.2s, transform 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (nota > 0)
                    e.target.style.background = "#08306b";
                }}
                onMouseLeave={(e) => {
                  if (nota > 0)
                    e.target.style.background = "#0d47a1";
                }}
              >
                {loading ? "Enviando…" : "Enviar avaliação"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}