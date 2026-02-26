import { useEffect, useState } from "react"
import "../Styles/auth.css"

export default function MeusPedidos() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
  const token = localStorage.getItem("access")
  console.log("TOKEN:", localStorage.getItem("access"))

    fetch("http://localhost:8000/api/orders/my/", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao buscar pedidos")
        }
        return response.json()
      })
      .then(data => setOrders(data))
      .catch(error => console.error(error))
  }, [])


  return (
  <div className="pedidos-card">
    <h1>Meus Pedidos</h1>

    {orders.length === 0 ? (
      <p>Você ainda não possui pedidos.</p>
    ) : (
      orders.map(order => (
        <div key={order.id} className="ticket">
          
          <div className="ticket-header">
            <span>Pedido #{order.id}</span>
            <span className={`status ${order.status}`}>
              {order.status}
            </span>
          </div>

          <div className="ticket-body">
            <p><strong>Serviço:</strong> {order.service}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>

          <div className="ticket-footer">
            <span className="valor">
              R$ {Number(order.value).toFixed(2)}
            </span>
          </div>

        </div>
      ))
    )}
  </div>
)
}
