import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import "../Styles/auth.css"
import { useEffect } from "react"

export default function PagamentoConfirmado() {
  const navigate = useNavigate()

  useEffect(() => {
    const createOrder = async () => {
      const token = localStorage.getItem("token")
      const orderData = JSON.parse(localStorage.getItem("pendingOrder"))

      if (!orderData || !token) return

      try {
        await fetch("http://localhost:8000/api/orders/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        })

        localStorage.removeItem("pendingOrder")
      } catch (error) {
        console.error("Erro ao criar pedido:", error)
      }
    }

    createOrder()
  }, [])

  return (
    <div className="auth-container">
      <div className="auth-card success-card">
        
        <CheckCircle size={80} color="#2563eb" strokeWidth={1.5} />

        <h1>Pagamento confirmado com sucesso</h1>

        <p>Seu pedido foi processado com sucesso.</p>

        <button onClick={() => navigate("/meus-pedidos")}>
          Ver meus pedidos
        </button>

      </div>
    </div>
  )
}
