'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { useCursorPosition } from '@/hooks/use-cursor-position'
import { cn } from '@/lib/utils'

/**
 * Props for ParticleBackground component
 */
export interface ParticleBackgroundProps {
  /** Number of particles */
  count?: number
  /** Size range of particles */
  size?: { min: number; max: number }
  /** Speed of particle movement */
  speed?: number
  /** Color of particles */
  color?: string
  /** Connection distance between particles */
  connectionDistance?: number
  /** Whether to connect particles with lines */
  connectParticles?: boolean
  /** Whether particles react to cursor */
  cursorReaction?: boolean
  /** Cursor reaction radius */
  cursorRadius?: number
  /** Mouse interaction type */
  interactionType?: 'repel' | 'attract' | 'none'
  /** Opacity of particles */
  opacity?: number
  /** Additional class names */
  className?: string
}

/**
 * Particle data structure
 */
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

/**
 * Interactive Particle Background Component
 *
 * Creates a dynamic particle system with optional cursor interactions.
 * Particles float gently and can connect with lines when close to each other.
 *
 * @example
 * ```tsx
 * <ParticleBackground
 *   count={50}
 *   connectParticles
 *   cursorReaction
 *   interactionType="repel"
 * />
 *
 * <ParticleBackground
 *   count={30}
 *   color="rgba(212, 175, 55, 0.5)"
 *   speed={0.5}
 * />
 * ```
 */
