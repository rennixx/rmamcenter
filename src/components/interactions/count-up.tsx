'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { ViewportAnimator } from '@/components/motion/MotionWrapper'
import { cn } from '@/lib/utils'

/**
 * Props for CountUp component
 */
export interface CountUpProps {
  /** Target value to count to */
  end: number
  /** Starting value (default: 0) */
  start?: number
  /** Duration of animation in milliseconds */
  duration?: number
  /** Whether to use smooth easing */
  ease?: boolean
  /** Easing function */
  easingType?: 'linear' | 'easeOut' | 'easeInOut' | 'bounce'
  /** Number of decimal places */
  decimals?: number
  /** Whether to format with commas */
  useCommas?: boolean
  /** Prefix (e.g., currency symbol) */
  prefix?: string
  /** Suffix (e.g., unit) */
  suffix?: string
  /** Whether to animate on scroll into view */
  animateOnView?: boolean
  /** Delay before starting animation (ms) */
  delay?: number
  /** Additional class names */
  className?: string
  /** Callback when animation completes */
  onComplete?: () => void
}

/**
 * Easing functions
 */
const easingFunctions = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  bounce: (t: number) => {
    const n1 = 7.5625
    const d1 = 2.75

    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  },
}

/**
 * Count Up Animation Component
 *
 * Animates a number from start to end with configurable easing and formatting.
 * Supports decimals, prefixes/suffixes, and scroll-triggered animation.
 *
 * @example
 * ```tsx
 * <CountUp end={1000} useCommas prefix="$" suffix=" USD" />
 *
 * <CountUp
 *   end={98.7}
 *   decimals={1}
 *   suffix="%"
 *   easingType="bounce"
 *   animateOnView
 * />
 * ```
 */
export function CountUp({
  end,
  start = 0,
  duration = 2000,
  ease = true,
  easingType = 'easeOut',
  decimals = 0,
  useCommas = false,
  prefix = '',
  suffix = '',
  animateOnView = false,
  delay = 0,
  className,
  onComplete,
}: CountUpProps) {
  const [count, setCount] = useState(start)
  const [hasAnimated, setHasAnimated] = useState(false)
  const { shouldReduceMotion } = useMotion()
  const rafRef = useRef<number>()
  const startTimeRef = useRef<number>()

  // Format number with commas and decimals
  const formatNumber = useCallback(
    (num: number) => {
      const fixed = num.toFixed(decimals)

      if (useCommas) {
        const parts = fixed.split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return parts.join('.')
      }

      return fixed
    },
    [decimals, useCommas]
  )

  // Animation function
  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current - delay
      const progress = Math.min(elapsed / duration, 1)

      // Apply easing
      const easedProgress = ease ? easingFunctions[easingType](progress) : progress

      // Calculate current value
      const current = start + (end - start) * easedProgress
      setCount(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
        onComplete?.()
      }
    },
    [start, end, duration, ease, easingType, delay, onComplete]
  )

  // Start animation
  const startAnimation = useCallback(() => {
    if (hasAnimated || shouldReduceMotion) {
      setCount(end)
      return
    }

    startTimeRef.current = undefined
    rafRef.current = requestAnimationFrame(animate)
    setHasAnimated(true)
  }, [animate, end, hasAnimated, shouldReduceMotion])

  // Auto-start animation when not using scroll trigger
  useEffect(() => {
    if (!animateOnView) {
      const timer = setTimeout(() => {
        startAnimation()
      }, delay)

      return () => {
        clearTimeout(timer)
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
      }
    }
  }, [animateOnView, delay, startAnimation])

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  // Content
  const content = (
    <span className={cn('font-mono', className)}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )

  // Wrap in ViewportAnimator if scroll-triggered
  if (animateOnView) {
    return <ViewportAnimator animation="fade-in" onInView={startAnimation}>{content}</ViewportAnimator>
  }

  return content
}

/**
 * Props for AnimatedStat component
 */
export interface AnimatedStatProps {
  /** Stat label */
  label: string
  /** Stat value */
  value: number
  /** Icon element */
  icon?: React.ReactNode
  /** Description text */
  description?: string
  /** Whether to show as percentage */
  isPercentage?: boolean
  /** Whether to show with currency */
  isCurrency?: boolean
  /** Number of decimal places */
  decimals?: number
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Color variant */
  variant?: 'gold' | 'white' | 'gradient'
  /** Additional class names */
  className?: string
}

/**
 * Animated Stat Component
 *
 * Pre-styled statistics card with count-up animation.
 * Perfect for "Numbers That Matter" sections with luxury aesthetic.
 *
 * @example
 * ```tsx
 * <AnimatedStat
 *   label="Championships Won"
 *   value={47}
 *   description="Over 25 years of excellence"
 *   variant="gold"
 *   size="lg"
 * />
 *
 * <AnimatedStat
 *   label="Success Rate"
 *   value={98.7}
 *   isPercentage
 *   decimals={1}
 *   icon={<Trophy />}
 * />
 * ```
 */
