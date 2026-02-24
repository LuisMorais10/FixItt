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
