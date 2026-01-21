/**
 * Mock Data for MAM Center
 *
 * Comprehensive mock data for development and testing.
 * Replace with real API data in production.
 */

import type { Horse } from '@/components/sections/horse-portfolio'
import type { HorseDetail, PedigreeNode } from '@/components/sections/horse-detail'
import type { Product } from '@/components/sections/product-showcase'
import type { Stallion, BreedingInfo } from '@/components/sections/breeding-program'
import type { Article } from '@/components/sections/editorial-layouts'

/**
 * Mock Horses Data
 */
export const mockHorses: Horse[] = [
  {
    id: 'horse-001',
    name: 'Golden Sunrise',
    breed: 'Arabian',
    age: 8,
    gender: 'Male',
    color: 'Bay',
    height: '15.2 hh',
    discipline: ['Dressage', 'Endurance'],
    price: 125000,
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800',
    description: 'A magnificent Arabian stallion with exceptional pedigree and championship potential.',
    competitionRecord: ['2023 Regional Dressage Champion', '2022 Endurance Top 10 Finisher'],
  },
  {
    id: 'horse-002',
    name: 'Midnight Star',
    breed: 'Friesian',
    age: 6,
    gender: 'Female',
    color: 'Black',
    height: '16.1 hh',
    discipline: ['Dressage', 'Show Jumping'],
    price: 95000,
    image: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800',
    description: 'Elegant Friesian mare with incredible movement and gentle temperament.',
    competitionRecord: ['2023 Dressage Reserve Champion'],
  },
  {
    id: 'horse-003',
    name: 'Desert Storm',
    breed: 'Arabian',
    age: 10,
    gender: 'Male',
    color: 'Grey',
    height: '15.0 hh',
    discipline: ['Endurance', 'Trail'],
    price: 85000,
    image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800',
    description: 'Proven endurance champion with incredible stamina.',
    competitionRecord: ['2022 120km Endurance Winner', '2023 100km Endurance 2nd Place'],
  },
  {
    id: 'horse-004',
    name: 'Royal Legacy',
    breed: 'Andalusian',
    age: 7,
    gender: 'Male',
    color: 'Grey',
    height: '16.0 hh',
    discipline: ['Dressage'],
    price: 150000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    description: 'Premium Andalusian with classical training and exceptional presence.',
    competitionRecord: ['2023 Grand Prix Special 3rd Place'],
  },
  {
    id: 'horse-005',
    name: 'Thunder Bolt',
    breed: 'Thoroughbred',
    age: 5,
    gender: 'Male',
    color: 'Chestnut',
    height: '16.3 hh',
    discipline: ['Show Jumping', 'Eventing'],
    price: 75000,
    image: 'https://images.unsplash.com/photo-1534773728080-33d4c646609e?w=800',
    description: 'Athletic Thoroughbred with jumping talent and speed.',
    competitionRecord: ['2023 Young Jumper Championship Finalist'],
  },
  {
    id: 'horse-006',
    name: 'Silver Moon',
    breed: 'Lusitano',
    age: 9,
    gender: 'Female',
    color: 'Grey',
    height: '15.3 hh',
    discipline: ['Dressage'],
    price: 110000,
    image: 'https://images.unsplash.com/photo-1508761963684-c7bc64e8a6a2?w=800',
    description: 'Beautiful Lusitano mare with collected gaits and excellent temperament.',
    competitionRecord: ['2022 Intermediare Champion'],
  },
]

/**
 * Mock Horse Detail Data
 */
