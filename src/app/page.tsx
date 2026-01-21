'use client'

import React, { useState } from 'react'
import { Star, ArrowRight, Sparkles, Users, Trophy } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GlassPanel, GlassPanelSection } from '@/components/ui/GlassPanel'
import { GlassCard, GlassCardGrid } from '@/components/ui/GlassCard'
import { GlassButton, GlassButtonGroup } from '@/components/ui/GlassButton'
import {
  Display,
  Heading,
  Paragraph,
  Text,
  Label,
  Caption,
  Link as TextLink,
  List,
  ListItem,
} from '@/components/ui/Typography'
import { MotionWrapper, StaggerContainer, ViewportAnimator } from '@/components/motion/MotionWrapper'
import { useMotion } from '@/components/providers/MotionProvider'

export default function HomePage() {
  const { shouldReduceMotion, toggleMotion } = useMotion()
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadingClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-hunter to-midnight opacity-50" />
        <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-gold/3 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <StaggerContainer animation="fade-in" staggerDelay={150}>
            <MotionWrapper animation="slide-down">
              <p className="text-gold font-medium tracking-wide uppercase text-sm mb-4">
                Welcome to MAM Center
              </p>
            </MotionWrapper>

            <MotionWrapper animation="slide-up" delay={100}>
              <Display size="3xl" gradient="gold" className="mb-6">
                Luxury Equestrian Excellence
              </Display>
            </MotionWrapper>

            <MotionWrapper animation="fade-in" delay={200}>
              <Paragraph size="lg" maxWidth="prose" className="mb-8">
                Experience the pinnacle of equestrian luxury with our world-class
                facilities, premium services, and exclusive experiences.
              </Paragraph>
            </MotionWrapper>

            <MotionWrapper animation="slide-up" delay={300}>
              <GlassButtonGroup>
                <GlassButton variant="primary" size="large" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore Our Services
                </GlassButton>
                <GlassButton variant="secondary" size="large">
                  Learn More
                </GlassButton>
              </GlassButtonGroup>
            </MotionWrapper>
          </StaggerContainer>
        </div>
      </section>

      {/* Glass Components Demo */}
      <section className="relative px-6 py-24 md:px-12 lg:px-24 bg-midnight">
        <div className="mx-auto max-w-7xl">
          <ViewportAnimator animation="slide-up">
            <div className="text-center mb-16">
              <Heading level={2} className="mb-4">Glassmorphism Design System</Heading>
              <Paragraph maxWidth="prose">
                Our premium glass components with adaptive blur, noise textures,
                and motion-reduced variants.
              </Paragraph>
            </div>
          </ViewportAnimator>

          {/* Glass Panels */}
          <ViewportAnimator animation="fade-in" delay={100}>
            <Heading level={3} className="mb-6">Glass Panel Variants</Heading>
          </ViewportAnimator>

          <GlassCardGrid cols={3} gap="md">
            <MotionWrapper animation="slide-up" delay={200}>
              <GlassPanelSection>
                <Heading level={4} className="mb-3">Default Panel</Heading>
                <Paragraph size="sm">
                  Subtle glass with minimal opacity.
                </Paragraph>
              </GlassPanelSection>
            </MotionWrapper>

            <MotionWrapper animation="slide-up" delay={300}>
              <GlassPanelSection variant="elevated">
                <Heading level={4} className="mb-3">Elevated Panel</Heading>
                <Paragraph size="sm">
                  Enhanced shadow and glow effects.
                </Paragraph>
              </GlassPanelSection>
            </MotionWrapper>

            <MotionWrapper animation="slide-up" delay={400}>
              <GlassPanelSection variant="dark">
                <Heading level={4} className="mb-3">Dark Panel</Heading>
                <Paragraph size="sm">
                  Deeper opacity for contrast.
                </Paragraph>
              </GlassPanelSection>
            </MotionWrapper>
          </GlassCardGrid>

          {/* Glass Cards */}
          <ViewportAnimator animation="slide-up" delay={500}>
            <Heading level={3} className="mt-16 mb-6">Glass Cards</Heading>
          </ViewportAnimator>

          <GlassCardGrid cols={3} gap="lg">
            <GlassCard
              icon={<Star className="h-6 w-6" />}
              title="Premium Quality"
              description="World-class facilities and services"
              noise
              action={<GlassButton variant="ghost" size="small">Learn More</GlassButton>}
            />

            <GlassCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Luxury Experience"
              description="Exclusive amenities for clients"
              variant="elevated"
              noise
              action={<GlassButton variant="ghost" size="small">Learn More</GlassButton>}
            />

            <GlassCard
              icon={<Trophy className="h-6 w-6" />}
              title="Award Winning"
              description="Excellence in equestrian care"
              variant="bordered"
              noise
              action={<GlassButton variant="ghost" size="small">Learn More</GlassButton>}
            />
          </GlassCardGrid>

          {/* Buttons */}
          <ViewportAnimator animation="fade-in" delay={600}>
            <Heading level={3} className="mt-16 mb-6">Button Components</Heading>
          </ViewportAnimator>

          <GlassPanel variant="default" className="p-8">
            <div className="space-y-6">
              <div>
                <Label className="mb-4">Variants</Label>
                <div className="flex flex-wrap gap-4">
                  <GlassButton variant="primary">Primary</GlassButton>
                  <GlassButton variant="secondary">Secondary</GlassButton>
                  <GlassButton variant="ghost">Ghost</GlassButton>
                  <GlassButton variant="outline">Outline</GlassButton>
                </div>
              </div>

              <div>
                <Label className="mb-4">Sizes</Label>
                <div className="flex flex-wrap items-center gap-4">
                  <GlassButton variant="primary" size="small">Small</GlassButton>
                  <GlassButton variant="primary" size="medium">Medium</GlassButton>
                  <GlassButton variant="primary" size="large">Large</GlassButton>
                </div>
              </div>

              <div>
                <Label className="mb-4">With Icons</Label>
                <div className="flex flex-wrap gap-4">
                  <GlassButton leftIcon={<Star className="h-4 w-4" />}>Left Icon</GlassButton>
                  <GlassButton rightIcon={<ArrowRight className="h-4 w-4" />}>Right Icon</GlassButton>
                  <GlassButton
                    leftIcon={<Users className="h-4 w-4" />}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Both Icons
                  </GlassButton>
                </div>
              </div>

              <div>
                <Label className="mb-4">States</Label>
                <div className="flex flex-wrap gap-4">
                  <GlassButton
                    variant="primary"
                    isLoading={isLoading}
                    onClick={handleLoadingClick}
                  >
                    {isLoading ? 'Processing...' : 'Click to Load'}
                  </GlassButton>
                  <GlassButton variant="secondary" disabled>Disabled</GlassButton>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Typography */}
          <ViewportAnimator animation="fade-in" delay={700}>
            <Heading level={3} className="mt-16 mb-6">Typography System</Heading>
          </ViewportAnimator>

          <GlassPanel variant="default" className="p-8">
            <div className="space-y-6">
              <div>
                <Label className="mb-4">Display Headings</Label>
                <Display size="1xl" className="mb-2">Display 1XL</Display>
                <Display size="2xl" gradient="gold" className="mb-2">Display 2XL Gradient</Display>
              </div>

              <div>
                <Label className="mb-4">Heading Levels</Label>
                <Heading level={1} className="mb-2">Heading 1</Heading>
                <Heading level={2} className="mb-2">Heading 2</Heading>
                <Heading level={3} className="mb-2">Heading 3</Heading>
              </div>

              <div>
                <Label className="mb-4">Text Variants</Label>
                <Text variant="default">Default</Text>
                <Text variant="muted" className="ml-4">Muted</Text>
                <Text variant="gold" className="ml-4">Gold</Text>
              </div>

              <div>
                <Label className="mb-4">Links</Label>
                <TextLink href="#" variant="default">Default</TextLink>
                <TextLink href="#" variant="gold" className="ml-4">Gold</TextLink>
              </div>
            </div>
          </GlassPanel>

          {/* Motion Control */}
          <ViewportAnimator animation="fade-in" delay={800}>
            <GlassPanel variant="dark" className="p-6 mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <Paragraph className="mb-1">
                    Current: <Text variant={shouldReduceMotion ? "muted" : "gold"}>
                      {shouldReduceMotion ? 'Reduced Motion' : 'Full Motion'}
                    </Text>
                  </Paragraph>
                  <Caption>Toggle to switch animations</Caption>
                </div>
                <GlassButton
                  variant={shouldReduceMotion ? 'outline' : 'primary'}
                  onClick={toggleMotion}
                >
                  {shouldReduceMotion ? 'Enable' : 'Reduce'} Motion
                </GlassButton>
              </div>
            </GlassPanel>
          </ViewportAnimator>
        </div>
      </section>

      <Footer showNewsletter showMotionToggle />
    </>
  )
}
