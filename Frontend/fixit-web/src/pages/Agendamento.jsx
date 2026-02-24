import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Agendamento() {
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(null)
  const [turno, setTurno] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const monthName = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleAdvance = () => {
    if (!selectedDate || !turno) return

    localStorage.setItem(
      "agendamentoData",
      JSON.stringify(selectedDate)
    )

    localStorage.setItem("agendamentoTurno", turno)

    navigate("/faxina/residencial-agendada/formulario")
  }

  const canAdvance = selectedDate && turno

  return (
    <div className="agendamento-page">
      <h2>Escolha a data do serviço</h2>

      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>←</button>
          <span>{monthName}</span>
          <button onClick={handleNextMonth}>→</button>
        </div>

        <div className="calendar-weekdays">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {[...Array(firstDay)].map((_, i) => (
            <div key={i} />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1
            const isSelected =
              selectedDate?.day === day &&
              selectedDate?.month === month &&
              selectedDate?.year === year

            return (
              <div
                key={day}
                className={`calendar-day ${isSelected ? "selected" : ""}`}
                onClick={() =>
                  setSelectedDate({ day, month, year })
                }
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>

      <div className="turno">
        <label>Turno</label>
        <select value={turno} onChange={(e) => setTurno(e.target.value)}>
          <option value="">Selecione</option>
          <option value="manha-tarde">Manhã / Tarde</option>
        </select>
      </div>

      <button
        className={`btn-avancar ${canAdvance ? "ativo" : ""}`}
        disabled={!canAdvance}
        onClick={handleAdvance}
      >
        Avançar
      </button>
    </div>
  )
}

export default Agendamento