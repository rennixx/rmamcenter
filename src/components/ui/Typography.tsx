'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ============================================================================
// DISPLAY HEADING
// ============================================================================

const displayVariants = cva(
  ['font-serif font-bold tracking-tight text-white'],
  {
    variants: {
      size: {
        '1xl': 'text-5xl md:text-6xl lg:text-7xl',
        '2xl': 'text-6xl md:text-7xl lg:text-8xl',
        '3xl': 'text-7xl md:text-8xl lg:text-9xl',
      },
      gradient: {
        none: '',
        gold: 'text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold/90 to-gold',
      },
    },
    defaultVariants: {
      size: '2xl',
      gradient: 'none',
    },
  }
)

export interface DisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof displayVariants> {
  /** Display level (determines h1-h6 tag) */
  level?: 1 | 2 | 3
}

export function Display({
  level = 1,
  size,
  gradient,
  className,
  children,
  ...props
}: DisplayProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3'

  return (
    <Tag className={cn(displayVariants({ size, gradient }), className)} {...props}>
      {children}
    </Tag>
  )
}

// ============================================================================
// HEADING
// ============================================================================

const headingVariants = cva(
  ['font-serif font-semibold tracking-tight text-white'],
  {
    variants: {
      level: {
        1: 'text-3xl md:text-4xl lg:text-5xl',
        2: 'text-2xl md:text-3xl lg:text-4xl',
        3: 'text-xl md:text-2xl lg:text-3xl',
        4: 'text-lg md:text-xl lg:text-2xl',
        5: 'text-base md:text-lg lg:text-xl',
        6: 'text-sm md:text-base lg:text-lg',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    defaultVariants: {
      level: 2,
      weight: 'semibold',
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

export function Heading({
  level = 2,
  weight,
  className,
  children,
  ...props
}: HeadingProps) {
  // Use a type assertion that works with both React 18 and 19
  const tagMap = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  } as const
  const Tag = tagMap[level] as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return (
    <Tag className={cn(headingVariants({ level, weight }), className)} {...props}>
      {children}
    </Tag>
  )
}

// ============================================================================
// PARAGRAPH
// ============================================================================

const paragraphVariants = cva(
  ['text-gray-300 leading-relaxed'],
  {
    variants: {
      size: {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
      },
      maxWidth: {
        none: '',
        prose: 'max-w-prose',
        narrow: 'max-w-md',
        wide: 'max-w-3xl',
      },
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      maxWidth: 'none',
    },
  }
)

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

export function Paragraph({
  size,
  weight,
  maxWidth,
  className,
  children,
  ...props
}: ParagraphProps) {
  return (
    <p className={cn(paragraphVariants({ size, weight, maxWidth }), className)} {...props}>
      {children}
    </p>
  )
}

// ============================================================================
// TEXT COMPONENTS
// ============================================================================

const textVariants = cva([], {
  variants: {
    variant: {
      default: 'text-white',
      muted: 'text-gray-400',
      gold: 'text-gold',
      danger: 'text-red-400',
      success: 'text-green-400',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
    weight: 'normal',
  },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {}

export function Text({
  variant,
  size,
  weight,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <span className={cn(textVariants({ variant, size, weight }), className)} {...props}>
      {children}
    </span>
  )
}

// ============================================================================
// LABEL & CAPTION
// ============================================================================

export interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  /** For association with form element */
  htmlFor?: string
  /** Whether this is a required field */
  required?: boolean
}

export function Label({
  htmlFor,
  required = false,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium text-white/90',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-gold ml-1">*</span>}
    </label>
  )
}

export interface CaptionProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic tag to use */
  as?: 'span' | 'figcaption' | 'caption'
}

const captionVariants = cva(['text-xs text-gray-500'], {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
})

export function Caption({
  as = 'span',
  align,
  className,
  children,
  ...props
}: CaptionProps) {
  const Tag = as

  return (
    // @ts-expect-error - Tag is dynamically assigned
    <Tag className={cn(captionVariants({ align }), className)} {...props}>
      {children}
    </Tag>
  )
}

// ============================================================================
// LEADING (Drop Cap)
// ============================================================================

export interface LeadingProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Character(s) to display as drop cap */
  children: string
}

export function Leading({ className, children, ...props }: LeadingProps) {
  const char = children.charAt(0)
  const rest = children.slice(1)

  return (
    <span className={cn('inline-block', className)} {...props}>
      <span className="float-left font-serif text-5xl font-bold text-gold leading-none mr-2 mt-1">
        {char}
      </span>
      {rest}
    </span>
  )
}

// ============================================================================
// LINK
// ============================================================================

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Link style variant */
  variant?: 'default' | 'gold' | 'muted' | 'underline'
}

const linkVariants = cva(['transition-colors duration-200'], {
  variants: {
    variant: {
      default: 'text-white hover:text-gold',
      gold: 'text-gold hover:text-gold/80',
      muted: 'text-gray-400 hover:text-white',
      underline: 'text-white underline underline-offset-4 hover:text-gold hover:underline',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function Link({
  variant = 'default',
  className,
  children,
  ...props
}: LinkProps) {
  return (
    <a className={cn(linkVariants({ variant }), className)} {...props}>
      {children}
    </a>
  )
}

// ============================================================================
// BLOCKQUOTE
// ============================================================================

export interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  /** Citation source */
  cite?: string
  /** Author attribution */
  author?: string
}

export function Blockquote({
  cite,
  author,
  className,
  children,
  ...props
}: BlockquoteProps) {
  return (
    <blockquote
      className={cn(
        'border-l-4 border-gold/50 pl-4 py-2 my-4',
        'font-serif text-lg text-gray-200 italic',
        className
      )}
      cite={cite}
      {...props}
    >
      {children}
      {author && (
        <footer className="mt-2 text-sm text-gray-400 not-italic">
          — <cite>{author}</cite>
        </footer>
      )}
    </blockquote>
  )
}

// ============================================================================
// CODE
// ============================================================================

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  /** Inline or block code */
  variant?: 'inline' | 'block'
}

const codeVariants = cva(
  [
    'font-mono rounded',
    'bg-white/5 border border-white/10',
  ],
  {
    variants: {
      variant: {
        inline: 'px-1.5 py-0.5 text-sm text-gold/90',
        block: 'block px-4 py-3 text-sm text-gray-300 overflow-x-auto',
      },
    },
    defaultVariants: {
      variant: 'inline',
    },
  }
)

export function Code({
  variant = 'inline',
  className,
  children,
  ...props
}: CodeProps) {
  const Tag = variant === 'block' ? 'pre' : 'code'

  return (
    // @ts-expect-error - Tag is dynamically assigned
    <Tag className={cn(codeVariants({ variant }), className)} {...props}>
      {children}
    </Tag>
  )
}

// ============================================================================
// LIST COMPONENTS
// ============================================================================

const listVariants = cva([], {
  variants: {
    variant: {
      unordered: 'list-disc list-inside space-y-1',
      ordered: 'list-decimal list-inside space-y-1',
      unstyled: 'list-none space-y-1',
    },
    size: {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'unordered',
    size: 'base',
  },
})

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
    VariantProps<typeof listVariants> {}

export function List({
  variant = 'unordered',
  size,
  className,
  children,
  ...props
}: ListProps) {
  const Tag = variant === 'ordered' ? 'ol' : 'ul'

  return (
    // @ts-expect-error - Tag is dynamically assigned
    <Tag className={cn(listVariants({ variant, size }), className)} {...props}>
      {children}
    </Tag>
  )
}

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function ListItem({ className, children, ...props }: ListItemProps) {
  return (
    <li className={cn('text-gray-300', className)} {...props}>
      {children}
    </li>
  )
}
