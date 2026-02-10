import { useState } from "react"
import "./PaginaPagamento.css"

export default function PaginaPagamento() {
  const [metodo, setMetodo] = useState("pix")

  return (
    <div className="checkout-container">
      {/* COLUNA ESQUERDA */}
      <div className="checkout-left">
        <h1>Pagamento</h1>
        <p className="subtitle">
          Escolha como deseja pagar
        </p>

        <div className="payment-methods">
          <label
            className={`payment-option ${metodo === "pix" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="pagamento"
              checked={metodo === "pix"}
              onChange={() => setMetodo("pix")}
            />
            <div>
              <strong>PIX</strong>
              <span>Pagamento instantâneo</span>
            </div>
          </label>

          <label
            className={`payment-option ${metodo === "cartao" ? "active" : ""}`}
          >
            <input
              type="radio"
              name="pagamento"
              checked={metodo === "cartao"}
              onChange={() => setMetodo("cartao")}
            />
            <div>
              <strong>Cartão de crédito</strong>
              <span>Em até 12x</span>
            </div>
          </label>
        </div>

        {metodo === "pix" && (
          <div className="payment-info">
            O QR Code será gerado após a confirmação.
          </div>
        )}

        {metodo === "cartao" && (
          <div className="payment-info">
            Você será redirecionado para o ambiente seguro do pagamento.
          </div>
        )}
      </div>

      {/* COLUNA DIREITA */}
      <div className="checkout-right">
        <h2>Resumo do pedido</h2>

        <div className="summary-item">
          <span>Faxina residencial</span>
          <span>R$ 150,00</span>
        </div>

        <div className="summary-item">
          <span>Taxa de serviço</span>
          <span>R$ 0,00</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <strong>R$ 150,00</strong>
        </div>

        <button className="pay-button">
          Finalizar pagamento
        </button>

        <p className="secure-text">
          🔒 Pagamento seguro • Ambiente criptografado
        </p>
      </div>
    </div>
  )
}
