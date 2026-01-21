'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { useCursorPosition } from '@/hooks/use-cursor-position'
import { cn } from '@/lib/utils'

/**
 * Props for TextureRenderer component
 */
export interface TextureRendererProps {
  /** Type of texture to render */
  type: 'leather' | 'metal' | 'fabric' | 'wood'
  /** Base color of the material */
  baseColor?: string
  /** Texture intensity (0-1) */
  textureIntensity?: number
  /** Roughness for metal (0-1) */
  roughness?: number
  /** Metalness for metal (0-1) */
  metalness?: number
  /** Whether cursor affects lighting */
  cursorLighting?: boolean
  /** Canvas width */
  width?: number
  /** Canvas height */
  height?: number
  /** Additional class names */
  className?: string
}

/**
 * WebGL Texture Renderer Component
 *
 * Renders realistic material textures using custom WebGL shaders.
 * Supports leather with grain, metal with reflections, and cursor-reactive lighting.
 *
 * @example
 * ```tsx
 * <TextureRenderer
 *   type="leather"
 *   baseColor="#3d2314"
 *   cursorLighting
 *   width={400}
 *   height={300}
 * />
 * ```
 */
export function TextureRenderer({
  type,
  baseColor = '#3d2314',
  textureIntensity = 0.5,
  roughness = 0.6,
  metalness = 0.3,
  cursorLighting = true,
  width = 400,
  height = 300,
  className,
}: TextureRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const { shouldReduceMotion } = useMotion()
  const { x: cursorX, y: cursorY, isTouch } = useCursorPosition()

  // Calculate normalized cursor position for shader
  const cursorPositionRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    if (!canvasRef.current) return
    if (shouldReduceMotion) return

    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (!gl) {
      console.warn('WebGL not supported')
      return
    }

    glRef.current = gl

    // Vertex shader - simple pass-through
    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      varying vec2 v_position;

      void main() {
        v_texCoord = a_texCoord;
        v_position = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    // Fragment shader with texture effects
    const fsSource = `
      precision mediump float;

      varying vec2 v_texCoord;
      varying vec2 v_position;

      uniform vec2 u_cursor;
      uniform float u_time;
      uniform vec3 u_baseColor;
      uniform float u_textureIntensity;
      uniform float u_roughness;
      uniform float u_metalness;
      uniform int u_type;

      // Simple noise function
      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      // Leather grain effect
      vec3 leather(vec2 uv, vec3 color) {
        float grain = noise(uv * 50.0) * 0.15;
        grain += noise(uv * 100.0) * 0.05;

        // Add slight depression effect on cursor hover
        float dist = distance(uv, u_cursor);
        float depress = smoothstep(0.3, 0.0, dist) * 0.02;

        return color * (1.0 - grain * u_textureIntensity) + vec3(depress);
      }

      // Metal with specular highlights
      vec3 metal(vec2 uv, vec3 color, vec2 cursor) {
        // Normal map simulation
        vec2 normal = normalize(vec2(
          noise(uv * 30.0) - 0.5,
          noise(uv * 30.0 + 10.0) - 0.5
        ))

        // Specular highlight from cursor
        vec2 lightDir = normalize(cursor - uv);
        float specular = pow(max(dot(normal, lightDir), 0.0), 32.0 * u_roughness);

        // Reflection simulation
        float fresnel = pow(1.0 - max(normal.y, 0.0), 3.0 * u_metalness);

        return color * (1.0 - fresnel * 0.5) + vec3(specular * u_metalness);
      }

      void main() {
        vec3 color = u_baseColor / 255.0;

        if (u_type == 0) {
          // Leather
          color = leather(v_texCoord, color);
        } else if (u_type == 1) {
          // Metal
          color = metal(v_texCoord, color, u_cursor);
        } else if (u_type == 2) {
          // Fabric
          float weave = noise(v_texCoord * 20.0) * u_textureIntensity;
          color = color * (1.0 + weave * 0.1);
        } else {
          // Wood
          float grain = noise(v_texCoord * 80.0) * u_textureIntensity;
          color = color * (0.9 + grain * 0.2);
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Create shader program
    const vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, vsSource)
    gl.compileShader(vs)
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vs))
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, fsSource)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fs))
    }

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
    }

    gl.useProgram(program)
    programRef.current = program

    // Set up geometry (full quad)
    const positions = new Float32Array([
      -1, -1,  1, -1, 1, 1, -1, 1, 1, -1, 1, 1,
    ])
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const texCoords = new Float32Array([
      0, 0, 1, 0, 0, 1, 1, 1,
    ])
    const texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW)

    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
    gl.enableVertexAttribArray(texCoordLocation)
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

    // Set uniforms
    const typeValue = type === 'leather' ? 0 : type === 'metal' ? 1 : type === 'fabric' ? 2 : 3

    // Parse base color
    const colorMatch = baseColor.match(/^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)
    const colorValue = colorMatch
      ? [
          parseInt(colorMatch[1], 16) / 255,
          parseInt(colorMatch[2], 16) / 255,
          parseInt(colorMatch[3], 16) / 255,
        ]
      : [0.24, 0.14, 0.08]

    const baseColorLocation = gl.getUniformLocation(program, 'u_baseColor')
    gl.uniform3fv(baseColorLocation, colorValue)

    const textureIntensityLocation = gl.getUniformLocation(program, 'u_textureIntensity')
    gl.uniform1f(textureIntensityLocation, textureIntensity)

    const roughnessLocation = gl.getUniformLocation(program, 'u_roughness')
    gl.uniform1f(roughnessLocation, roughness)

    const metalnessLocation = gl.getUniformLocation(program, 'u_metalness')
    gl.uniform1f(metalnessLocation, metalness)

    const typeLocation = gl.getUniformLocation(program, 'u_type')
    gl.uniform1i(typeLocation, typeValue)

    const cursorLocation = gl.getUniformLocation(program, 'u_cursor')
    gl.uniform2f(cursorLocation, 0.5, 0.5)

    // Viewport
    gl.viewport(0, 0, width, height)

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    // Cleanup
    return () => {
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(texCoordBuffer)
    }
  }, [type, baseColor, textureIntensity, roughness, metalness, width, height, shouldReduceMotion])

  // Update cursor position in shader
  useEffect(() => {
    if (!glRef.current || !programRef.current || !cursorLighting || shouldReduceMotion) return
    if (cursorX === null || cursorY === null || isTouch) return

    const gl = glRef.current
    const program = programRef.current

    // Normalize cursor position to texture coordinates
    const normX = cursorX / width
    const normY = 1 - (cursorY / height) // Flip Y for WebGL

    const cursorLocation = gl.getUniformLocation(program, 'u_cursor')
    gl.uniform2f(cursorLocation, normX, normY)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }, [cursorX, cursorY, width, height, cursorLighting, shouldReduceMotion, isTouch])

  // Fallback for reduced motion or no WebGL
  if (shouldReduceMotion || !glRef.current) {
    const style: React.CSSProperties = {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: baseColor,
      borderRadius: '8px',
    }

    return <div ref={canvasRef} style={style} className={className} />
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ borderRadius: '8px' }}
    />
  )
}

/**
 * Decorative texture panel component
 *
 * Combines texture rendering with glass panel for navigation items that depress
 * and catch light differently on hover.
 *
 * @example
 * ```tsx
 * <TexturePanel
 *   type="leather"
 *   baseColor="#3d2314"
 *   label="Navigation"
 * >
 *   {children}
 * </TexturePanel>
 * ```
 */
export function TexturePanel({
  type = 'leather',
  baseColor,
  label,
  children,
  className,
}: {
  type?: 'leather' | 'metal' | 'fabric' | 'wood'
  baseColor?: string
  label?: string
  children?: React.ReactNode
  className?: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden transition-all duration-300',
        'hover:shadow-[0_8px_32px_rgba(212,175,55,0.15)]',
        isHovered && 'scale-[0.99]', // Slight depress on hover
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Texture layer */}
      <div className="absolute inset-0 opacity-40">
        <TextureRenderer
          type={type}
          baseColor={baseColor}
          textureIntensity={0.6}
          width={400}
          height={300}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 p-4">
        {children}
      </div>

      {/* Label */}
      {label && (
        <div className="absolute bottom-2 left-4 text-xs text-gold/60 uppercase tracking-wider">
          {label}
        </div>
      )}
    </div>
  )
}
