'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, Info, Heart, Share2, ArrowLeft } from 'lucide-react'
import { GlassCard, GlassCardGrid } from '@/components/ui/GlassCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ViewportAnimator } from '@/components/motion/MotionWrapper'
import { Display, Heading, Paragraph, Label, Caption, Text } from '@/components/ui/Typography'
import { GlassButton } from '@/components/ui/GlassButton'
import { ScrollControlled3D } from '@/components/3d/scroll-controlled-3d'
import { CanvasWrapper } from '@/components/3d/canvas-wrapper'
import * as THREE from 'three'

/**
 * Extended horse data type for detail view
 */
export interface HorseDetail {
  id: string
  name: string
  breed: string
  age: number
  gender: 'Male' | 'Female'
  color: string
  height: string
  discipline: string[]
  price: number
  images: string[]
  thumbnail?: string
  description: string
  competitionRecord?: string[]
  pedigree?: PedigreeNode
  training?: string[]
  temperament?: string
  healthStatus?: string
  location?: string
  availability?: 'available' | 'reserved' | 'sold'
  modelPath?: string // For 3D viewer
}

/**
 * Pedigree tree node
 */
export interface PedigreeNode {
  id: string
  name: string
  breed?: string
  gender?: 'stallion' | 'mare'
  achievements?: string[]
  sire?: PedigreeNode
  dam?: PedigreeNode
}

/**
 * Props for HorseDetail component
 */
export interface HorseDetailProps {
  /** Horse data to display */
  horse: HorseDetail
  /** Related horses for recommendations */
  relatedHorses?: Omit<HorseDetail, 'description' | 'pedigree'>[]
  /** Navigation callbacks */
  onBack?: () => void
  onNextHorse?: () => void
  onPrevHorse?: () => void
  /** Action callbacks */
  onInquire?: (horse: HorseDetail) => void
  onFavorite?: (horse: HorseDetail) => void
  onShare?: (horse: HorseDetail) => void
  /** Additional class names */
  className?: string
}

/**
 * Image Gallery Component
 */
