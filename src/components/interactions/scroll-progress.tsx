'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { cn } from '@/lib/utils'

/**
 * Props for ScrollProgress component
 */
export interface ScrollProgressProps {
  /** Position of the progress indicator */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /** Color of the progress bar */
  color?: string
  /** Height of the progress bar (for top/bottom) or width (for left/right) */
  size?: number
  /** Whether to show percentage indicator */
  showPercentage?: boolean
  /** Style variant */
  variant?: 'solid' | 'gradient' | 'glow' | 'glass'
  /** Z-index for the indicator */
  zIndex?: number
  /** Whether to hide when at top of page */
  hideAtTop?: boolean
  /** Additional class names */
  className?: string
}

/**
 * Scroll Progress Indicator Component
 *
 * Displays reading progress as a fixed position bar that fills as you scroll.
 * Supports multiple positions and visual variants to match luxury aesthetic.
 *
 * @example
 * ```tsx
 * <ScrollProgress position="top" variant="gradient" />
 *
 * <ScrollProgress
 *   position="right"
 *   variant="glass"
 *   showPercentage
 * />
 * ```
 */
export function ScrollProgress({
  position = 'top',
  color = 'rgba(212, 175, 55, 0.8)',
  size = 3,
  showPercentage = false,
  variant = 'gradient',
  zIndex = 50,
  hideAtTop = true,
  className,
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(!hideAtTop)
  const { shouldReduceMotion } = useMotion()
  const rafRef = useRef<number | undefined>(undefined)
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (shouldReduceMotion) return

    const handleScroll = () => {
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = (scrollTop / docHeight) * 100

        setProgress(Math.min(100, Math.max(0, scrollPercent)))

        // Hide at top if enabled
        if (hideAtTop) {
          setIsVisible(scrollTop > 50)
        }

        rafRef.current = undefined
      })
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [shouldReduceMotion, hideAtTop])

  // Don't render for reduced motion
  if (shouldReduceMotion) return null

  // Position styles
  const positionStyles: Record<typeof position, string> = {
    top: 'fixed top-0 left-0 right-0 h-px',
    bottom: 'fixed bottom-0 left-0 right-0 h-px',
    left: 'fixed top-0 bottom-0 left-0 w-px',
    right: 'fixed top-0 bottom-0 right-0 w-px',
  }

  // Size styles
  const sizeStyle = position === 'top' || position === 'bottom'
    ? { height: `${size}px` }
    : { width: `${size}px` }

  // Variant styles
  const variantStyles: Record<typeof variant, string> = {
    solid: `bg-[${color}]`,
    gradient: 'bg-gradient-to-r from-gold via-gold/80 to-gold',
    glow: 'shadow-[0_0_10px_rgba(212,175,55,0.5)]',
    glass: 'backdrop-blur-sm bg-gold/30',
  }

  return (
    <div
      className={cn(
        positionStyles[position],
        'z-[50]',
        'transition-opacity duration-300',
        !isVisible && 'opacity-0',
        className
      )}
      style={{ zIndex, ...sizeStyle }}
      aria-hidden="true"
    >
      {/* Background track */}
      <div
        className={cn(
          'absolute inset-0 bg-gold/10',
          variant === 'glass' && 'bg-gold/5'
        )}
      />

      {/* Progress fill */}
      <div
        className={cn(
          'absolute bg-gold',
          variant === 'gradient' && 'bg-gradient-to-r from-gold/60 via-gold to-gold/60',
          variant === 'glow' && 'shadow-[0_0_15px_rgba(212,175,55,0.6)]',
          variant === 'glass' && 'backdrop-blur-sm bg-gold/40',
          position === 'top' || position === 'bottom'
            ? 'left-0 top-0 bottom-0 h-full'
            : 'top-0 left-0 right-0 w-full',
          'transition-transform duration-75 ease-out'
        )}
        style={{
          ...sizeStyle,
          transform: position === 'top' || position === 'bottom'
            ? `translateX(${progress - 100}%)`
            : `translateY(${progress - 100}%)`,
          transformOrigin: position === 'top' || position === 'bottom' ? 'left' : 'top',
          backgroundColor: variant === 'solid' ? color : undefined,
        }}
      />

      {/* Percentage indicator */}
      {showPercentage && (
        <div
          className={cn(
            'absolute text-xs font-mono text-gold/80 bg-midnight/90 px-2 py-1 rounded',
            'transition-opacity duration-300',
            !isVisible && 'opacity-0',
            position === 'top' && '-bottom-8 left-1/2 -translate-x-1/2',
            position === 'bottom' && '-top-8 left-1/2 -translate-x-1/2',
            position === 'left' && '-right-8 top-1/2 -translate-y-1/2',
            position === 'right' && '-left-8 top-1/2 -translate-y-1/2'
          )}
          style={{ zIndex: zIndex + 1 }}
        >
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

/**
 * Circular scroll progress indicator
 */
export interface CircularScrollProgressProps {
  /** Size of the circle in pixels */
  size?: number
  /** Stroke width */
  strokeWidth?: number
  /** Position on screen */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right'
  /** Color of the progress */
  color?: string
  /** Background color of the track */
  trackColor?: string
  /** Z-index */
  zIndex?: number
  /** Whether to show percentage in center */
  showPercentage?: boolean
  /** Additional class names */
  className?: string
}

/**
 * Circular Scroll Progress Component
 *
 * Displays scroll progress as a circular SVG indicator.
 * Perfect for elegant reading progress display.
 *
 * @example
 * ```tsx
 * <CircularScrollProgress position="bottom-right" showPercentage />
 *
 * <CircularScrollProgress
 *   position="center-right"
 *   size={60}
 *   strokeWidth={4}
 * />
 * ```
 */
export function CircularScrollProgress({
  size = 50,
  strokeWidth = 3,
  position = 'bottom-right',
  color = '#d4af37',
  trackColor = 'rgba(212, 175, 55, 0.1)',
  zIndex = 50,
  showPercentage = false,
  className,
}: CircularScrollProgressProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { shouldReduceMotion } = useMotion()
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (shouldReduceMotion) return

    const handleScroll = () => {
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = (scrollTop / docHeight) * 100

        setProgress(Math.min(100, Math.max(0, scrollPercent)))
        setIsVisible(scrollTop > 100)

        rafRef.current = undefined
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [shouldReduceMotion])

  // Don't render for reduced motion
  if (shouldReduceMotion) return null

  // Position styles
  const positionStyles: Record<typeof position, string> = {
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'center-right': 'fixed top-1/2 right-6 -translate-y-1/2',
  }

  // SVG calculations
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div
      className={cn(
        positionStyles[position],
        'transition-opacity duration-300',
        !isVisible && 'opacity-0 pointer-events-none',
        className
      )}
      style={{ zIndex }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.3))' }}
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-75 ease-out"
        />
      </svg>

      {/* Percentage in center */}
      {showPercentage && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'text-xs font-mono font-bold'
          )}
          style={{ color, fontSize: `${size / 4}px` }}
        >
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

/**
 * Reading time and scroll progress combined
 */
export interface ReadingProgressProps {
  /** Estimated reading time in minutes */
  readingTime?: number
  /** Current section indicator */
  currentSection?: string
  /** Position on screen */
  position?: 'top' | 'bottom'
  /** Additional class names */
  className?: string
}

/**
 * Reading Progress Component
 *
 * Combines scroll progress with reading time and section indicator.
 * Ideal for long-form content and articles.
 *
 * @example
 * ```tsx
 * <ReadingProgress
 *   readingTime={5}
 *   currentSection="Introduction"
 *   position="top"
 * />
 * ```
 */
export function ReadingProgress({
  readingTime,
  currentSection,
  position = 'top',
  className,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)
  const { shouldReduceMotion } = useMotion()
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (shouldReduceMotion) return

    const handleScroll = () => {
      if (rafRef.current) return

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = (scrollTop / docHeight) * 100

        setProgress(Math.min(100, Math.max(0, scrollPercent)))
        rafRef.current = undefined
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-40 px-6 py-2',
        'bg-midnight/80 backdrop-blur-md',
        'border-b border-gold/10',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          {readingTime && (
            <span className="text-gold/60">
              {readingTime} min read
            </span>
          )}
          {currentSection && (
            <span className="text-white/80">
              {currentSection}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gold/60 font-mono">
            {Math.round(progress)}%
          </span>
          <div className="w-32 h-1 bg-gold/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold/60 to-gold transition-transform duration-75 ease-out"
              style={{ transform: `translateX(${progress - 100}%)` }}
            />
          </div>
        </div>
      </div>

      {/* Progress bar at edge */}
      <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent">
        <div
          className="h-full bg-gold"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Scroll progress hook for custom implementations
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const { shouldReduceMotion } = useMotion()
  const rafRef = useRef<number | undefined>(undefined)
  const scrollTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (shouldReduceMotion) return

    const handleScroll = () => {
      if (rafRef.current) return

      setIsScrolling(true)

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Set new timeout to detect when scrolling stops
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false)
      }, 150) as unknown as number

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = (scrollTop / docHeight) * 100

        setProgress(Math.min(100, Math.max(0, scrollPercent)))
        rafRef.current = undefined
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [shouldReduceMotion])

  return {
    progress,
    isScrolling,
  }
}
