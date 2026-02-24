import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import "../Styles/auth.css"
import { useEffect,useRef } from "react"

export default function PagamentoConfirmado() {
  const navigate = useNavigate()
  const hasCreated = useRef(false)

  useEffect(() => {
    const createOrder = async () => {

      if (hasCreated.current) return
      hasCreated.current = true

      const token = localStorage.getItem("access")
      const orderData = JSON.parse(localStorage.getItem("pendingOrder"))

      if (!orderData || !token) {
        console.log("Sem pedido ou token")
        return
      }

      try {
        const response = await fetch("http://localhost:8000/api/orders/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        })

        if (!response.ok) {
          const error = await response.json()
          console.error("Erro backend:", error)
          return
        }

        const data = await response.json()
        console.log("Pedido criado:", data)

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