function ImageGallery({
  images,
  thumbnail,
  alt
}: {
  images: string[]
  thumbnail?: string
  alt: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })

  const allImages = thumbnail ? [thumbnail, ...images] : images

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTransform({
      x: (x - 0.5) * -100,
      y: (y - 0.5) * -100,
      scale: 2
    })
  }

  const handleMouseLeave = () => {
    if (isZoomed) {
      setTransform({ x: 0, y: 0, scale: 1 })
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') setIsLightboxOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen])

  return (
    <>
      {/* Main Gallery */}
      <div className="relative">
        <ViewportAnimator animation="fade-in">
          <div
            ref={containerRef}
            className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl cursor-zoom-in group"
            onClick={() => setIsLightboxOpen(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={allImages[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: `scale(${transform.scale}) translate(${transform.x}%, ${transform.y}%)`
              }}
            />

            {/* Zoom hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
            </div>

            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gold/10 hover:bg-gold/20 backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-gold" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gold/10 hover:bg-gold/20 backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-gold" />
                </button>
              </>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-midnight/80 backdrop-blur-md">
                <Caption className="text-gold">
                  {currentIndex + 1} / {allImages.length}
                </Caption>
              </div>
            )}
          </div>
        </ViewportAnimator>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <ViewportAnimator animation="slide-up" delay={100}>
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-gold scale-105'
                      : 'border-transparent hover:border-gold/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </ViewportAnimator>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6 text-gold" />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8 text-gold" />
          </button>

          <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={allImages[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8 text-gold" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-midnight/80 backdrop-blur-md">
            <Caption className="text-gold">
              {currentIndex + 1} / {allImages.length}
            </Caption>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Info Section Component
 */
function InfoSection({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <ScrollReveal delay={delay}>
      <GlassPanel variant="elevated" className="p-6 md:p-8">
        <Heading level={4} className="mb-4 text-gold">{title}</Heading>
        {children}
      </GlassPanel>
    </ScrollReveal>
  )
}

/**
 * Horse Detail Section
 *
 * Editorial magazine-style horse detail page with full-screen gallery,
 * information sections, and 3D model integration.
 *
 * @example
 * ```tsx
 * <HorseDetail
 *   horse={horseData}
 *   relatedHorses={relatedHorses}
 *   onBack={() => router.back()}
 *   onInquire={(horse) => openContactForm(horse)}
 * />
 * ```
 */
export function HorseDetail({
  horse,
  relatedHorses = [],
  onBack,
  onNextHorse,
  onPrevHorse,
  onInquire,
  onFavorite,
  onShare,
  className,
}: HorseDetailProps) {
  const horse3DRef = useRef<THREE.Group>(null)

  return (
    <section className={`min-h-screen bg-midnight ${className || ''}`}>
      {/* Back Navigation */}
      <div className="sticky top-0 z-40 bg-midnight/80 backdrop-blur-md border-b border-gold/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <GlassButton
                variant="ghost"
                size="small"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={onBack}
              >
                Back to Portfolio
              </GlassButton>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onFavorite && (
              <GlassButton
                variant="ghost"
                size="small"
                leftIcon={<Heart className="h-4 w-4" />}
                onClick={() => onFavorite(horse)}
                aria-label="Add to favorites"
              >
                <span className="sr-only">Add to favorites</span>
              </GlassButton>
            )}
            {onShare && (
              <GlassButton
                variant="ghost"
                size="small"
                leftIcon={<Share2 className="h-4 w-4" />}
                onClick={() => onShare(horse)}
                aria-label="Share horse"
              >
                <span className="sr-only">Share horse</span>
              </GlassButton>
            )}
          </div>
        </div>
      </div>

      {/* Hero Gallery Section */}
      <div className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <ViewportAnimator animation="fade-in">
            <div className="text-center mb-8">
              <Caption className="text-gold uppercase tracking-widest mb-2">
                {horse.breed} • {horse.age} Years • {horse.gender}
              </Caption>
              <Display size="3xl" gradient="gold" className="mb-4">
                {horse.name}
              </Display>
              {horse.availability && (
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                  horse.availability === 'available'
                    ? 'bg-green-500/20 text-green-300'
                    : horse.availability === 'reserved'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {horse.availability.charAt(0).toUpperCase() + horse.availability.slice(1)}
                </span>
              )}
            </div>
          </ViewportAnimator>

          <ImageGallery
            images={horse.images}
            thumbnail={horse.thumbnail}
            alt={horse.name}
          />
        </div>
      </div>

      {/* Overview Section */}
      <div className="px-6 py-12 bg-gradient-to-b from-midnight to-hunter">
        <div className="mx-auto max-w-4xl">
          <InfoSection title="About {horse.name}" delay={0}>
            <Paragraph size="lg" maxWidth="prose">
              {horse.description}
            </Paragraph>
          </InfoSection>

          {/* Quick Stats */}
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <GlassPanel variant="dark" className="p-4 text-center">
                <Caption className="text-gold mb-1">Breed</Caption>
                <Paragraph size="sm" className="font-semibold">{horse.breed}</Paragraph>
              </GlassPanel>
              <GlassPanel variant="dark" className="p-4 text-center">
                <Caption className="text-gold mb-1">Age</Caption>
                <Paragraph size="sm" className="font-semibold">{horse.age} years</Paragraph>
              </GlassPanel>
              <GlassPanel variant="dark" className="p-4 text-center">
                <Caption className="text-gold mb-1">Height</Caption>
                <Paragraph size="sm" className="font-semibold">{horse.height}</Paragraph>
              </GlassPanel>
              <GlassPanel variant="dark" className="p-4 text-center">
                <Caption className="text-gold mb-1">Color</Caption>
                <Paragraph size="sm" className="font-semibold">{horse.color}</Paragraph>
              </GlassPanel>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Disciplines & Training */}
      {(horse.discipline.length > 0 || horse.training) && (
        <div className="px-6 py-12 bg-hunter">
          <div className="mx-auto max-w-4xl">
            {horse.discipline.length > 0 && (
              <InfoSection title="Disciplines" delay={0}>
                <div className="flex flex-wrap gap-2">
                  {horse.discipline.map((discipline, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold"
                    >
                      {discipline}
                    </span>
                  ))}
                </div>
              </InfoSection>
            )}

            {horse.training && horse.training.length > 0 && (
              <InfoSection title="Training" delay={200}>
                <ul className="space-y-2">
                  {horse.training.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gold mt-1">•</span>
                      <Paragraph size="base">{item}</Paragraph>
                    </li>
                  ))}
                </ul>
              </InfoSection>
            )}
          </div>
        </div>
      )}

      {/* Competition Record */}
      {horse.competitionRecord && horse.competitionRecord.length > 0 && (
        <div className="px-6 py-12 bg-gradient-to-b from-hunter to-midnight">
          <div className="mx-auto max-w-4xl">
            <InfoSection title="Competition Record">
              <div className="space-y-3">
                {horse.competitionRecord.map((record, index) => (
                  <GlassPanel key={index} variant="dark" className="p-4">
                    <Paragraph size="base">{record}</Paragraph>
                  </GlassPanel>
                ))}
              </div>
            </InfoSection>
          </div>
        </div>
      )}

      {/* 3D Model Viewer */}
      {horse.modelPath && (
        <div className="px-6 py-12 bg-midnight">
          <div className="mx-auto max-w-6xl">
            <ViewportAnimator animation="fade-in">
              <div className="text-center mb-8">
                <Display size="2xl" className="mb-4">
                  Interactive 3D View
                </Display>
                <Paragraph size="lg" maxWidth="prose">
                  Explore {horse.name} from every angle with our interactive 3D model viewer
                </Paragraph>
              </div>
            </ViewportAnimator>

            <ScrollReveal>
              <div className="h-[600px] rounded-2xl overflow-hidden border border-gold/20">
                <ScrollControlled3D
                  scrollRange={1000}
                  animations={[
                    {
                      target: horse3DRef,
                      property: 'rotation',
                      axis: 'y',
                      startValue: 0,
                      endValue: Math.PI * 2,
                    },
                  ]}
                  description={`3D model of ${horse.name}`}
                >
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                  <group ref={horse3DRef}>
                    {/* Placeholder - would load actual horse model */}
                    <mesh castShadow>
                      <boxGeometry args={[1.5, 2, 0.5]} />
                      <meshStandardMaterial color={horse.color.toLowerCase() === 'bay' ? '#8B4513' : '#d4af37'} metalness={0.3} roughness={0.4} />
                    </mesh>
                  </group>
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#0a0e27" roughness={1} />
                  </mesh>
                </ScrollControlled3D>
              </div>
            </ScrollReveal>

            <ViewportAnimator animation="slide-up" delay={200}>
              <Paragraph size="sm" maxWidth="prose" className="text-center mt-4 text-gold/60">
                Scroll within this section to rotate the model • Drag to explore
              </Paragraph>
            </ViewportAnimator>
          </div>
        </div>
      )}

      {/* Temperament & Health */}
      {(horse.temperament || horse.healthStatus) && (
        <div className="px-6 py-12 bg-gradient-to-b from-midnight to-hunter">
          <div className="mx-auto max-w-4xl">
            {horse.temperament && (
              <InfoSection title="Temperament" delay={0}>
                <Paragraph size="lg" maxWidth="prose">
                  {horse.temperament}
                </Paragraph>
              </InfoSection>
            )}

            {horse.healthStatus && (
              <InfoSection title="Health Status" delay={200}>
                <Paragraph size="lg" maxWidth="prose">
                  {horse.healthStatus}
                </Paragraph>
              </InfoSection>
            )}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="px-6 py-16 bg-hunter">
        <div className="mx-auto max-w-4xl text-center">
          <ViewportAnimator animation="fade-in">
            <GlassPanel variant="elevated" className="p-8 md:p-12">
              <Display size="2xl" className="mb-4">
                Interested in {horse.name}?
              </Display>
              <Paragraph size="lg" maxWidth="prose" className="mb-8">
                Contact us to schedule a viewing or learn more about this exceptional horse.
              </Paragraph>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlassButton
                  variant="primary"
                  size="large"
                  onClick={() => onInquire?.(horse)}
                >
                  Inquire Now
                </GlassButton>
                <GlassButton
                  variant="outline"
                  size="large"
                >
                  Schedule Viewing
                </GlassButton>
              </div>

              {horse.price && (
                <div className="mt-8 pt-8 border-t border-gold/10">
                  <Caption className="text-gold mb-2">Asking Price</Caption>
                  <Display size="2xl" gradient="gold">
                    ${horse.price.toLocaleString()}
                  </Display>
                </div>
              )}
            </GlassPanel>
          </ViewportAnimator>
        </div>
      </div>

      {/* Related Horses */}
      {relatedHorses.length > 0 && (
        <div className="px-6 py-12 bg-midnight">
          <div className="mx-auto max-w-7xl">
            <ViewportAnimator animation="fade-in">
              <div className="text-center mb-8">
                <Heading level={2} className="mb-4">You May Also Like</Heading>
                <Paragraph maxWidth="prose">
                  Discover more exceptional horses from our collection
                </Paragraph>
              </div>
            </ViewportAnimator>

            <ScrollReveal stagger={100}>
              <GlassCardGrid cols={3} gap="lg">
                {relatedHorses.map((relatedHorse) => (
                  <GlassCard
                    key={relatedHorse.id}
                    title={relatedHorse.name}
                    description={`${relatedHorse.breed} • ${relatedHorse.age} years`}
                    variant="elevated"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 -mt-10 -mx-10">
                      <img
                        src={relatedHorse.thumbnail || relatedHorse.images[0]}
                        alt={relatedHorse.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1 mb-4">
                      <Text size="sm">Height: {relatedHorse.height}</Text>
                      <Text size="sm">Discipline: {relatedHorse.discipline.join(', ')}</Text>
                    </div>
                  </GlassCard>
                ))}
              </GlassCardGrid>
            </ScrollReveal>
          </div>
        </div>
      )}

      {/* Navigation */}
      {(onPrevHorse || onNextHorse) && (
        <div className="px-6 py-12 bg-gradient-to-b from-midnight to-hunter border-t border-gold/10">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between">
              {onPrevHorse && (
                <GlassButton
                  variant="outline"
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                  onClick={onPrevHorse}
                >
                  Previous Horse
                </GlassButton>
              )}
              {onNextHorse && (
                <GlassButton
                  variant="outline"
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                  onClick={onNextHorse}
                >
                  Next Horse
                </GlassButton>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
