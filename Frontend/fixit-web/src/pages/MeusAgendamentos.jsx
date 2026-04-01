import { useEffect, useState } from "react"
import PedidoDetalhesModal from "../components/PedidoDetalhesModal"

export default function MeusAgendamentos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null)
  const [codigoInput, setCodigoInput] = useState({})
  const [actionLoading, setActionLoading] = useState(null)
  const [mensagem, setMensagem] = useState(null)

  const token = localStorage.getItem("access")

  useEffect(() => {
    fetch("http://localhost:8000/api/orders/my-jobs/", {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    })
      .then(res => { if (!res.ok) throw new Error("Erro"); return res.json() })
      .then(data => { setPedidos(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const iniciarServico = async (id) => {
    setActionLoading(id)
    const res = await fetch(`http://localhost:8000/api/orders/${id}/iniciar/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    })
    const data = await res.json()
    if (res.ok) {
      setMensagem(data.message)
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: 'in_progress' } : p))
    } else {
      setMensagem(data.error)
    }
    setActionLoading(null)
  }

  const encerrarServico = async (id) => {
    const codigo = codigoInput[id]
    if (!codigo) return
    setActionLoading(id)
    const res = await fetch(`http://localhost:8000/api/orders/${id}/encerrar/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ codigo })
    })
    const data = await res.json()
    if (res.ok) {
      setMensagem(data.message)
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: 'completed' } : p))
    } else {
      setMensagem(data.error)
    }
    setActionLoading(null)
  }

  if (loading) return <p style={{ padding: "100px" }}>Carregando agendamentos...</p>
  if (error) return <p style={{ padding: "100px" }}>{error}</p>

  return (
    <div className="page-container">

      <div className="page-hero">
        <h1>Meus agendamentos</h1>
        <p>Serviços que você aceitou</p>
      </div>

      {mensagem && <p className="agendamento-mensagem">{mensagem}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {pedidos.length > 0 ? pedidos.map((pedido) => (
          <div key={pedido.id} className="card-pedido">

            <div className="card-info">
              <h3>Pedido #{pedido.id}</h3>
              <p><strong>Serviço:</strong> {pedido.service_nome}</p>
              <p><strong>Data:</strong> {pedido.date}</p>
              <p><strong>Cidade:</strong> {pedido.cidade}</p>
              <p><strong>Bairro:</strong> {pedido.bairro}</p>
              <p className="preco">R$ {pedido.value}</p>
            </div>

            <div className="card-acoes">
              <span className={`status-${pedido.status}`}>{pedido.status}</span>

              <button className="btn-detalhes" onClick={() => setPedidoSelecionado(pedido)}>
                Ver detalhes
              </button>

              {pedido.status === 'confirmed' && (
                <button
                  className="btn-iniciar"
                  disabled={actionLoading === pedido.id}
                  onClick={() => iniciarServico(pedido.id)}
                >
                  {actionLoading === pedido.id ? 'Aguarde...' : 'Iniciar serviço'}
                </button>
              )}

              {pedido.status === 'in_progress' && (
                <div className="encerrar-box">
                  <input
                    type="text"
                    placeholder="Código do cliente"
                    maxLength={6}
                    value={codigoInput[pedido.id] || ''}
                    onChange={e => setCodigoInput(prev => ({ ...prev, [pedido.id]: e.target.value }))}
                    className="input-codigo"
                  />
                  <button
                    className="btn-encerrar"
                    disabled={actionLoading === pedido.id}
                    onClick={() => encerrarServico(pedido.id)}
                  >
                    {actionLoading === pedido.id ? 'Encerrando...' : 'Encerrar ticket'}
                  </button>
                </div>
              )}
            </div>

          </div>
        )) : (
          <p style={{ textAlign: "center", marginTop: "40px" }}>
            Você ainda não aceitou nenhum serviço.
          </p>
        )}
      </div>

      <PedidoDetalhesModal
        pedido={pedidoSelecionado}
        onClose={() => setPedidoSelecionado(null)}
        modo="prestador"
      />
    </div>
  )
}