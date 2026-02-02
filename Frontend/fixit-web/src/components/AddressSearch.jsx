import { useState } from "react"

export default function AddressSearch() {
  const [address, setAddress] = useState("")

  function handleSearch(e) {
    e.preventDefault()
    if (!address.trim()) return
    alert(`Buscar serviços próximos de: ${address}`)
  }

  return (
    <section className="address-search">
      <h2>Encontre serviços perto de você</h2>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Digite seu endereço ou CEP..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
    </section>
  )
}
