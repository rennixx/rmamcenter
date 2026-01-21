'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { cn } from '@/lib/utils'

// ============================================================================
// MOTION WRAPPER
// ============================================================================

/**
 * Animation types supported by MotionWrapper
 */
type AnimationType =
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'scale-out'
  | 'rotate-in'
  | 'bounce'
  | 'shake'
  | 'pulse'
  | 'none'

/**
 * Props for the MotionWrapper component
 */
export interface MotionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation type to apply */
  animation?: AnimationType
  /** Delay before animation starts (in ms) */
  delay?: number
  /** Duration of animation (in ms) */
  duration?: number
  /** Custom easing function */
  easing?: string
  /** Whether to animate on mount */
  animateOnMount?: boolean
  /** Whether to animate on hover */
  animateOnHover?: boolean
  /** Whether animation should repeat */
  repeat?: boolean
  /** Repeat delay (in ms) */
  repeatDelay?: number
  /** Child elements */
  children: React.ReactNode
  /** Additional class names */
  className?: string
}

/**
 * Animation configurations
 */
const animations: Record<AnimationType, { from: string; to: string }> = {
  'fade-in': {
    from: 'opacity: 0; transform: translateY(0);',
    to: 'opacity: 1; transform: translateY(0);',
  },
  'fade-out': {
    from: 'opacity: 1;',
    to: 'opacity: 0;',
  },
  'slide-up': {
    from: 'opacity: 0; transform: translateY(20px);',
    to: 'opacity: 1; transform: translateY(0);',
  },
  'slide-down': {
    from: 'opacity: 0; transform: translateY(-20px);',
    to: 'opacity: 1; transform: translateY(0);',
  },
  'slide-left': {
    from: 'opacity: 0; transform: translateX(20px);',
    to: 'opacity: 1; transform: translateX(0);',
  },
  'slide-right': {
    from: 'opacity: 0; transform: translateX(-20px);',
    to: 'opacity: 1; transform: translateX(0);',
  },
  'scale-in': {
    from: 'opacity: 0; transform: scale(0.95);',
    to: 'opacity: 1; transform: scale(1);',
  },
  'scale-out': {
    from: 'opacity: 1; transform: scale(1);',
    to: 'opacity: 0; transform: scale(0.95);',
  },
  'rotate-in': {
    from: 'opacity: 0; transform: rotate(-5deg);',
    to: 'opacity: 1; transform: rotate(0deg);',
  },
  bounce: {
    from: 'transform: translateY(0);',
    to: 'transform: translateY(-10px);',
  },
  shake: {
    from: 'transform: translateX(0);',
    to: 'transform: translateX(-5px);',
  },
  pulse: {
    from: 'opacity: 1; transform: scale(1);',
    to: 'opacity: 0.8; transform: scale(1.05);',
  },
  none: {
    from: '',
    to: '',
  },
}

/**
 * Motion Wrapper Component
 *
 * Wraps children in a motion-aware container that respects user motion preferences.
 * Provides CSS-based animations with fallback for reduced motion.
 *
 * @example
 * ```tsx
 * <MotionWrapper animation="slide-up" delay={100}>
 *   <p>This content will slide up on mount</p>
 * </MotionWrapper>
 *
 * <MotionWrapper animation="fade-in" animateOnHover>
 *   <div>Hover me to see animation</div>
 * </MotionWrapper>
 * ```
 */
