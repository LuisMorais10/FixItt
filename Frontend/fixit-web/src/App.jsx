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
import PaginaContatoEmpresarial from "./pages/PaginaContatoEmpresarial"
import MensagemEnviada from "./pages/MensagemEnviadaFC"
import Colaborador from "./pages/Colaborador"
import Dados from './pages/Dados'
import CadastroPrestador from './pages/CadastroPrestador'
import CadastroPrestadorSucesso from './pages/CadastroPrestadorSucesso'
import EntrarColaborador from './pages/EntrarColaborador'
import PortalColaborador from './pages/PortalColaborador'
import SolicitacoesDisponiveis from './pages/SolicitacoesDisponiveis'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* PÚBLICAS */}
        <Route index element={<Home />} />
        <Route path="faxina" element={<Faxina />} />
        <Route path="faxina/comercial" element={<PaginaContatoEmpresarial />} />
        <Route path="faxina/hotelaria" element={<PaginaContatoEmpresarial />} />
        <Route path="/mensagem-enviada" element={<MensagemEnviada />} />
        <Route path="entrar" element={<Entrar />} />
        <Route path="criar-conta" element={<CriarConta />} />
        <Route path="verificar-codigo" element={<VerificarCodigo />} />
        <Route path="conta-verificada" element={<ContaVerificada />} />
        <Route path="/colaborador" element={<Colaborador />} />
        <Route path="/dados" element={<Dados />} />
        <Route path="/colaborador/cadastro" element={<CadastroPrestador />} />
        <Route path="/colaborador/cadastro-enviado" element={<CadastroPrestadorSucesso />} />
        <Route path="/colaborador/entrar" element={<EntrarColaborador />} />
        <Route path="/colaborador/portal" element={<PortalColaborador />} />
        <Route path="/colaborador/solicitacoes" element={<SolicitacoesDisponiveis />} />
        


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
