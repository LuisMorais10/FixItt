import { useEffect, useState } from "react"

export default function ImageSlider({ images, height = "340px" }) {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length)
        setFade(true)
      }, 200) // tempo do fade-out
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="slider" style={{ height }}>
      <img
        src={images[index]}
        alt="Serviço"
        className={fade ? "fade-in" : "fade-out"}
      />

      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