export const mockHorseDetails: Record<string, HorseDetail> = {
  'horse-001': {
    id: 'horse-001',
    name: 'Golden Sunrise',
    breed: 'Arabian',
    age: 8,
    gender: 'Male',
    color: 'Bay',
    height: '15.2 hh',
    discipline: ['Dressage', 'Endurance'],
    price: 125000,
    images: [
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1200',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400',
    description: 'Golden Sunrise represents the pinnacle of Arabian breeding. With his exceptional conformation, natural carriage, and willing temperament, he embodies everything desired in a premier Arabian stallion. His training includes advanced dressage movements and he has proven his capabilities in both the dressage arena and endurance competitions.',
    competitionRecord: [
      '2023 Regional Dressage Champion - Prix St. Georges',
      '2022 National Endurance - Top 10 Finish (120km)',
      '2021 Arabian Sport Horse Nationals - Reserve Champion',
    ],
    pedigree: {
      id: 'pedigree-001',
      name: 'Golden Sunrise',
      breed: 'Arabian',
      gender: 'stallion',
      sire: {
        id: 'sire-001',
        name: 'Desert Fire',
        breed: 'Arabian',
        gender: 'stallion',
        achievements: ['Multiple Champion in Endurance'],
        sire: {
          id: 'gsire-001',
          name: 'Famous Arabian',
          breed: 'Arabian',
        },
        dam: {
          id: 'gdam-001',
          name: 'Desert Rose',
          breed: 'Arabian',
        },
      },
      dam: {
        id: 'dam-001',
        name: 'Starlight Dawn',
        breed: 'Arabian',
        gender: 'mare',
        achievements: ['Champion Producer'],
        sire: {
          id: 'gsire-002',
          name: 'Midnight Sun',
          breed: 'Arabian',
        },
        dam: {
          id: 'gdam-002',
          name: 'Evening Star',
          breed: 'Arabian',
        },
      },
    },
    training: [
      'Grand Prix dressage movements',
      'Lateral work and collection',
      'Endurance conditioning up to 160km',
      'Trail and cross-country experience',
      'Liberty and trick training',
    ],
    temperament: 'Intelligent, willing, and eager to please. Forms strong bonds with handlers. Excellent work ethic.',
    healthStatus: 'Excellent health, up to date on all vaccinations, regular dental care, clean X-rays on file.',
    location: 'Main Facility - Stall 12',
    availability: 'available',
    modelPath: '/models/horses/golden-sunrise.glb',
  },
}

/**
 * Mock Products Data
 */
export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Premium English Saddle',
    category: 'equipment',
    price: 2850,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=400',
    description: 'Handcrafted English dressage saddle with premium leather and ergonomic design.',
    features: [
      'Premium European leather',
      'Custom tree fitting available',
      'Wool-flocked panels',
      'Long billet straps',
    ],
    specifications: {
      'Seat Size': '17" or 18"',
      'Tree': 'Medium or Wide',
      'Color': 'Black or Brown',
      'Leather': 'European Cowhide',
    },
    inStock: true,
    featured: true,
    colors: ['#000000', '#3d2314'],
    sizes: ['17"', '17.5"', '18"'],
    rating: 4.8,
    reviewCount: 124,
    environmentPreset: 'studio',
  },
  {
    id: 'prod-002',
    name: 'Competition Show Jacket',
    category: 'apparel',
    price: 450,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    description: 'Technical fabric show jacket with moisture-wicking and four-way stretch.',
    features: [
      'Breathable technical fabric',
      'UV protection',
      'Custom embroidery available',
      'Machine washable',
    ],
    inStock: true,
    featured: false,
    colors: ['#000000', '#1a1a2e', '#f5f5dc'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: 'prod-003',
    name: 'Diamond Encrusted Browband',
    category: 'accessories',
    price: 890,
    images: ['https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800'],
    description: 'Luxury browband featuring genuine Swarovski crystals.',
    features: [
      'Genuine Swarovski crystals',
      'Premium leather backing',
      'Available in multiple colors',
      'Hand-set crystals',
    ],
    inStock: true,
    featured: true,
    colors: ['#000000', '#3d2314', '#1a1a2e'],
    rating: 4.9,
    reviewCount: 56,
  },
  {
    id: 'prod-004',
    name: 'Premium Horse Feed',
    category: 'nutrition',
    price: 85,
    images: ['https://images.unsplash.com/photo-1508761963684-c7bc64e8a6a2?w=800'],
    description: 'Scientifically formulated complete feed for performance horses.',
    features: [
      'High-quality protein sources',
      'Added vitamins and minerals',
      'Probiotics for digestive health',
      'No artificial preservatives',
    ],
    inStock: true,
    featured: false,
    sizes: ['20kg', '40kg'],
    rating: 4.7,
    reviewCount: 234,
  },
  {
    id: 'prod-005',
    name: 'Therapeutic Blanket',
    category: 'care',
    price: 320,
    images: ['https://images.unsplash.com/photo-1534773728080-33d4c646609e?w=800'],
    description: 'Magnetic therapy blanket for muscle recovery and relaxation.',
    features: [
      'Powerful magnets strategically placed',
      'Breathable fabric',
      'Adjustable fit',
      'Machine washable',
    ],
    inStock: true,
    featured: false,
    sizes: ['Pony', 'Cob', 'Full', 'X-Full'],
    rating: 4.5,
    reviewCount: 78,
  },
  {
    id: 'prod-006',
    name: 'Custom Jumping Boots Set',
    category: 'equipment',
    price: 275,
    images: ['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800'],
    description: 'Professional grade jumping boots with superior protection.',
    features: [
      'Impact-absorbing material',
      'Breathable design',
      'Easy closure system',
      'Machine washable',
    ],
    inStock: true,
    featured: false,
    colors: ['#000000', '#3d2314', '#ffffff', '#1a1a2e'],
    sizes: ['Pony', 'Cob', 'Full'],
    rating: 4.6,
    reviewCount: 145,
  },
]

