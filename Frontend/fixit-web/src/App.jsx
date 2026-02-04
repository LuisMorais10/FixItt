import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Faxina from "./pages/Faxina";
import Entrar from "./pages/Entrar";
import CriarConta from "./pages/CriarConta"

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/faxina" element={<Faxina />} />
          <Route path="/Entrar" element={<Entrar />} />
          <Route path="/criar-conta" element={<CriarConta />} />
        </Route>
      </Routes>
  )
}

export default App