export function AnimatedStat({
  label,
  value,
  icon,
  description,
  isPercentage = false,
  isCurrency = false,
  decimals = 0,
  size = 'md',
  variant = 'gold',
  className,
}: AnimatedStatProps) {
  const { shouldReduceMotion } = useMotion()

  const sizeStyles = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl',
  }

  const variantStyles = {
    gold: 'text-gold',
    white: 'text-white',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold/80 to-gold',
  }

  return (
    <div
      className={cn(
        'relative p-6 rounded-lg',
        'bg-white/5 backdrop-blur-sm',
        'border border-gold/10',
        'transition-all duration-500',
        'hover:border-gold/20 hover:bg-white/10',
        className
      )}
    >
      {icon && (
        <div className="text-gold/60 mb-3">
          {icon}
        </div>
      )}

      <div className={cn('font-bold font-mono', sizeStyles[size], variantStyles[variant])}>
        {isCurrency && '$'}
        <CountUp
          end={value}
          decimals={decimals}
          animateOnView={!shouldReduceMotion}
          delay={100}
        />
        {isPercentage && '%'}
      </div>

      <div className="text-white/60 text-sm mt-2 uppercase tracking-wider">
        {label}
      </div>

      {description && (
        <div className="text-white/40 text-xs mt-1">
          {description}
        </div>
      )}
    </div>
  )
}

/**
 * Props for StatsGrid component
 */
export interface StatsGridProps {
  /** Array of stats to display */
  stats: Array<{
    label: string
    value: number
    icon?: React.ReactNode
    description?: string
    isPercentage?: boolean
    isCurrency?: boolean
    decimals?: number
  }>
  /** Number of columns */
  columns?: 2 | 3 | 4
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Color variant */
  variant?: 'gold' | 'white' | 'gradient'
  /** Additional class names */
  className?: string
}

/**
 * Stats Grid Component
 *
 * Grid of animated statistics with count-up animations.
 * Staggered animations for visual interest.
 *
 * @example
 * ```tsx
 * <StatsGrid
 *   columns={4}
 *   size="lg"
 *   stats={[
 *     { label: 'Horses Sold', value: 250 },
 *     { label: 'Championships', value: 47, icon: <Trophy /> },
 *     { label: 'Success Rate', value: 98.5, isPercentage: true, decimals: 1 },
 *     { label: 'Revenue', value: 15000000, isCurrency: true },
 *   ]}
 * />
 * ```
 */
export function StatsGrid({
  stats,
  columns = 4,
  size = 'md',
  variant = 'gold',
  className,
}: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <ViewportAnimator
          key={index}
          animation="fade-in"
          delay={index * 100}
        >
          <AnimatedStat
            {...stat}
            size={size}
            variant={variant}
          />
        </ViewportAnimator>
      ))}
    </div>
  )
}

/**
 * Hook for count-up animation
 */
export function useCountUp(
  end: number,
  options: {
    start?: number
    duration?: number
    decimals?: number
    easingType?: 'linear' | 'easeOut' | 'easeInOut' | 'bounce'
    autoStart?: boolean
  } = {}
) {
  const {
    start = 0,
    duration = 2000,
    decimals = 0,
    easingType = 'easeOut',
    autoStart = true,
  } = options

  const [count, setCount] = useState(start)
  const [isAnimating, setIsAnimating] = useState(false)
  const { shouldReduceMotion } = useMotion()
  const rafRef = useRef<number>()
  const startTimeRef = useRef<number>()

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easingFunctions[easingType](progress)

      const current = start + (end - start) * easedProgress
      setCount(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
        setIsAnimating(false)
      }
    },
    [start, end, duration, easingType]
  )

  const startAnimation = useCallback(() => {
    if (shouldReduceMotion) {
      setCount(end)
      return
    }

    setIsAnimating(true)
    startTimeRef.current = undefined
    rafRef.current = requestAnimationFrame(animate)
  }, [animate, end, shouldReduceMotion])

  const reset = useCallback(() => {
    setCount(start)
    setIsAnimating(false)
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
  }, [start])

  useEffect(() => {
    if (autoStart) {
      startAnimation()
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [autoStart, startAnimation])

  return {
    count,
    isAnimating,
    startAnimation,
    reset,
  }
}

/**
 * Count Up Timer Component
 *
 * Counts up from a specific start date/time.
 * Useful for "Years of Experience" or similar stats.
 *
 * @example
 * ```tsx
 * <CountUpTimer
 *   startDate="1998-06-15"
 *   label="Years of Excellence"
 * />
 * ```
 */
export function CountUpTimer({
  startDate,
  label,
  format = 'years',
  className,
}: {
  startDate: string | Date
  label?: string
  format?: 'years' | 'days' | 'hours'
  className?: string
}) {
  const [value, setValue] = useState(0)
  const { shouldReduceMotion } = useMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const start = new Date(startDate).getTime()
    const now = Date.now()
    const elapsed = now - start

    let calculatedValue = 0
    if (format === 'years') {
      calculatedValue = elapsed / (1000 * 60 * 60 * 24 * 365.25)
    } else if (format === 'days') {
      calculatedValue = elapsed / (1000 * 60 * 60 * 24)
    } else if (format === 'hours') {
      calculatedValue = elapsed / (1000 * 60 * 60)
    }

    setValue(calculatedValue)
  }, [startDate, format, shouldReduceMotion])

  return (
    <div className={cn('text-center', className)}>
      <div className="text-5xl font-bold font-mono text-gold">
        <CountUp end={value} decimals={format === 'years' ? 1 : 0} />
        <span className="text-2xl ml-2 text-white/60">
          {format}
        </span>
      </div>
      {label && (
        <div className="text-white/60 mt-2 uppercase tracking-wider text-sm">
          {label}
        </div>
      )}
    </div>
  )
}