/**
 * Mock Stallions Data
 */
export const mockStallions: Stallion[] = [
  {
    id: 'stallion-001',
    name: 'Golden Sunrise',
    breed: 'Arabian',
    age: 8,
    height: '15.2 hh',
    color: 'Bay',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800',
    studFee: 3500,
    specialties: ['Dressage', 'Endurance', 'Conformation', 'Temperament'],
    achievements: [
      '2023 Regional Dressage Champion',
      'Multiple Regional Endurance Wins',
      'Elite Arabian Classification',
    ],
    offspring: ['foal-001', 'foal-002', 'foal-003', 'foal-004'],
    temperament: 'Gentle, intelligent, passes on excellent work ethic',
    healthStatus: 'Excellent, all health clearances on file',
    location: 'Main Facility - Stallion Barn A',
    bookingStatus: 'available',
    pedigree: {
      sire: 'Desert Fire',
      dam: 'Starlight Dawn',
      grandsire: 'Famous Arabian',
    },
    statistics: {
      foalsBorn: 47,
      competitionWinners: 23,
      championOffspring: 12,
    },
  },
  {
    id: 'stallion-002',
    name: 'Royal Legacy',
    breed: 'Andalusian',
    age: 7,
    height: '16.0 hh',
    color: 'Grey',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    studFee: 5000,
    specialties: ['Classical Dressage', 'Collection', 'Piaffe/Passage'],
    achievements: [
      '2023 Grand Prix Special 3rd Place',
      'PRE Approved Breeding Stallion',
      'Multiple Gold Medal Producer',
    ],
    offspring: ['foal-005', 'foal-006', 'foal-007'],
    temperament: 'Noble, willing, excellent with mares',
    healthStatus: 'Excellent, PRE registry approved',
    location: 'Main Facility - Stallion Barn B',
    bookingStatus: 'limited',
    pedigree: {
      sire: 'Legendario X',
      dam: 'Danza Real',
      grandsire: 'Olympico',
    },
    statistics: {
      foalsBorn: 28,
      competitionWinners: 18,
      championOffspring: 9,
    },
  },
  {
    id: 'stallion-003',
    name: 'Desert Storm',
    breed: 'Arabian',
    age: 10,
    height: '15.0 hh',
    color: 'Grey',
    image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800',
    studFee: 2500,
    specialties: ['Endurance', 'Stamina', 'Conformation'],
    achievements: [
      '2022 120km Endurance Winner',
      'Multiple Top 10 Finishes',
      'Proven Sire of Endurance Champions',
    ],
    offspring: ['foal-008', 'foal-009', 'foal-010', 'foal-011', 'foal-012'],
    temperament: 'Athletic, competitive, excellent producer',
    healthStatus: 'Excellent, metabolic testing complete',
    location: 'Main Facility - Stallion Barn A',
    bookingStatus: 'available',
    pedigree: {
      sire: 'Endurance Elite',
      dam: 'Desert Rose II',
    },
    statistics: {
      foalsBorn: 62,
      competitionWinners: 35,
      championOffspring: 15,
    },
  },
]

