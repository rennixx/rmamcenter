'use client'

import React, { useState } from 'react'
import { Heart, Award, TrendingUp, Calendar, Info, Filter, ChevronDown } from 'lucide-react'
import { GlassCard, GlassCardGrid } from '@/components/ui/GlassCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ViewportAnimator } from '@/components/motion/MotionWrapper'
import { Display, Heading, Paragraph, Label, Caption, Text } from '@/components/ui/Typography'
import { GlassButton } from '@/components/ui/GlassButton'
import { cn } from '@/lib/utils'

/**
 * Breeding stallion data
 */
export interface Stallion {
  id: string
  name: string
  breed: string
  age: number
  height: string
  color: string
  image: string
  images?: string[]
  studFee: number
  specialties: string[]
  achievements: string[]
  offspring?: string[]
  temperament?: string
  healthStatus?: string
  location?: string
  bookingStatus?: 'available' | 'limited' | 'fully_booked'
  pedigree?: {
    sire: string
    dam: string
    grandsire?: string
  }
  statistics?: {
    foalsBorn: number
    competitionWinners: number
    championOffspring: number
  }
}

/**
 * Breeding program information
 */
export interface BreedingInfo {
  title: string
  description: string
  process: ProcessStep[]
  requirements: string[]
  timeline?: string
  guarantee?: string
}

/**
 * Process step for breeding workflow
 */
export interface ProcessStep {
  title: string
  description: string
  duration?: string
  icon?: React.ReactNode
}

/**
 * Props for BreedingProgram component
 */
export interface BreedingProgramProps {
  /** Featured stallions */
  stallions: Stallion[]
  /** Breeding program information */
  programInfo: BreedingInfo
  /** Layout variant */
  variant?: 'showcase' | 'detailed' | 'minimal'
  /** Action callbacks */
  onStallionClick?: (stallion: Stallion) => void
  onInquire?: (stallion: Stallion) => void
  onBookStud?: (stallion: Stallion) => void
  /** Additional class names */
  className?: string
}

/**
 * Stallion Card Component
 */
