'use client'

import React, { useState } from 'react'
import { Star, ArrowRight, Hamburger, Sparkles, Users, Trophy } from 'lucide-react'
import { Header, HeroHeader } from '@/components/layout/Header'
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
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-hunter to-midnight opacity-50" />

        {/* Decorative elements */}
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
                facilities, premium services, and exclusive experiences for
                discerning riders and equine enthusiasts.
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

      {/* Glass Components Demo Section */}
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

          {/* Glass Panel Variants */}
          <ViewportAnimator animation="fade-in" delay={100}>
            <Heading level={3} className="mb-6">Glass Panel Variants</Heading>
          </ViewportAnimator>

          <GlassCardGrid cols={3} gap="md">
            <MotionWrapper animation="slide-up" delay={200}>
              <GlassPanelSection>
                <Heading level={4} className="mb-3">Default Panel</Heading>
                <Paragraph size="sm" variant="muted">
                  Subtle glass with minimal opacity and standard blur effect.
                </Paragraph>
              </GlassPanelSection>
            </MotionWrapper>

            <MotionWrapper animation="slide-up" delay={300}>
              <GlassPanelSection variant="elevated">
                <Heading level={4} className="mb-3">Elevated Panel</Heading>
                <Paragraph size="sm" variant="muted">
                  More prominent with enhanced shadow and glow effects.
                </Paragraph>
              </GlassPanelSection>
            </MotionWrapper>

            <MotionWrapper animation="slide-up" delay={400}>
              <GlassPanelSection variant="dark">
                <Heading level={4} className="mb-3">Dark Panel</Heading>
                <Paragraph size="sm" variant="muted">
                  Deeper opacity for better contrast over light backgrounds.
                </Paragraph>
              </GlassPanelSection>
            </MotionWrapper>
          </GlassCardGrid>

          {/* Glass Cards with Features */}
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
              description="Exclusive amenities for discerning clients"
              variant="elevated"
              noise
              action={<GlassButton variant="ghost" size="small">Learn More</GlassButton>}
            />

            <GlassCard
              icon={<Trophy className="h-6 w-6" />}
              title="Award Winning"
              description="Recognized excellence in equestrian care"
              variant="bordered"
              noise
              action={<GlassButton variant="ghost" size="small">Learn More</GlassButton>}
            />
          </GlassCardGrid>

          {/* Button Showcase */}
          <ViewportAnimator animation="fade-in" delay={600}>
            <div className="mt-16">
              <Heading level={3} className="mb-6">Button Components</Heading>

              <GlassPanel variant="default" className="p-8">
                <div className="space-y-8">
                  {/* Button Variants */}
                  <div>
                    <Label className="mb-4">Variants</Label>
                    <div className="flex flex-wrap gap-4">
                      <GlassButton variant="primary">Primary</GlassButton>
                      <GlassButton variant="secondary">Secondary</GlassButton>
                      <GlassButton variant="ghost">Ghost</GlassButton>
                      <GlassButton variant="outline">Outline</GlassButton>
                    </div>
                  </div>

                  {/* Button Sizes */}
                  <div>
                    <Label className="mb-4">Sizes</Label>
                    <div className="flex flex-wrap items-center gap-4">
                      <GlassButton variant="primary" size="small">Small</GlassButton>
                      <GlassButton variant="primary" size="medium">Medium</GlassButton>
                      <GlassButton variant="primary" size="large">Large</GlassButton>
                    </div>
                  </div>

                  {/* Button with Icons */}
                  <div>
                    <Label className="mb-4">With Icons</Label>
                    <div className="flex flex-wrap gap-4">
                      <GlassButton leftIcon={<Star className="h-4 w-4" />}>
                        With Left Icon
                      </GlassButton>
                      <GlassButton rightIcon={<ArrowRight className="h-4 w-4" />}>
                        With Right Icon
                      </GlassButton>
                      <GlassButton
                        leftIcon={<Users className="h-4 w-4" />}
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                      >
                        Both Icons
                      </GlassButton>
                    </div>
                  </div>

                  {/* Magnetic Effect */}
                  <div>
                    <Label className="mb-4">
                      Magnetic Effect (Hover on non-touch devices)
                    </Label>
                    <div className="flex flex-wrap gap-4">
                      <GlassButton variant="secondary" magnetic>
                        Magnetic Button
                      </GlassButton>
                      <GlassButton variant="outline" magnetic>
                        Magnetic Outline
                      </GlassButton>
                    </div>
                  </div>

                  {/* Loading State */}
                  <div>
                    <Label className="mb-4">Loading State</Label>
                    <div className="flex flex-wrap gap-4">
                      <GlassButton
                        variant="primary"
                        isLoading={isLoading}
                        onClick={handleLoadingClick}
                      >
                        {isLoading ? 'Processing...' : 'Click to Load'}
                      </GlassButton>
                    </div>
                  </div>

                {/* Disabled State */}
                <div>
                  <Label className="mb-4">Disabled State</Label>
                  <div className="flex flex-wrap gap-4">
                    <GlassButton variant="primary" disabled>
                      Primary Disabled
                    </GlassButton>
                    <GlassButton variant="secondary" disabled>
                      Secondary Disabled
                    </GlassButton>
                    <GlassButton variant="ghost" disabled>
                      Ghost Disabled
                    </GlassButton>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </ViewportAnimator>

          {/* Typography Showcase */}
          <ViewportAnimator animation="fade-in" delay={700}>
            <div className="mt-16">
              <Heading level={3} className="mb-6">Typography System</Heading>

              <GlassPanel variant="default" className="p-8">
                {/* Display Headings */}
                <div className="mb-8">
                  <Label className="mb-4">Display Headings</Label>
                  <Display size="1xl" className="mb-2">Display 1XL</Display>
                  <Display size="2xl" gradient="gold" className="mb-2">Display 2XL Gradient</Display>
                  <Display size="3xl" className="mb-2">Display 3XL</Display>
                </div>

                {/* Headings */}
                <div className="mb-8">
                  <Label className="mb-4">Heading Levels</Label>
                  <Heading level={1} className="mb-2">Heading 1</Heading>
                  <Heading level={2} className="mb-2">Heading 2</Heading>
                  <Heading level={3} className="mb-2">Heading 3</Heading>
                  <Heading level={4} className="mb-2">Heading 4</Heading>
                  <Heading level={5} className="mb-2">Heading 5</Heading>
                  <Heading level={6}>Heading 6</Heading>
                </div>

                {/* Text Variants */}
                <div className="mb-8">
                  <Label className="mb-4">Text Variants</Label>
                  <Text variant="default">Default text</Text>
                  <Text variant="muted">Muted text</Text>
                  <Text variant="gold">Gold text</Text>
                  <Text variant="danger">Danger text</Text>
                  <Text variant="success">Success text</Text>
                </div>

                {/* Labels and Captions */}
                <div className="mb-8">
                  <Label className="mb-4">Labels and Captions</Label>
                  <Label>Form Label</Label>
                  <Label required>Required Field Label</Label>
                  <Caption align="left">Left aligned caption</Caption>
                  <Caption align="center">Center aligned caption</Caption>
                </div>

                {/* Links */}
                <div className="mb-8">
                  <Label className="mb-4">Links</Label>
                  <TextLink href="#" variant="default">Default Link</TextLink>
                  <TextLink href="#" variant="gold" className="ml-4">Gold Link</TextLink>
                  <TextLink href="#" variant="muted" className="ml-4">Muted Link</TextLink>
                  <TextLink href="#" variant="underline" className="ml-4">Underline Link</TextLink>
                </div>

                {/* Lists */}
                <div>
                  <Label className="mb-4">Lists</Label>
                  <List variant="unordered">
                    <ListItem>Unordered list item 1</ListItem>
                    <ListItem>Unordered list item 2</ListItem>
                    <ListItem>Unordered list item 3</ListItem>
                  </List>
                  <List variant="ordered" className="mt-4">
                    <ListItem>Ordered list item 1</ListItem>
                    <ListItem>Ordered list item 2</ListItem>
                    <ListItem>Ordered list item 3</ListItem>
                  </List>
                </div>
              </GlassPanel>
            </div>
          </ViewportAnimator>

          {/* Motion Control */}
          <ViewportAnimator animation="fade-in" delay={800}>
            <div className="mt-16">
              <Heading level={3} className="mb-6">Motion Control</Heading>

              <GlassPanel variant="dark" className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <Paragraph size="lg" className="mb-2">
                      Current State: <Text variant={shouldReduceMotion ? "muted" : "gold"}>
                        {shouldReduceMotion ? 'Reduced Motion' : 'Full Motion'}
                      </Text>
                    </Paragraph>
                    <Caption>
                      Toggle to switch between reduced and full motion animations
                    </Caption>
                  </div>
                  <GlassButton
                    variant={shouldReduceMotion ? 'outline' : 'primary'}
                    onClick={toggleMotion}
                  >
                    {shouldReduceMotion ? 'Enable Motion' : 'Reduce Motion'}
                  </GlassButton>
                </div>
              </GlassPanel>
            </div>
          </ViewportAnimator>
        </div>
      </section>

      <Footer showNewsletter showMotionToggle />
    </>
  )
}
