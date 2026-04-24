import { useState } from "react"

export default function AddressSearch() {
  const [cep, setCep] = useState("")
  const [displayAddress, setDisplayAddress] = useState("")
  const [error, setError] = useState("")

  async function handleSearch(e) {
    e.preventDefault()

    const cleanCep = cep.replace(/\D/g, "")

    if (cleanCep.length !== 8) {
      setError("Digite um CEP válido com 8 números.")
      setDisplayAddress("")
      return
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setError("Não conseguimos localizar o CEP.")
        setDisplayAddress("")
      } else {
        const formatted = `${data.localidade}, ${data.bairro}, ${data.logradouro}`
          setDisplayAddress(formatted)
          setError("")

          // 🔥 salvar dados para usar depois
        localStorage.setItem(
           "selectedAddress",
        JSON.stringify({
          cep: cleanCep,
          cidade: data.localidade,
          bairro: data.bairro,
          logradouro: data.logradouro
          })
        )
      }

    } catch (err) {
      setError("Erro ao buscar o CEP.")
      setDisplayAddress("")
    }
  }

  return (
    <section className="address-search">

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Digite seu CEP..."
          value={displayAddress || cep}
          onChange={(e) => {
            setCep(e.target.value)
            setDisplayAddress("")
            setError("")
          }}
        />
        <button type="submit">Buscar</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </section>
  )
}