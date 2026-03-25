import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export default function SolicitacoesDisponiveis() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  

  useEffect(() => {
    const token = localStorage.getItem("access")

    fetch("http://localhost:8000/api/orders/available/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar solicitações")
        return res.json()
      })
      .then(data => {
        console.log("API:", data) // 🔍 DEBUG
        setPedidos(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // ✅ LOADING
  if (loading) return <p style={{ padding: "100px" }}>Carregando solicitações...</p>

  // ❌ ERRO
  if (error) return <p style={{ padding: "100px" }}>{error}</p>

  // ✅ RENDER
  return (
    <div className="page-container">

      <div className="page-hero">
        <h1>Solicitações disponíveis</h1>
        <p>Escolha um serviço para atender</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="card-pedido">

            {/* ESQUERDA */}
          <div className="card-info">
            <h3>Pedido #{pedido.id}</h3>

            <p><strong>Serviço:</strong> {pedido.servico}</p>
            <p><strong>Data:</strong> {pedido.data}</p>
            <p><strong>Cidade:</strong> {pedido.cidade}</p>
            <p><strong>Bairro:</strong> {pedido.bairro}</p>

            <p className="preco">R$ {pedido.valor}</p>
          </div>

          {/* DIREITA */}
          <div className="card-acoes">
            <span className="status-pending">PENDING</span>

            <button className="btn-detalhes">
              Ver detalhes
            </button>
          </div>

        </div>
    ))
) : (
  <p style={{ textAlign: "center", marginTop: "40px" }}>
    Nenhuma solicitação disponível.
  </p>
)}

      </div>
    </div>
  )
}