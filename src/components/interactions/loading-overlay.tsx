'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ViewportAnimator } from '@/components/motion/MotionWrapper'
import { Text } from '@/components/ui/Typography'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMotion } from '@/components/providers/MotionProvider'

/**
 * Loading state types
 */
export type LoadingState = 'loading' | 'success' | 'error' | 'idle'

/**
 * Props for LoadingOverlay component
 */
export interface LoadingOverlayProps {
  /** Current loading state */
  state?: LoadingState
  /** Progress value (0-100) */
  progress?: number
  /** Loading message to display */
  message?: string
  /** Blur amount for background blur effect */
  blur?: number
  /** Whether to show as full-screen overlay */
  fullScreen?: boolean
  /** Minimum duration to show loading (ms) - prevents flicker */
  minDuration?: number
  /** onComplete callback when loading finishes */
  onComplete?: () => void
  /** Additional class names */
  className?: string
  /** Children to render behind overlay */
  children?: React.ReactNode
}

/**
 * Skeleton loading props
 */
export interface SkeletonProps {
  /** Width of skeleton */
  width?: string | number
  /** Height of skeleton */
  height?: string | number
  /** Whether to animate shimmer effect */
  animate?: boolean
  /** Variant for different shapes */
  variant?: 'rect' | 'circle' | 'text'
  /** Number of text lines for text variant */
  lines?: number
  /** Additional class names */
  className?: string
}

/**
 * Loading Overlay Component
 *
 * Full-screen or contained loading overlay with blur-up technique.
 * Shows progress for large file downloads and maintains brand aesthetic.
 *
 * @example
 * ```tsx
 * <LoadingOverlay
 *   state="loading"
 *   message="Loading 3D model..."
 *   progress={45}
 *   minDuration={1000}
 * />
 * ```
 */
export function LoadingOverlay({
  state: initialState = 'idle',
  progress = 0,
  message,
  blur = 8,
  fullScreen = true,
  minDuration = 0,
  onComplete,
  className,
  children,
}: LoadingOverlayProps) {
  const [state, setState] = useState<LoadingState>(initialState)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [startTime] = useState(Date.now())
  const { shouldReduceMotion } = useMotion()

  // Handle min duration to prevent flicker
  useEffect(() => {
    if (state === 'success' || state === 'error') {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, minDuration - elapsed)

      const timeout = setTimeout(() => {
        onComplete?.()
      }, remaining)

      return () => clearTimeout(timeout)
    }
  }, [state, minDuration, startTime, onComplete])

  // Animate progress smoothly
  useEffect(() => {
    if (state !== 'loading') return

    const targetProgress = progress
    const duration = shouldReduceMotion ? 0 : 300

    if (shouldReduceMotion) {
      setDisplayProgress(targetProgress)
      return
    }

    const startTime = Date.now()
    const startProgress = displayProgress

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      const current = startProgress + (targetProgress - startProgress) * progress

      setDisplayProgress(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayProgress(targetProgress)
      }
    }

    requestAnimationFrame(animate)
  }, [progress, shouldReduceMotion, state, displayProgress])

  // Close overlay after success
  useEffect(() => {
    if (state === 'success') {
      const timer = setTimeout(() => {
        setState('idle')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [state])

  // Store state for use in JSX before early return
  const currentState = state as LoadingState

  if (currentState === 'idle') {
    return <>{children}</>
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Loading spinner */}
      {currentState === 'loading' && (
        <ViewportAnimator animation="fade-in">
          <div className="relative">
            <Loader2
              className={cn(
                'h-12 w-12 text-gold animate-spin',
                shouldReduceMotion && 'animate-spin-slow'
              )}
            />
          </div>
        </ViewportAnimator>
      )}

      {/* Success checkmark */}
      {currentState === 'success' && (
        <ViewportAnimator animation="fade-in">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </ViewportAnimator>
      )}

      {/* Error icon */}
      {currentState === 'error' && (
        <ViewportAnimator animation="fade-in">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </ViewportAnimator>
      )}

      {/* Message */}
      {message && (
        <ViewportAnimator animation="fade-in" delay={100}>
          <Text size="sm" className="text-center max-w-xs">
            {message}
          </Text>
        </ViewportAnimator>
      )}

      {/* Progress bar */}
      {currentState === 'loading' && (
        <ViewportAnimator animation="fade-in" delay={200}>
          <div className="w-48">
            <div className="flex items-center justify-between text-xs text-gold/60 mb-2">
              <span>Loading...</span>
              <span>{Math.round(displayProgress)}%</span>
            </div>
            <div className="h-1 bg-gold/20 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full bg-gradient-to-r from-gold/80 to-gold transition-all duration-300',
                  shouldReduceMotion && 'transition-none'
                )}
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
        </ViewportAnimator>
      )}
    </div>
  )

  return (
    <>
      {/* Background blur effect */}
      {children && (
        <div
          className={cn(
            fullScreen ? 'fixed inset-0' : 'absolute inset-0',
            'transition-all duration-500',
            'backdrop-blur-md bg-midnight/40'
          )}
        >
          {children}
        </div>
      )}

      {/* Loading overlay */}
      <div
        className={cn(
          fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10',
          'flex items-center justify-center',
          'bg-midnight/80 backdrop-blur-sm',
          'transition-opacity duration-300',
          className
        )}
      >
        <GlassPanel variant="dark" className="p-8">
          {content}
        </GlassPanel>
      </div>
    </>
  )
}

