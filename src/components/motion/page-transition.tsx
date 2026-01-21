'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useMotion } from '@/components/providers/MotionProvider'
import { ANIMATION } from '@/lib/constants'

/**
 * Props for PageTransition component
 */
export interface PageTransitionProps {
  /** Child elements (page content) */
  children: React.ReactNode
}

/**
 * Page Transition Component
 *
 * Provides seamless visual continuity between route changes using a curtain effect.
 * Monitors pathname changes and animates a full-screen overlay during transitions.
 *
 * @example
 * ```tsx
 * function Layout({ children }) {
 *   return (
 *     <PageTransition>
 *       {children}
 *     </PageTransition>
 *   )
 * }
 * ```
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const { shouldReduceMotion } = useMotion()
  const [displayedChildren, setDisplayedChildren] = useState(children)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const curtainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip animation if motion is reduced
    if (shouldReduceMotion) {
      setDisplayedChildren(children)
      return
    }

    // Only animate on pathname change
    if (pathname) {
      const performTransition = async () => {
        setIsTransitioning(true)

        // Dynamic import GSAP
        const { gsap } = await import('gsap')

        const curtain = curtainRef.current
        if (!curtain) {
          setDisplayedChildren(children)
          setIsTransitioning(false)
          return
        }

        // Create timeline for transition sequence
        const tl = gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false)
          },
        })

        // Step 1: Animate curtain from right to left covering the screen
        tl.to(curtain, {
          x: '0%',
          duration: ANIMATION.DURATION_PAGE / 2,
          ease: 'power3.inOut',
        })

        // Step 2: Update displayed children and scroll to top when curtain covers screen
        tl.call(() => {
          setDisplayedChildren(children)
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        })

        // Step 3: Add brief delay with curtain covering screen
        tl.to(curtain, {
          duration: 0.1,
        })

        // Step 4: Animate curtain from left to right revealing new content
        tl.to(curtain, {
          x: '100%',
          duration: ANIMATION.DURATION_PAGE / 2,
          ease: 'power3.inOut',
        })
      }

      performTransition()
    } else {
      // Initial render, just set children
      setDisplayedChildren(children)
    }
  }, [pathname, children, shouldReduceMotion])

  // Reset curtain position on unmount
  useEffect(() => {
    return () => {
      const curtain = curtainRef.current
      if (curtain && !shouldReduceMotion) {
        gsap.set(curtain, { x: '100%' })
      }
    }
  }, [shouldReduceMotion])

  return (
    <>
      {/* Page Content */}
      <div className="page-content">{displayedChildren}</div>

      {/* Transition Curtain */}
      {!shouldReduceMotion && (
        <div
          ref={curtainRef}
          className="fixed inset-0 bg-midnight pointer-events-none z-[9999]"
          style={{
            transform: 'translateX(100%)',
            willChange: 'transform',
          }}
          aria-hidden="true"
        />
      )}
    </>
  )
}
