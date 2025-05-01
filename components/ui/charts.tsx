"use client"

import { useEffect, useRef } from "react"

type ChartData = {
  name: string
  value: number
}

export function LineChart({ data }: { data: ChartData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40

    // Find max value for scaling
    const maxValue = Math.max(...data.map((item) => item.value))

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw line
    if (data.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = "#0ea5e9"
      ctx.lineWidth = 2

      const xStep = (width - padding * 2) / (data.length - 1)

      data.forEach((item, index) => {
        const x = padding + index * xStep
        const y = height - padding - (item.value / maxValue) * (height - padding * 2)

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      data.forEach((item, index) => {
        const x = padding + index * xStep
        const y = height - padding - (item.value / maxValue) * (height - padding * 2)

        ctx.beginPath()
        ctx.fillStyle = "#0ea5e9"
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Draw labels
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    data.forEach((item, index) => {
      const x = padding + index * ((width - padding * 2) / (data.length - 1))
      ctx.fillText(item.name, x, height - padding + 20)
    })
  }, [data])

  return <canvas ref={canvasRef} width={500} height={200} className="w-full h-full" />
}

export function BarChart({ data }: { data: ChartData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40

    // Find max value for scaling
    const maxValue = Math.max(...data.map((item) => item.value))

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw bars
    const barWidth = ((width - padding * 2) / data.length) * 0.8
    const barSpacing = ((width - padding * 2) / data.length) * 0.2

    data.forEach((item, index) => {
      const x = padding + index * ((width - padding * 2) / data.length) + barSpacing / 2
      const barHeight = (item.value / maxValue) * (height - padding * 2)
      const y = height - padding - barHeight

      ctx.fillStyle = "#0ea5e9"
      ctx.fillRect(x, y, barWidth, barHeight)
    })

    // Draw labels
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    data.forEach((item, index) => {
      const x = padding + index * ((width - padding * 2) / data.length) + (width - padding * 2) / data.length / 2
      ctx.fillText(item.name, x, height - padding + 20)

      // Draw value on top of bar
      const barHeight = (item.value / maxValue) * (height - padding * 2)
      const y = height - padding - barHeight
      ctx.fillText(item.value.toString(), x, y - 10)
    })
  }, [data])

  return <canvas ref={canvasRef} width={500} height={200} className="w-full h-full" />
}