/**
 * Skeleton Loading Component
 *
 * Glassmorphic placeholder with shimmer animation for content loading.
 *
 * @example
 * ```tsx
 * <Skeleton width="100%" height={200} animate />
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="circle" width={48} height={48} />
 * ```
 */
export function Skeleton({
  width = '100%',
  height = '100%',
  animate = true,
  variant = 'rect',
  lines = 3,
  className,
}: SkeletonProps) {
  const { shouldReduceMotion } = useMotion()

  const baseClasses = 'bg-gold/10 rounded'

  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4',
              animate && !shouldReduceMotion && 'animate-shimmer'
            )}
            style={{ width: i === lines - 1 ? '75%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'circle') {
    return (
      <div
        className={cn(
          baseClasses,
          'rounded-full',
          animate && !shouldReduceMotion && 'animate-shimmer'
        )}
        style={{ width, height }}
      />
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        animate && !shouldReduceMotion && 'animate-shimmer'
      )}
      style={{ width, height }}
    />
  )
}

/**
 * Image with blur-up loading technique
 */
export function BlurUpImage({
  src,
  alt,
  className,
  style,
}: {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-500',
        !isLoaded && 'opacity-0',
        className
      )}
      style={{
        filter: isLoaded ? 'none' : 'blur(20px)',
        ...style,
      }}
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        // Fallback or error handling
      }}
    />
  )
}

/**
 * Page transition loader
 *
 * Full-page loading overlay for route transitions.
 */
export function PageLoader({
  isLoading,
  message = 'Loading...',
}: {
  isLoading: boolean
  message?: string
}) {
  const { shouldReduceMotion } = useMotion()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-midnight">
      <div className="text-center">
        <ViewportAnimator animation="fade-in">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <Loader2
              className={cn(
                'h-16 w-16 text-gold animate-spin',
                shouldReduceMotion && 'animate-spin-slow'
              )}
            />
          </div>
          <Text size="lg" className="text-gold">
            {message}
          </Text>
        </ViewportAnimator>
      </div>
    </div>
  )
}

// Add shimmer animation to globals if needed
// This would typically go in your CSS file:
// @keyframes shimmer {
//   0% { background-position: -1000px 0; }
//   100% { background-position: 1000px 0; }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
//   background: linear-gradient(
//     90deg,
//     transparent,
//     rgba(212, 175, 55, 0.1),
//     transparent
//   );
//   background-size: 1000px 100%;
// }
