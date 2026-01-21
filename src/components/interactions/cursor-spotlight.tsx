'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { useCursorPosition } from '@/hooks/use-cursor-position'
import { cn } from '@/lib/utils'

/**
 * Props for CursorSpotlight component
 */
export interface CursorSpotlightProps {
  /** Size of the spotlight radius in pixels */
  size?: number
  /** Color of the spotlight (any valid CSS color) */
  color?: string
  /** Intensity of the spotlight effect (0-1) */
  intensity?: number
  /** How much the spotlight lags behind cursor (0-1) */
  lag?: number
  /** Blend mode for the spotlight overlay */
  blendMode?: 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn'
  /** Additional class names */
  className?: string
}

/**
 * Cursor Spotlight Component
 *
 * Creates a museum-like "Lighting Dark" effect with a radial gradient
 * spotlight that follows the user's cursor. Uses mix-blend-mode for
 * proper interaction with content below and lerping for smooth motion.
 *
 * @example
 * ```tsx
 * <CursorSpotlight
 *   size={400}
 *   intensity={0.15}
 *   color="rgba(212, 175, 55, 0.15)"
 *   lag={0.15}
 * />
 * ```
 */
export function CursorSpotlight({
  size = 400,
  color = 'rgba(212, 175, 55, 0.15)',
  intensity = 0.15,
  lag = 0.15,
  blendMode = 'screen',
  className,
}: CursorSpotlightProps) {
  const { shouldReduceMotion } = useMotion()
  const { x: cursorX, y: cursorY } = useCursorPosition()
  const spotlightRef = useRef<HTMLDivElement>(null)

  const currentX = useRef(0)
  const currentY = useRef(0)
  const targetX = useRef(0)
  const targetY = useRef(0)
  const rafId = useRef<number | undefined>(undefined)

  // Linear interpolation function
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }

  // Animate spotlight position
  const animateSpotlight = useCallback(() => {
    if (shouldReduceMotion) {
      // Instant update for reduced motion
      currentX.current = targetX.current
      currentY.current = targetY.current
    } else {
      // Smooth lerp animation
      currentX.current = lerp(currentX.current, targetX.current, lag)
      currentY.current = lerp(currentY.current, targetY.current, lag)
    }

    if (spotlightRef.current) {
      const gradient = `radial-gradient(
        ${size}px circle at ${currentX.current}px ${currentY.current}px,
        transparent 0%,
        ${color} 50%,
        transparent 100%
      )`
      spotlightRef.current.style.background = gradient
    }

    rafId.current = requestAnimationFrame(animateSpotlight)
  }, [size, color, lag, shouldReduceMotion])

  // Update target position when cursor moves
  useEffect(() => {
    if (cursorX !== null && cursorY !== null) {
      targetX.current = cursorX
      targetY.current = cursorY
    }
  }, [cursorX, cursorY])

  // Start/stop animation loop
  useEffect(() => {
    animateSpotlight()

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [animateSpotlight])

  // Don't render spotlight for reduced motion
  if (shouldReduceMotion) {
    return null
  }

  return (
    <div
      ref={spotlightRef}
      className={cn(
        'fixed inset-0 pointer-events-none z-[9998]',
        'mix-blend-' + blendMode,
        className
      )}
      style={{
        willChange: 'background',
        background: `radial-gradient(
          ${size}px circle at 0px 0px,
          transparent 0%,
          ${color} 50%,
          transparent 100%
        )`,
      }}
      aria-hidden="true"
    />
  )
}

/**
 * Configurable spotlight with preset configurations
 */
export interface ConfigurableSpotlightProps {
  /** Preset configuration */
  preset?: 'museum' | 'subtle' | 'dramatic' | 'golden'
  /** Custom configuration overrides */
  config?: Partial<CursorSpotlightProps>
  /** Additional class names */
  className?: string
}

const spotlightPresets: Record<string, Partial<CursorSpotlightProps>> = {
  museum: {
    size: 500,
    color: 'rgba(255, 250, 240, 0.12)',
    intensity: 0.12,
    lag: 0.15,
    blendMode: 'screen' as const,
  },
  subtle: {
    size: 300,
    color: 'rgba(212, 175, 55, 0.08)',
    intensity: 0.08,
    lag: 0.2,
    blendMode: 'soft-light' as const,
  },
  dramatic: {
    size: 600,
    color: 'rgba(212, 175, 55, 0.2)',
    intensity: 0.2,
    lag: 0.1,
    blendMode: 'color-dodge' as const,
  },
  golden: {
    size: 450,
    color: 'rgba(212, 175, 55, 0.15)',
    intensity: 0.15,
    lag: 0.12,
    blendMode: 'hard-light' as const,
  },
}

/**
 * Configurable Cursor Spotlight Component
 *
 * Provides preset configurations for common use cases.
 *
 * @example
 * ```tsx
 * <ConfigurableSpotlight preset="museum" />
 * <ConfigurableSpotlight preset="golden" config={{ size: 600 }} />
 * ```
 */
export function ConfigurableSpotlight({
  preset = 'museum',
  config,
  className,
}: ConfigurableSpotlightProps) {
  const presetConfig = spotlightPresets[preset] || spotlightPresets.museum

  return (
    <CursorSpotlight
      {...presetConfig}
      {...config}
      className={className}
    />
  )
}

/**
 * Spotlight Provider for app-wide spotlight
 *
 * Wraps the application to provide a global cursor-following spotlight.
 *
 * @example
 * ```tsx
 * <SpotlightProvider preset="golden">
 *   {children}
 * </SpotlightProvider>
 * ```
 * ```
 */
export function SpotlightProvider({
  preset = 'museum',
  config,
  children,
}: ConfigurableSpotlightProps & { children: React.ReactNode }) {
  return (
    <>
      <ConfigurableSpotlight preset={preset} config={config} />
      {children}
    </>
  )
}
