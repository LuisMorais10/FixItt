import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Faxina from "./pages/Faxina";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/faxina" element={<Faxina />} />
        </Route>
      </Routes>
  )
}

export default App