function StallionCard({
  stallion,
  onStallionClick,
  onInquire,
  variant = 'showcase',
}: {
  stallion: Stallion
  onStallionClick?: (stallion: Stallion) => void
  onInquire?: (stallion: Stallion) => void
  variant?: 'showcase' | 'detailed' | 'minimal'
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <GlassCard
      title={stallion.name}
      description={`${stallion.breed} • ${stallion.age} years • ${stallion.color}`}
      variant="elevated"
      onClick={() => onStallionClick?.(stallion)}
      action={
        <GlassButton
          variant="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onInquire?.(stallion)
          }}
        >
          Inquire
        </GlassButton>
      }
    >
      {/* Image */}
      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 -mt-10 -mx-10">
        <img
          src={stallion.image}
          alt={stallion.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Metadata */}
      <div className="space-y-1 mb-4">
        <Text size="sm">Height: {stallion.height}</Text>
        <Text size="sm">Stud Fee: ${stallion.studFee.toLocaleString()}</Text>
      </div>
      {/* Booking Status Badge */}
      {stallion.bookingStatus && (
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold',
            stallion.bookingStatus === 'available' && 'bg-green-500/20 text-green-300',
            stallion.bookingStatus === 'limited' && 'bg-yellow-500/20 text-yellow-300',
            stallion.bookingStatus === 'fully_booked' && 'bg-red-500/20 text-red-300'
          )}>
            {stallion.bookingStatus === 'fully_booked' ? 'Fully Booked' :
             stallion.bookingStatus === 'limited' ? 'Limited Availability' : 'Available'}
          </span>
        </div>
      )}

      {/* Expandable Details */}
      {variant === 'detailed' && (
        <div className="mt-4 border-t border-gold/10 pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(!showDetails)
            }}
            className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors text-sm"
          >
            {showDetails ? 'Hide' : 'Show'} Details
            <ChevronDown className={cn('h-4 w-4 transition-transform', showDetails && 'rotate-180')} />
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3">
              {/* Specialties */}
              {stallion.specialties.length > 0 && (
                <div>
                  <Label className="mb-1">Specialties</Label>
                  <div className="flex flex-wrap gap-1">
                    {stallion.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded bg-gold/10 text-gold text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics */}
              {stallion.statistics && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded bg-gold/5">
                    <Caption className="text-gold/60">Foals</Caption>
                    <Text className="font-semibold">{stallion.statistics.foalsBorn}</Text>
                  </div>
                  <div className="text-center p-2 rounded bg-gold/5">
                    <Caption className="text-gold/60">Winners</Caption>
                    <Text className="font-semibold">{stallion.statistics.competitionWinners}</Text>
                  </div>
                  <div className="text-center p-2 rounded bg-gold/5">
                    <Caption className="text-gold/60">Champions</Caption>
                    <Text className="font-semibold">{stallion.statistics.championOffspring}</Text>
                  </div>
                </div>
              )}

              {/* Achievements */}
              {stallion.achievements.length > 0 && (
                <div>
                  <Label className="mb-1">Top Achievements</Label>
                  <ul className="space-y-1">
                    {stallion.achievements.slice(0, 3).map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award className="h-3 w-3 text-gold flex-shrink-0 mt-0.5" />
                        <Text size="sm">{achievement}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </GlassCard>
  )
}

/**
 * Process Timeline Component
 */
function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gold/20" />

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative flex gap-6">
            {/* Step number */}
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center z-10">
              <span className="text-xl font-bold text-gold">{index + 1}</span>
            </div>

            {/* Step content */}
            <div className="flex-1 pt-3">
              <div className="flex items-center gap-2 mb-1">
                {step.icon}
                <Heading level={5}>{step.title}</Heading>
              </div>
              <Paragraph size="base" maxWidth="prose">
                {step.description}
              </Paragraph>
              {step.duration && (
                <Caption className="text-gold/60 mt-2">
                  Duration: {step.duration}
                </Caption>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Breeding Program Section
 *
 * Showcase breeding stallions with detailed profiles,
 * program information, and booking functionality.
 *
 * @example
 * ```tsx
 * <BreedingProgram
 *   stallions={stallionsData}
 *   programInfo={breedingProgramData}
 *   variant="showcase"
 *   onInquire={(stallion) => openContactForm(stallion)}
 * />
 * ```
 */
export function BreedingProgram({
  stallions,
  programInfo,
  variant = 'showcase',
  onStallionClick,
  onInquire,
  onBookStud,
  className,
}: BreedingProgramProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'limited'>('all')

  const filteredStallions = stallions.filter((stallion) => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'available') return stallion.bookingStatus === 'available'
    if (filterStatus === 'limited') return stallion.bookingStatus === 'limited'
    return true
  })

  return (
    <section className={`px-6 py-16 bg-midnight ${className || ''}`}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <ViewportAnimator animation="fade-in">
          <div className="text-center mb-12">
            <Display size="2xl" className="mb-4">
              Premier Breeding Program
            </Display>
            <Paragraph size="lg" maxWidth="prose">
              {programInfo.description}
            </Paragraph>
          </div>
        </ViewportAnimator>

        {/* Program Overview */}
        <ScrollReveal delay={100}>
          <GlassPanel variant="elevated" className="p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Statistics */}
              <div>
                <Heading level={4} className="mb-4 text-gold">Program Statistics</Heading>
                <div className="space-y-3">
                  {stallions.reduce((acc, stallion) => ({
                    foals: acc.foals + (stallion.statistics?.foalsBorn || 0),
                    winners: acc.winners + (stallion.statistics?.competitionWinners || 0),
                    champions: acc.champions + (stallion.statistics?.championOffspring || 0),
                  }), { foals: 0, winners: 0, champions: 0 }) && (
                    <>
                      <div className="flex items-center justify-between p-3 rounded bg-gold/5">
                        <Text>Total Foals Born</Text>
                        <Text className="font-semibold text-gold">
                          {stallions.reduce((sum, s) => sum + (s.statistics?.foalsBorn || 0), 0)}
                        </Text>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded bg-gold/5">
                        <Text>Competition Winners</Text>
                        <Text className="font-semibold text-gold">
                          {stallions.reduce((sum, s) => sum + (s.statistics?.competitionWinners || 0), 0)}
                        </Text>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded bg-gold/5">
                        <Text>Champion Offspring</Text>
                        <Text className="font-semibold text-gold">
                          {stallions.reduce((sum, s) => sum + (s.statistics?.championOffspring || 0), 0)}
                        </Text>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Heading level={4} className="mb-4 text-gold">Breeding Requirements</Heading>
                <ul className="space-y-2">
                  {programInfo.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                      <Text>{req}</Text>
                    </li>
                  ))}
                </ul>

                {programInfo.guarantee && (
                  <div className="mt-4 p-3 rounded bg-gold/10 border border-gold/20">
                    <Text size="sm" className="text-gold">
                      <Info className="h-4 w-4 inline mr-1" />
                      {programInfo.guarantee}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </GlassPanel>
        </ScrollReveal>

        {/* Filter Bar */}
        {variant !== 'minimal' && (
          <ScrollReveal delay={200}>
            <div className="flex items-center justify-between mb-8">
              <Heading level={3}>Our Stallions</Heading>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gold" />
                <div className="flex gap-2">
                  <GlassButton
                    variant={filterStatus === 'all' ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </GlassButton>
                  <GlassButton
                    variant={filterStatus === 'available' ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setFilterStatus('available')}
                  >
                    Available
                  </GlassButton>
                  <GlassButton
                    variant={filterStatus === 'limited' ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setFilterStatus('limited')}
                  >
                    Limited
                  </GlassButton>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Stallions Grid */}
        <ScrollReveal delay={300} stagger={100}>
          <GlassCardGrid cols={3} gap="lg">
            {filteredStallions.map((stallion) => (
              <StallionCard
                key={stallion.id}
                stallion={stallion}
                onStallionClick={onStallionClick}
                onInquire={onInquire}
                variant={variant}
              />
            ))}
          </GlassCardGrid>
        </ScrollReveal>

        {/* Breeding Process */}
        {variant === 'detailed' && programInfo.process.length > 0 && (
          <ScrollReveal delay={400}>
            <div className="mt-16">
              <div className="text-center mb-8">
                <Heading level={2} className="mb-4">Breeding Process</Heading>
                <Paragraph maxWidth="prose">
                  Understanding our thorough and professional breeding process
                </Paragraph>
              </div>

              <GlassPanel variant="elevated" className="p-8">
                <ProcessTimeline steps={programInfo.process} />
              </GlassPanel>

              {programInfo.timeline && (
                <div className="mt-6 text-center">
                  <GlassPanel variant="dark" className="inline-block px-6 py-3">
                    <Text className="text-gold">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      {programInfo.timeline}
                    </Text>
                  </GlassPanel>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* CTA Section */}
        <ScrollReveal delay={500}>
          <div className="mt-16 text-center">
            <GlassPanel variant="elevated" className="p-8 max-w-3xl mx-auto">
              <Display size="1xl" className="mb-4">
                Ready to Start Your Breeding Journey?
              </Display>
              <Paragraph size="lg" maxWidth="prose" className="mb-6">
                Contact our breeding specialists to discuss your goals and find the perfect match for your mare.
              </Paragraph>
              <GlassButton
                variant="primary"
                size="large"
                leftIcon={<TrendingUp className="h-4 w-4" />}
              >
                Schedule Consultation
              </GlassButton>
            </GlassPanel>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
