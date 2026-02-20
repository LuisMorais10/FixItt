import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import PrivateRoute from "./routes/PrivateRoute"
import Agendamento from "./pages/Agendamento"
import FormularioFaxina from "./pages/FormularioFaxinaR"
import EscolhaProfissional from "./pages/EscolhaProfissional"
import Pagamento from "./pages/PaginaPagamento/PaginaPagamento"
import Faxina from "./pages/Faxina"
import Entrar from "./pages/Entrar"
import CriarConta from "./pages/CriarConta"
import VerificarCodigo from "./pages/VerificarCodigo"
import ContaVerificada from "./pages/ContaVerificada"
import PagamentoConfirmado from "./pages/PagamentoConfirmado"
import MeusPedidos from "./pages/MeusPedidos"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* PÚBLICAS */}
        <Route index element={<Home />} />
        <Route path="faxina" element={<Faxina />} />
        <Route path="entrar" element={<Entrar />} />
        <Route path="criar-conta" element={<CriarConta />} />
        <Route path="verificar-codigo" element={<VerificarCodigo />} />
        <Route path="conta-verificada" element={<ContaVerificada />} />

        {/* PROTEGIDAS */}
        <Route
          path="faxina/residencial-agendada"
          element={
            <PrivateRoute>
              <Agendamento />
            </PrivateRoute>
          }
        />

        <Route
          path="faxina/residencial-agendada/formulario"
          element={
            <PrivateRoute>
              <FormularioFaxina />
            </PrivateRoute>
          }
        />

        <Route
          path="faxina/residencial-agendada/profissionais"
          element={
            <PrivateRoute>
              <EscolhaProfissional />
            </PrivateRoute>
          }
        />

        <Route
          path="faxina/residencial-flash"
          element={
            <PrivateRoute>
              <FormularioFaxina />
            </PrivateRoute>
          }
        />

        {/* ✅ PAGAMENTO GLOBAL */}
        <Route
          path="pagamento"
          element={
            <PrivateRoute>
              <Pagamento />
            </PrivateRoute>
          }
        />

        <Route
          path="pagamento-confirmado"
          element={
            <PrivateRoute>
              <PagamentoConfirmado />
            </PrivateRoute>
          }
        />

        <Route
          path="meus-pedidos"
          element={
            <PrivateRoute>
              <MeusPedidos />
            </PrivateRoute>
          }
        />

      </Route>
    </Routes>
  )
}

export default App