export function ParticleBackground({
  count = 50,
  size = { min: 1, max: 3 },
  speed = 1,
  color = 'rgba(212, 175, 55, 0.5)',
  connectionDistance = 150,
  connectParticles = true,
  cursorReaction = true,
  cursorRadius = 100,
  interactionType = 'repel',
  opacity = 0.6,
  className,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | undefined>(undefined)
  const { shouldReduceMotion } = useMotion()
  const { x: cursorX, y: cursorY, isTouch } = useCursorPosition()

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 0.5,
        vy: (Math.random() - 0.5) * speed * 0.5,
        size: size.min + Math.random() * (size.max - size.min),
        opacity: opacity * (0.3 + Math.random() * 0.7),
      })
    }

    particlesRef.current = particles
  }, [count, size, speed, opacity])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const particles = particlesRef.current
    const cursorXNorm = cursorX ?? width / 2
    const cursorYNorm = cursorY ?? height / 2

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Apply cursor reaction
      if (cursorReaction && !isTouch && cursorX !== null && cursorY !== null) {
        const dx = particle.x - cursorXNorm
        const dy = particle.y - cursorYNorm
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < cursorRadius) {
          const force = (cursorRadius - distance) / cursorRadius
          const angle = Math.atan2(dy, dx)

          if (interactionType === 'repel') {
            particle.vx += Math.cos(angle) * force * 0.5
            particle.vy += Math.sin(angle) * force * 0.5
          } else if (interactionType === 'attract') {
            particle.vx -= Math.cos(angle) * force * 0.3
            particle.vy -= Math.sin(angle) * force * 0.3
          }
        }
      }

      // Apply velocity with damping
      if (!shouldReduceMotion) {
        particle.x += particle.vx
        particle.y += particle.vy

        // Damping
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Add slight random movement
        particle.vx += (Math.random() - 0.5) * 0.01 * speed
        particle.vy += (Math.random() - 0.5) * 0.01 * speed
      }

      // Wrap around edges
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0

      // Draw connections
      if (connectParticles) {
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j]
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3
            ctx.strokeStyle = color.replace(/[\d.]+\)$/g, `${opacity})`)
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        }
      }

      // Draw particle
      ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${particle.opacity})`)
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })

    rafRef.current = requestAnimationFrame(animate)
  }, [cursorX, cursorY, isTouch, cursorReaction, cursorRadius, interactionType, connectParticles, connectionDistance, color, shouldReduceMotion, speed])

  // Setup canvas
  useEffect(() => {
    if (shouldReduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    updateSize()

    // Handle resize
    const handleResize = () => {
      updateSize()
    }

    window.addEventListener('resize', handleResize)

    // Start animation
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [initParticles, animate, shouldReduceMotion])

  if (shouldReduceMotion) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 pointer-events-none', className)}
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}

/**
 * Props for FloatingParticles component
 */
export interface FloatingParticlesProps {
  /** Number of particles */
  count?: number
  /** Particle size in pixels */
  size?: number
  /** Float duration range */
  duration?: { min: number; max: number }
  /** Color of particles */
  color?: string
  /** Shape of particles */
  shape?: 'circle' | 'diamond' | 'star'
  /** Additional class names */
  className?: string
}

/**
 * Floating Particles Component
 *
 * CSS-based floating particles with random positions and durations.
 * Lighter alternative to canvas-based particles.
 *
 * @example
 * ```tsx
 * <FloatingParticles
 *   count={20}
 *   shape="diamond"
 *   color="rgba(212, 175, 55, 0.3)"
 * />
 * ```
 */
export function FloatingParticles({
  count = 20,
  size = 4,
  duration = { min: 10, max: 20 },
  color = 'rgba(212, 175, 55, 0.3)',
  shape = 'circle',
  className,
}: FloatingParticlesProps) {
  const { shouldReduceMotion } = useMotion()

  if (shouldReduceMotion) return null

  const particles = Array.from({ length: count }, (_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * -20
    const floatDuration = duration.min + Math.random() * (duration.max - duration.min)
    const particleSize = size * (0.5 + Math.random() * 0.5)

    return {
      id: i,
      left: `${left}%`,
      delay: `${delay}s`,
      duration: `${floatDuration}s`,
      size: particleSize,
    }
  })

  const shapeStyles = {
    circle: 'rounded-full',
    diamond: 'rotate-45',
    star: 'clip-path-star',
  }

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none overflow-hidden', className)}
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            'absolute animate-particle-float',
            shapeStyles[shape]
          )}
          style={{
            left: particle.left,
            bottom: '-10%',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            animationDelay: particle.delay,
            '--float-duration': particle.duration,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

/**
 * Props for DustMotes component
 */
export interface DustMotesProps {
  /** Number of dust motes */
  count?: number
  /** Size range */
  size?: { min: number; max: number }
  /** Drift speed */
  speed?: number
  /** Color tint */
  color?: string
  /** Additional class names */
  className?: string
}

/**
 * Dust Motes Component
 *
 * Creates subtle floating dust particles for atmospheric depth.
 * Perfect for adding subtle motion to luxury spaces.
 *
 * @example
 * ```tsx
 * <DustMotes count={30} speed={0.5} />
 * ```
 */
export function DustMotes({
  count = 30,
  size = { min: 1, max: 2 },
  speed = 1,
  color = 'rgba(212, 175, 55, 0.15)',
  className,
}: DustMotesProps) {
  const { shouldReduceMotion } = useMotion()

  if (shouldReduceMotion) return null

  const motes = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: size.min + Math.random() * (size.max - size.min),
    duration: 15 + Math.random() * 20,
    delay: Math.random() * -20,
  }))

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none', className)}
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {motes.map((mote) => (
        <div
          key={mote.id}
          className="absolute rounded-full opacity-40"
          style={{
            left: `${mote.x}%`,
            top: `${mote.y}%`,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            backgroundColor: color,
            animation: `particle-float ${mote.duration * speed}s ease-in-out ${mote.delay}s infinite`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Props for SparkleField component
 */
export interface SparkleFieldProps {
  /** Number of sparkles */
  count?: number
  /** Sparkle size */
  size?: number
  /** Animation speed */
  speed?: number
  /** Color of sparkles */
  color?: string
  /** Trigger sparkles on mouse move */
  interactive?: boolean
  /** Additional class names */
  className?: string
}

/**
 * Sparkle Field Component
 *
 * Creates random sparkle effects for magical accent.
 * Can be interactive (trigger on mouse) or ambient (random timing).
 *
 * @example
 * ```tsx
 * <SparkleField
 *   count={15}
 *   interactive
 *   color="#d4af37"
 * />
 * ```
 */
export function SparkleField({
  count = 15,
  size = 8,
  speed = 1,
  color = '#d4af37',
  interactive = false,
  className,
}: SparkleFieldProps) {
  const { shouldReduceMotion } = useMotion()
  const { x: cursorX, y: cursorY, isTouch } = useCursorPosition()
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; startTime: number }>>([])

  const addSparkle = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random()
    setSparkles((prev) => [...prev, { id, x, y, startTime: Date.now() }])

    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id))
    }, 1000 / speed)
  }, [speed])

  // Ambient sparkles
  useEffect(() => {
    if (interactive || shouldReduceMotion) return

    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      addSparkle(x, y)
    }, 2000 / speed)

    return () => clearInterval(interval)
  }, [interactive, speed, shouldReduceMotion, addSparkle])

  // Interactive sparkles
  useEffect(() => {
    if (!interactive || shouldReduceMotion || isTouch) return
    if (cursorX === null || cursorY === null) return

    // Throttle sparkle creation
    const lastSparkle = useRef(0)
    const now = Date.now()

    if (now - lastSparkle.current > 100) {
      addSparkle(
        cursorX + (Math.random() - 0.5) * 50,
        cursorY + (Math.random() - 0.5) * 50
      )
      lastSparkle.current = now
    }
  }, [cursorX, cursorY, interactive, shouldReduceMotion, isTouch, addSparkle])

  if (shouldReduceMotion) return null

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none', className)}
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {sparkles.map((sparkle) => {
        const elapsed = (Date.now() - sparkle.startTime) * speed
        const progress = elapsed / 1000
        const opacity = Math.sin(progress * Math.PI) * 0.8
        const scale = 1 + progress * 2

        if (progress >= 1) return null

        return (
          <div
            key={sparkle.id}
            className="absolute"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={color}
              style={{ filter: `drop-shadow(0 0 ${size / 2}px ${color})` }}
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Ambient particle system provider
 *
 * Wraps application with ambient particle effects.
 */
export interface ParticleSystemProviderProps {
  /** Type of particle system */
  type?: 'particles' | 'floating' | 'dust' | 'sparkle'
  /** Children to wrap */
  children: React.ReactNode
  /** Whether system is enabled */
  enabled?: boolean
  /** Additional configuration */
  config?: Partial<ParticleBackgroundProps> &
    Partial<FloatingParticlesProps> &
    Partial<DustMotesProps> &
    Partial<SparkleFieldProps>
  /** Additional class names */
  className?: string
}

/**
 * Particle System Provider Component
 *
 * Convenience wrapper for adding particle effects to the entire app.
 *
 * @example
 * ```tsx
 * <ParticleSystemProvider type="particles" enabled>
 *   {children}
 * </ParticleSystemProvider>
 * ```
 */
export function ParticleSystemProvider({
  type = 'particles',
  children,
  enabled = true,
  config,
  className,
}: ParticleSystemProviderProps) {
  if (!enabled) {
    return <>{children}</>
  }

  return (
    <>
      {type === 'particles' && <ParticleBackground {...(config as ParticleBackgroundProps)} className={className} />}
      {type === 'floating' && <FloatingParticles {...(config as FloatingParticlesProps)} className={className} />}
      {type === 'dust' && <DustMotes {...(config as DustMotesProps)} className={className} />}
      {type === 'sparkle' && <SparkleField {...(config as SparkleFieldProps)} className={className} />}
      {children}
    </>
  )
}
