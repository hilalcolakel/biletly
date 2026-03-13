'use client'

import { useEffect, useRef, useCallback } from 'react'

interface LiquidEtherProps {
  colors?: string[]
  mouseForce?: number
  cursorSize?: number
  isViscous?: boolean
  viscous?: number
  iterationsViscous?: number
  iterationsPoisson?: number
  resolution?: number
  isBounce?: boolean
  autoDemo?: boolean
  autoSpeed?: number
  autoIntensity?: number
  takeoverDuration?: number
  autoResumeDelay?: number
  autoRampDuration?: number
  color0?: string
  color1?: string
  color2?: string
}

function hexToVec4(hex: string): number[] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b, 1.0]
}

export default function LiquidEther({
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  resolution = 0.5,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
}: LiquidEtherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const time = Date.now() * 0.001 * autoSpeed

    // Create fluid-like gradient effect
    ctx.clearRect(0, 0, w, h)

    // Background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, w, h)

    // Animated blobs
    const blobs = [
      { color: colors[0] || '#5227FF', x: 0.3, y: 0.4, rx: 0.25, ry: 0.3 },
      { color: colors[1] || '#FF9FFC', x: 0.7, y: 0.5, rx: 0.2, ry: 0.25 },
      { color: colors[2] || '#B19EEF', x: 0.5, y: 0.7, rx: 0.3, ry: 0.2 },
      { color: colors[0] || '#5227FF', x: 0.2, y: 0.8, rx: 0.15, ry: 0.2 },
      { color: colors[1] || '#FF9FFC', x: 0.8, y: 0.3, rx: 0.2, ry: 0.15 },
    ]

    blobs.forEach((blob, i) => {
      const offsetX = Math.sin(time * (0.5 + i * 0.2) + i * 1.3) * 0.15
      const offsetY = Math.cos(time * (0.4 + i * 0.15) + i * 0.8) * 0.12
      const cx = (blob.x + offsetX) * w
      const cy = (blob.y + offsetY) * h
      const rx = blob.rx * w * (1 + Math.sin(time * 0.3 + i) * 0.2) * autoIntensity * 0.5
      const ry = blob.ry * h * (1 + Math.cos(time * 0.25 + i) * 0.15) * autoIntensity * 0.5

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry))
      gradient.addColorStop(0, blob.color + '55')
      gradient.addColorStop(0.4, blob.color + '30')
      gradient.addColorStop(0.7, blob.color + '15')
      gradient.addColorStop(1, blob.color + '00')

      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, Math.sin(time * 0.2 + i) * 0.5, 0, Math.PI * 2)
      ctx.fill()
    })

    // Extra shimmer
    const shimmerX = (0.5 + Math.sin(time * 0.7) * 0.3) * w
    const shimmerY = (0.5 + Math.cos(time * 0.5) * 0.3) * h
    const shimmerGrad = ctx.createRadialGradient(shimmerX, shimmerY, 0, shimmerX, shimmerY, w * 0.15)
    shimmerGrad.addColorStop(0, '#ffffff18')
    shimmerGrad.addColorStop(1, '#ffffff00')
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = shimmerGrad
    ctx.fillRect(0, 0, w, h)

    ctx.globalCompositeOperation = 'source-over'

    animRef.current = requestAnimationFrame(render)
  }, [colors, autoSpeed, autoIntensity])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2) * resolution
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
    }

    resize()
    window.addEventListener('resize', resize)
    
    if (autoDemo) {
      animRef.current = requestAnimationFrame(render)
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [render, resolution, autoDemo])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
