# 3D Models Directory

This directory contains 3D models for the MAM Center website.

## Directory Structure

### /horses
Horse models in various poses.
- `arabian-standing.glb` - Arabian horse in standing pose
- `arabian-galloping.glb` - Arabian horse in galloping pose
- `thoroughbred-jumping.glb` - Thoroughbred horse jumping
- `pony-trotting.glb` - Pony in trotting pose

### /equipment
Equestrian equipment models.
- `saddle.glb` - English dressage saddle
- `bridle.glb` - English bridle
- `helmet.glb` - Riding helmet
- `boots.glb` - Riding boots

### /environments
Environment textures and HDRIs.
- `env_512.hdr` - Low resolution environment map (512px)
- `env_1024.hdr` - Medium resolution environment map (1024px)
- `env_2048.hdr` - High resolution environment map (2048px)

## Model Guidelines

### File Format
- Use `.glb` format for compressed models
- Include Draco compression for large models
- Maximum file size: 10MB per model

### Optimization
- Use LOD (Level of Detail) for complex models
- Optimize textures using basis universal format
- Keep polygon count under 100k for main models

### Material Setup
- Use PBR (Physically Based Rendering) materials
- Include roughness and metalness maps
- Separate materials for coat, mane, tail, hooves

### Naming Convention
`{breed}-{pose}.glb` for horses
`{item-type}-{variant}.glb` for equipment

## Loading Models

Use the helper function from `@/lib/three-helpers`:

```typescript
import { getModelPath } from '@/lib/three-helpers'

const horsePath = getModelPath('horses', 'arabian-standing', true)
```

## Placeholder Models

Currently, placeholder models should be used. Replace with actual 3D assets when available.

## Tools for Model Preparation

- **Blender** - For modeling and animation
- **glTF-Transform** - For compression and optimization
- **Basis Universal** - For texture compression
- **Draco** - For geometry compression