/**
 * Mock Breeding Info
 */
export const mockBreedingInfo: BreedingInfo = {
  title: 'Premier Breeding Program',
  description: 'Our world-class breeding program combines exceptional bloodlines with modern reproductive technologies to produce the next generation of champions.',
  process: [
    {
      title: 'Initial Consultation',
      description: 'Meet with our breeding specialists to discuss your goals, mare\'s history, and optimal stallion selection. We review conformation, temperament, and performance records.',
      duration: '1-2 hours',
      icon: null,
    },
    {
      title: 'Mare Evaluation',
      description: 'Comprehensive veterinary assessment including reproductive ultrasound, blood work, and overall health evaluation to ensure optimal breeding conditions.',
      duration: '1 day',
      icon: null,
    },
    {
      title: 'Breeding',
      description: 'Depending on the method chosen (natural cover or artificial insemination), our experienced team ensures the breeding is performed at the optimal time for conception.',
      duration: '1-3 days',
      icon: null,
    },
    {
      title: 'Pregnancy Confirmation',
      description: 'Ultrasound confirmation at 14-16 days post-breeding, with follow-up checks to monitor pregnancy progression.',
      duration: 'Multiple visits',
      icon: null,
    },
    {
      title: 'Prenatal Care',
      description: 'Ongoing monitoring and care throughout the 11-month gestation period, including nutrition planning and health management.',
      duration: '11 months',
      icon: null,
    },
    {
      title: 'Foaling & Beyond',
      description: '24/7 monitoring as due date approaches, expert foaling assistance, and post-natal care for both mare and foal.',
      duration: 'Continuous',
      icon: null,
    },
  ],
  requirements: [
    'Mare must be in good health with current vaccinations',
    'Negative Coggins test within 12 months',
    'Breeding soundness evaluation required',
    'Stud fee due in advance',
    'Live foal guarantee available',
    'Boarding options available for mares',
  ],
  timeline: 'Average breeding cycle: 14-16 days from start to pregnancy confirmation',
  guarantee: 'Live foal guarantee: If your mare does not produce a live foal, you receive one free breeding the following season.',
}

/**
 * Mock Articles Data
 */
