'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, ChevronDown } from 'lucide-react'
import { useMotion } from '@/components/providers/MotionProvider'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Display, Paragraph } from '@/components/ui/Typography'
import { GlassButton } from '@/components/ui/GlassButton'
import { ViewportAnimator } from '@/components/motion/MotionWrapper'
import { useLenisScroll } from '@/hooks/use-lenis'

/**
 * Props for HeroSection component
 */
export interface HeroSectionProps {
  /** Main headline text */
  headline: string
  /** Subheadline text */
  subheadline?: string
  /** Description text */
  description?: string
  /** Primary CTA text */
  ctaText?: string
  /** Secondary CTA text */
  ctaSecondary?: string
  /** Video source URL */
  videoSrc?: string
  /** Fallback image URL */
  imageSrc?: string
  /** Video poster image */
  posterSrc?: string
  /** Primary CTA click handler */
  onCtaClick?: () => void
  /** Secondary CTA click handler */
  onCtaSecondaryClick?: () => void
  /** Additional class names */
  className?: string
}

/**
 * Hero Section Component
 *
 * Full-viewport hero with video background, glassmorphic content panels,
 * progressive loading, and scroll indicator. Uses blur-up technique for video.
 *
 * @example
 * ```tsx
 * <HeroSection
 *   headline="Luxury Equestrian Excellence"
 *   subheadline="Welcome to MAM Center"
 *   description="Experience world-class equestrian facilities"
 *   videoSrc="/videos/hero.mp4"
 *   ctaText="Explore Our Services"
 * />
 * ```
 */
export function HeroSection({
  headline,
  subheadline,
  description,
  ctaText = "Explore Our Services",
  ctaSecondary,
  videoSrc,
  imageSrc,
  posterSrc,
  onCtaClick,
  onCtaSecondaryClick,
  className,
}: HeroSectionProps) {
  const { shouldReduceMotion } = useMotion()
  const { scrollTo } = useLenisScroll()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [canPlayVideo, setCanPlayVideo] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)

  // Scroll to next section
  const scrollDown = () => {
    scrollTo(window.innerHeight)
  }

  // Handle video playback toggle
  const toggleVideoPlayback = () => {
    if (!videoRef.current) return

    if (isVideoPlaying) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    } else {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  // Auto-play video when in viewport
  useEffect(() => {
    if (shouldReduceMotion || !videoRef.current || !canPlayVideo) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current
          if (!video) return

          if (entry.isIntersecting && !isVideoPlaying) {
            video.play().catch(() => {
              // Auto-play was prevented, that's okay
            })
          }
        })
      },
      { threshold: 0.5 }
    )

    const currentVideo = videoRef.current
    if (currentVideo) {
      observer.observe(currentVideo)

      return () => {
        if (currentVideo) {
          observer.unobserve(currentVideo)
        }
      }
    }
  }, [shouldReduceMotion, canPlayVideo, isVideoPlaying])

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className || ''}`}
    >
      {/* Video/Image Background */}
      {videoSrc ? (
        <div className="absolute inset-0 bg-midnight">
          {/* Low-res blurred background for progressive loading */}
          {!isVideoLoaded && imageSrc && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
              style={{ backgroundImage: `url(${imageSrc})` }}
            />
          )}

          {/* Main Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
            onCanPlay={() => {
              setCanPlayVideo(true)
              setIsVideoLoaded(true)
            }}
            onError={() => {
              // Video failed to load, show image fallback
              setIsVideoLoaded(false)
              setCanPlayVideo(false)
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/60 to-midnight/80" />
          <div className="absolute inset-0 bg-midnight/40" />
        </div>
      ) : imageSrc ? (
        <div className="absolute inset-0 bg-midnight">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/60 to-midnight/80" />
          <div className="absolute inset-0 bg-midnight/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-hunter to-midnight" />
      )}

      {/* Ambient background effects */}
      <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-gold/3 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 px-6 py-20 w-full">
        <div className="mx-auto max-w-5xl text-center">
          {/* Animated content reveal */}
          <ViewportAnimator animation="fade-in">
            {subheadline && (
              <p className="text-gold font-medium tracking-wide uppercase text-sm mb-4">
                {subheadline}
              </p>
            )}
          </ViewportAnimator>

          <ViewportAnimator animation="slide-up" delay={100}>
            <Display size="3xl" gradient="gold" className="mb-6">
              {headline}
            </Display>
          </ViewportAnimator>

          {description && (
            <ViewportAnimator animation="fade-in" delay={200}>
              <Paragraph size="lg" maxWidth="prose" className="mb-8">
                {description}
              </Paragraph>
            </ViewportAnimator>
          )}

          <ViewportAnimator animation="slide-up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton
                variant="primary"
                size="large"
                onClick={onCtaClick}
                rightIcon={<ChevronDown className="h-4 w-4" />}
              >
                {ctaText}
              </GlassButton>

              {ctaSecondary && (
                <GlassButton variant="secondary" size="large" onClick={onCtaSecondaryClick}>
                  {ctaSecondary}
                </GlassButton>
              )}

              {/* Video control for accessibility */}
              {videoSrc && (
                <button
                  onClick={toggleVideoPlayback}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
                  aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                >
                  {isVideoPlaying ? (
                    <Pause className="h-5 w-5 text-gold" />
                  ) : (
                    <Play className="h-5 w-5 text-gold" />
                  )}
                </button>
              )}
            </div>
          </ViewportAnimator>
        </div>
      </div>

      {/* Scroll Indicator */}
      {!shouldReduceMotion && (
        <ViewportAnimator animation="fade-in" delay={500}>
          <button
            onClick={scrollDown}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/60 hover:text-gold transition-colors"
            aria-label="Scroll to explore more"
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </button>
        </ViewportAnimator>
      )}
    </section>
  )
}
