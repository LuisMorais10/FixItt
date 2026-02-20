import { useEffect, useState } from "react"
import "../Styles/auth.css"

export default function MeusPedidos() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
  const fetchOrders = async () => {
    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:8000/api/orders/my/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await response.json()
    console.log("Pedidos recebidos:", data)

    setOrders(data)
  }

  fetchOrders()
}, [])

  return (
    <div>
      <h1>Meus Pedidos</h1>

      {orders.map(order => (
        <div key={order.id}>
          <p>Serviço: {order.service}</p>
          <p>Valor: R$ {order.value}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  )
}
