import { useEffect, useState } from "react"

export default function MeusAgendamentos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("access")

    fetch("http://localhost:8000/api/orders/my-jobs/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar agendamentos")
        return res.json()
      })
      .then(data => {
        console.log("AGENDAMENTOS:", data)
        setPedidos(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // LOADING
  if (loading) return <p style={{ padding: "100px" }}>Carregando agendamentos...</p>

  // ERRO
  if (error) return <p style={{ padding: "100px" }}>{error}</p>

  return (
    <div className="page-container">

      <div className="page-hero">
        <h1>Meus agendamentos</h1>
        <p>Serviços que você aceitou</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="card-pedido">

              {/* ESQUERDA */}
              <div className="card-info">
                <h3>Pedido #{pedido.id}</h3>

                <p><strong>Serviço:</strong> {pedido.service_nome}</p>
                <p><strong>Data:</strong> {pedido.date}</p>
                <p><strong>Cidade:</strong> {pedido.cidade}</p>
                <p><strong>Bairro:</strong> {pedido.bairro}</p>

                <p><strong>Status:</strong> {pedido.status}</p>

                <p className="preco">R$ {pedido.value}</p>
              </div>

              {/* DIREITA */}
              <div className="card-acoes">
                <span className="status-confirmed">
                  {pedido.status}
                </span>

                <button className="btn-detalhes">
                  Ver detalhes
                </button>
              </div>

            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "40px" }}>
            Você ainda não aceitou nenhum serviço.
          </p>
        )}

      </div>
    </div>
  )
}