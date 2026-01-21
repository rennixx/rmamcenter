'use client'

import { useState, useCallback, useRef } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'

/**
 * Magnetic effect hook
 * Manages GSAP spring animation for magnetic element movement
 */
export function useMagneticEffect(options: {
  strength?: number
  disabled?: boolean
}) {
  const { strength = 0.3, disabled = false } = options
  const { shouldReduceMotion } = useMotion()

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const gsapRef = useRef<any>(null)

  const springTo = useCallback((targetPosition: { x: number; y: number }) => {
    if (disabled || shouldReduceMotion) {
      // Instant update for disabled/reduced motion
      setPosition(targetPosition)
      return
    }

    // Dynamic import GSAP
    const animate = async () => {
      try {
        if (!gsapRef.current) {
          const gsapModule = await import('gsap')
          gsapRef.current = gsapModule.gsap
        }

        if (gsapRef.current) {
          gsapRef.current.to(position, {
            x: targetPosition.x,
            y: targetPosition.y,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
          })
        }
      } catch (error) {
        // Fallback to instant update if GSAP fails
        setPosition(targetPosition)
      }
    }

    animate()
  }, [disabled, shouldReduceMotion, position])

  const reset = useCallback(() => {
    springTo({ x: 0, y: 0 })
  }, [springTo])

  return {
    position,
    springTo,
    reset,
  }
}

/**
 * Hover light effect hook
 * Creates dynamic lighting effect on hover based on cursor position
 */
export function useHoverLight(options: {
  intensity?: number
  color?: string
  disabled?: boolean
}) {
  const { intensity = 0.3, color = 'rgba(212, 175, 55, 0.3)', disabled = false } = options
  const { shouldReduceMotion } = useMotion()
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 50 }) // percentages
  const elementRef = useRef<HTMLElement>(null)

  const updateLightPosition = useCallback((e: MouseEvent) => {
    if (disabled || shouldReduceMotion || !elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setLightPosition({ x, y })
  }, [disabled, shouldReduceMotion])

  const resetLight = useCallback(() => {
    setLightPosition({ x: 50, y: 50 })
  }, [])

  const bind = useCallback((element: HTMLElement | null) => {
    elementRef.current = element

    if (element && !disabled && !shouldReduceMotion) {
      element.addEventListener('mousemove', updateLightPosition as any)
      element.addEventListener('mouseleave', resetLight as any)
    }

    return () => {
      if (element && !disabled) {
        element.removeEventListener('mousemove', updateLightPosition as any)
        element.removeEventListener('mouseleave', resetLight as any)
      }
    }
  }, [disabled, shouldReduceMotion, updateLightPosition, resetLight])

  return {
    lightPosition,
    bind,
    elementRef,
  }
}