export function MotionWrapper({
  animation = 'fade-in',
  delay = 0,
  duration = 500,
  easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  animateOnMount = true,
  animateOnHover = false,
  repeat = false,
  repeatDelay = 0,
  children,
  className,
  ...props
}: MotionWrapperProps) {
  const { shouldReduceMotion } = useMotion()
  const [isVisible, setIsVisible] = useState(!animateOnMount)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Handle mount animation
  useEffect(() => {
    if (!animateOnMount || shouldReduceMotion) {
      setIsVisible(true)
      return
    }

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [animateOnMount, delay, shouldReduceMotion])

  // Handle repeat animation
  useEffect(() => {
    if (!repeat || shouldReduceMotion) return

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => setIsVisible(true), 50)
    }, duration + delay + repeatDelay)

    return () => clearInterval(interval)
  }, [repeat, duration, delay, repeatDelay, shouldReduceMotion])

  // Animation config
  const anim = animations[animation]

  // Build inline styles
  const inlineStyle: React.CSSProperties = {
    animation: !shouldReduceMotion && (isVisible || isHovered)
      ? `${animation}-custom ${duration}ms ${easing} forwards`
      : undefined,
    animationDelay: !shouldReduceMotion && !isVisible && animateOnMount ? `${delay}ms` : undefined,
  }

  return (
    <>
      <div
        ref={ref}
        className={cn('motion-wrapper', className)}
        style={inlineStyle}
        onMouseEnter={() => animateOnHover && setIsHovered(true)}
        onMouseLeave={() => animateOnHover && setIsHovered(false)}
        {...props}
      >
        {children}
      </div>

      {/* Inject keyframes for this animation */}
      {!shouldReduceMotion && (
        <style>{`
          @keyframes ${animation}-custom {
            from {
              ${anim.from}
            }
            to {
              ${anim.to}
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .motion-wrapper {
              animation: none !important;
              transition: none !important;
            }
          }
        `}</style>
      )}
    </>
  )
}

// ============================================================================
// STAGGER CONTAINER
// ============================================================================

/**
 * Props for StaggerContainer component
 */
export interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay between each child animation (in ms) */
  staggerDelay?: number
  /** Animation type for children */
  animation?: AnimationType
  /** Duration of each child animation (in ms) */
  duration?: number
  /** Child elements */
  children: React.ReactNode
}

/**
 * Stagger Container Component
 *
 * Animates children with a stagger delay between each one.
 * Automatically adds MotionWrapper to direct children.
 *
 * @example
 * ```tsx
 * <StaggerContainer staggerDelay={100} animation="slide-up">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggerContainer>
 * ```
 */
export function StaggerContainer({
  staggerDelay = 100,
  animation = 'slide-up',
  duration = 400,
  children,
  className,
  ...props
}: StaggerContainerProps) {
  const { shouldReduceMotion } = useMotion()

  // Clone children and add stagger delay
  const childrenWithDelay = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child

    return (
      <MotionWrapper
        key={child.key || index}
        animation={shouldReduceMotion ? 'none' : animation}
        delay={shouldReduceMotion ? 0 : index * staggerDelay}
        duration={duration}
      >
        {child}
      </MotionWrapper>
    )
  })

  return (
    <div className={className} {...props}>
      {childrenWithDelay}
    </div>
  )
}

// ============================================================================
// VIEWPORT ANIMATOR
// ============================================================================

/**
 * Props for ViewportAnimator component
 */
export interface ViewportAnimatorProps extends MotionWrapperProps {
  /** Threshold for intersection (0-1) */
  threshold?: number
  /** Root margin for intersection */
  rootMargin?: string
  /** Whether to animate only once */
  once?: boolean
}

/**
 * Viewport Animator Component
 *
 * Animates children when they enter the viewport using Intersection Observer.
 *
 * @example
 * ```tsx
 * <ViewportAnimator animation="slide-up" once>
 *   <p>This will animate when scrolled into view</p>
 * </ViewportAnimator>
 * ```
 */
export function ViewportAnimator({
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
  animation = 'slide-up',
  delay = 0,
  duration = 500,
  children,
  className,
  ...props
}: ViewportAnimatorProps) {
  const { shouldReduceMotion } = useMotion()
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setIsInView(true)
          if (once) setHasAnimated(true)
        } else if (!once && !entry.isIntersecting) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, once, hasAnimated, shouldReduceMotion])

  return (
    <div ref={ref} className={className}>
      <MotionWrapper
        animation={isInView ? animation : 'none'}
        delay={isInView ? delay : 0}
        duration={duration}
        {...props}
      >
        {children}
      </MotionWrapper>
    </div>
  )
}