export const mockArticles: Article[] = [
  {
    id: 'article-001',
    title: 'The Art of Classical Dressage: A Journey Through Time',
    excerpt: 'Explore the rich history and evolution of classical dressage, from its military origins to modern Olympic sport.',
    content: '<p>Dressage has evolved over centuries...</p>',
    author: {
      name: 'Dr. Sarah Mitchell',
      title: 'Equestrian Historian',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    publishDate: '2024-01-15',
    readTime: '8 min read',
    category: 'Training',
    tags: ['dressage', 'history', 'classical'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    featured: true,
    layout: 'full-width',
  },
  {
    id: 'article-002',
    title: 'Nutrition Essentials for Performance Horses',
    excerpt: 'Understanding the nutritional requirements of competing horses to optimize performance and recovery.',
    content: '<p>Proper nutrition is the foundation...</p>',
    author: {
      name: 'Dr. James Chen',
      title: 'Equine Nutritionist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    publishDate: '2024-01-12',
    readTime: '6 min read',
    category: 'Health',
    tags: ['nutrition', 'health', 'performance'],
    image: 'https://images.unsplash.com/photo-1508761963684-c7bc64e8a6a2?w=800',
    featured: false,
  },
  {
    id: 'article-003',
    title: 'Selecting Your First Dressage Horse',
    excerpt: 'A comprehensive guide to finding the perfect equine partner for your dressage journey.',
    content: '<p>Finding the right horse is crucial...</p>',
    author: {
      name: 'Emma Rodriguez',
      title: 'Dressage Trainer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
    publishDate: '2024-01-10',
    readTime: '10 min read',
    category: 'Buying Guide',
    tags: ['buying', 'dressage', 'beginner'],
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800',
    featured: true,
  },
  {
    id: 'article-004',
    title: 'Endurance Racing: Building a Champion',
    excerpt: 'Training strategies and conditioning programs for developing competitive endurance horses.',
    content: '<p>Endurance racing demands...</p>',
    author: {
      name: 'Michael Thompson',
      title: 'Endurance Champion',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    },
    publishDate: '2024-01-08',
    readTime: '7 min read',
    category: 'Training',
    tags: ['endurance', 'training', 'conditioning'],
    image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800',
    featured: false,
  },
  {
    id: 'article-005',
    title: 'Understanding Horse Pedigrees',
    excerpt: 'Learn how to read and interpret pedigree charts to make informed breeding decisions.',
    content: '<p>A pedigree is more than names...</p>',
    author: {
      name: 'Dr. Sarah Mitchell',
      title: 'Equestrian Historian',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    publishDate: '2024-01-05',
    readTime: '5 min read',
    category: 'Breeding',
    tags: ['pedigree', 'breeding', 'genetics'],
    image: 'https://images.unsplash.com/photo-1534773728080-33d4c646609e?w=800',
    featured: false,
  },
  {
    id: 'article-006',
    title: 'Spring Health Check: Preparing Your Horse for Competition Season',
    excerpt: 'Essential health checks and preparations to ensure your horse is ready for the upcoming competition season.',
    content: '<p>Spring is the perfect time...</p>',
    author: {
      name: 'Dr. Emily Watson',
      title: 'Equine Veterinarian',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    },
    publishDate: '2024-01-03',
    readTime: '4 min read',
    category: 'Health',
    tags: ['health', 'veterinary', 'competition'],
    image: 'https://images.unsplash.com/photo-1508761963684-c7bc64e8a6a2?w=800',
    featured: false,
  },
]

/**
 * Helper functions to get mock data
 */
export function getMockHorses(): Horse[] {
  return mockHorses
}

export function getMockHorseDetail(id: string): HorseDetail | undefined {
  // Check if we have detailed data
  if (mockHorseDetails[id]) {
    return mockHorseDetails[id]
  }

  // Otherwise, convert basic horse data to detail format
  const horse = mockHorses.find(h => h.id === id)
  if (!horse) return undefined

  return {
    ...horse,
    images: [horse.image],
    training: [],
    healthStatus: 'Available upon request',
  }
}

export function getMockProducts(): Product[] {
  return mockProducts
}

export function getMockStallions(): Stallion[] {
  return mockStallions
}

export function getMockBreedingInfo(): BreedingInfo {
  return mockBreedingInfo
}

export function getMockArticles(): Article[] {
  return mockArticles
}

/**
 * Re-export types from components/sections for convenience
 */
export type { Horse } from '@/components/sections/horse-portfolio'
export type { HorseDetail, PedigreeNode } from '@/components/sections/horse-detail'
export type { Product } from '@/components/sections/product-showcase'
export type { Stallion, BreedingInfo } from '@/components/sections/breeding-program'
export type { Article } from '@/components/sections/editorial-layouts'
