"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  maxOpacity: number
}

interface Blob {
  x: number
  y: number
  radius: number
  color: string
  speedX: number
  speedY: number
  phase: number
  phaseSpeed: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    resize()
    window.addEventListener("resize", resize)

    // ── GRADIENT MESH BLOBS ──
    const blobs: Blob[] = [
      {
        x: width * 0.3, y: height * 0.3, radius: Math.min(width, height) * 0.35,
        color: "rgba(45, 212, 191, 0.12)", // teal
        speedX: 0.3, speedY: 0.2, phase: 0, phaseSpeed: 0.008,
      },
      {
        x: width * 0.7, y: height * 0.6, radius: Math.min(width, height) * 0.3,
        color: "rgba(52, 211, 153, 0.10)", // emerald
        speedX: -0.2, speedY: 0.3, phase: Math.PI * 0.5, phaseSpeed: 0.006,
      },
      {
        x: width * 0.5, y: height * 0.8, radius: Math.min(width, height) * 0.4,
        color: "rgba(139, 92, 246, 0.10)", // purple
        speedX: 0.15, speedY: -0.25, phase: Math.PI, phaseSpeed: 0.005,
      },
      {
        x: width * 0.8, y: height * 0.2, radius: Math.min(width, height) * 0.25,
        color: "rgba(6, 182, 212, 0.08)", // cyan
        speedX: -0.25, speedY: 0.15, phase: Math.PI * 1.5, phaseSpeed: 0.007,
      },
    ]

    // ── PARTICLES ──
    const particleCount = 60
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0,
      maxOpacity: Math.random() * 0.35 + 0.1,
    }))

    let lastTime = 0
    const targetFPS = 30
    const frameInterval = 1000 / targetFPS

    const animate = (timestamp: number) => {
      animationId = requestAnimationFrame(animate)

      const delta = timestamp - lastTime
      if (delta < frameInterval) return
      lastTime = timestamp - (delta % frameInterval)

      ctx.clearRect(0, 0, width, height)

      // Draw gradient mesh blobs
      for (const blob of blobs) {
        blob.phase += blob.phaseSpeed
        const offsetX = Math.sin(blob.phase) * width * 0.15
        const offsetY = Math.cos(blob.phase * 0.7) * height * 0.12

        const drawX = blob.x + offsetX
        const drawY = blob.y + offsetY

        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, blob.radius)
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(drawX, drawY, blob.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw particles
      for (const p of particles) {
        p.y += p.speedY
        p.x += p.speedX

        // Fade in as they appear, fade out near top
        if (p.y > height * 0.8) {
          p.opacity = Math.min(p.opacity + 0.005, p.maxOpacity)
        } else if (p.y < height * 0.15) {
          p.opacity = Math.max(p.opacity - 0.008, 0)
        } else {
          p.opacity = Math.min(p.opacity + 0.003, p.maxOpacity)
        }

        // Reset particle when it goes off screen
        if (p.y < -10 || p.opacity <= 0) {
          p.y = height + 10
          p.x = Math.random() * width
          p.opacity = 0
          p.maxOpacity = Math.random() * 0.35 + 0.1
        }

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
