# 3D Gallery Effect

A WebGL-powered infinite 3D photo gallery built with React Three Fiber. Images float through 3D space with depth-based blur, opacity fading, cloth physics on scroll, and a flag-waving hover effect.

Live interaction via mouse wheel, arrow keys, or touch. Auto-play kicks in after 3 seconds of inactivity and progressively accelerates.

## Features

- Infinite scroll through a looping set of images along the Z-axis
- Custom GLSL shaders for real-time cloth deformation, depth blur, and opacity fade
- Flag-waving animation on hover using vertex displacement
- Auto-play with progressive speed ramp after idle timeout
- Golden-angle spatial distribution for natural, non-grid image placement
- Configurable fade and blur zones via depth-range percentages
- Automatic aspect ratio preservation for all images
- WebGL fallback to a static grid when GPU is unavailable
- Fully typed with TypeScript
- Keyboard navigation (arrow keys) and scroll wheel support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **3D Engine**: React Three Fiber + Three.js
- **Utilities**: @react-three/drei (texture loading)
- **Styling**: Tailwind CSS v4
- **UI System**: shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/StarKnightt/3D-Gallery-Effect.git
cd 3D-Gallery-Effect
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Usage

```tsx
import InfiniteGallery from "@/components/ui/3d-gallery-photography"

const images = [
  { src: "/images/photo-1.jpg", alt: "Description" },
  { src: "/images/photo-2.jpg", alt: "Description" },
]

export default function Page() {
  return (
    <InfiniteGallery
      images={images}
      speed={1.2}
      visibleCount={12}
      className="h-screen w-full"
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `(string \| { src: string; alt?: string })[]` | required | Array of image URLs or objects with src and alt |
| `speed` | `number` | `1` | Scroll speed multiplier |
| `zSpacing` | `number` | `2.5` | Spacing between images along the Z-axis |
| `visibleCount` | `number` | `8` | Number of image planes rendered simultaneously |
| `falloff` | `{ near: number; far: number }` | `{ near: 0.5, far: 12 }` | Near/far distances for opacity and blur easing |
| `fadeSettings` | `FadeSettings` | See below | Controls fade-in and fade-out depth zones |
| `blurSettings` | `BlurSettings` | See below | Controls blur-in and blur-out depth zones |
| `className` | `string` | `"h-96 w-full"` | CSS class for the container |
| `style` | `React.CSSProperties` | `undefined` | Inline styles for the container |

### FadeSettings

```ts
{
  fadeIn:  { start: 0.05, end: 0.25 },
  fadeOut: { start: 0.4,  end: 0.43 }
}
```

Values are percentages (0-1) of the total depth range. Images fade from transparent to opaque within the fadeIn zone, and from opaque to transparent within the fadeOut zone.

### BlurSettings

```ts
{
  blurIn:  { start: 0.0, end: 0.1 },
  blurOut: { start: 0.4, end: 0.43 },
  maxBlur: 8.0
}
```

Depth blur is applied via a fragment shader approximation. `maxBlur` controls the peak blur intensity (0-10 range).

## Architecture

### Rendering Pipeline

The component renders `visibleCount` textured planes distributed in 3D space. Each frame:

1. Scroll velocity is applied to all plane Z-positions
2. Planes that exit the depth range wrap around and receive the next image index
3. Per-plane opacity and blur are calculated from normalized depth position
4. Shader uniforms are updated directly (no React re-renders in the animation loop)

### Shader System

Two custom GLSL shaders handle all visual effects:

**Vertex Shader** -- Applies three layers of displacement:
- Scroll-force-based curvature (quadratic distance from center)
- Cloth ripple effect (sinusoidal waves modulated by scroll intensity)
- Flag-wave animation on hover (phase-shifted sine waves with edge dampening)

**Fragment Shader** -- Handles per-pixel effects:
- Depth-based Gaussian blur approximation (5x5 kernel, weighted sampling)
- Scroll-force highlight for subtle lighting on curved surfaces
- Alpha blending with the opacity uniform

### Spatial Distribution

Image positions use the golden angle (2.618 radians) for horizontal distribution and an offset golden ratio (1.618) for vertical distribution. This avoids grid patterns and produces a natural, scattered arrangement across the viewport.

## Performance

- **Zero React re-renders during animation**: All per-frame updates write directly to Three.js uniforms and mutable refs. React state is only used for discrete events (hover, scroll start/stop, auto-play toggle).
- **Material pooling**: Shader materials are created once and reused across frames. Textures are loaded once via `useTexture` and assigned by index.
- **Fixed plane count**: The number of rendered meshes is constant regardless of image array length. Images cycle through planes via index wrapping, not DOM creation/destruction.
- **Geometry sharing**: All planes use the same `planeGeometry` instance (1x1, 32x32 subdivisions) scaled per-plane via the mesh scale property.
- **Lightweight shaders**: The blur kernel is a 5x5 weighted sample (25 texture lookups per fragment). This is intentionally small to maintain 60fps on integrated GPUs while still producing a visible depth-of-field effect.
- **No post-processing**: All effects (blur, fade, cloth deformation) are computed per-material in a single render pass. There are no additional render targets or post-processing passes.

## Browser Support

Requires WebGL 1.0. Works in all modern browsers. When WebGL is unavailable, the component renders a static CSS grid fallback.

## License

MIT
