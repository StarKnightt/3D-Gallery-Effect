# 3D Gallery Effect

An infinite 3D photo gallery component for React. Images float through depth with cloth physics, GLSL blur, opacity fading, and a flag-waving hover effect. Built for the shadcn/ui ecosystem.

Scroll, use arrow keys, or just watch it auto-play.

## Preview

Run the project locally and visit [http://localhost:3000](http://localhost:3000) to see it in action.

## Tech Stack

- **Three.js** -- 3D rendering via React Three Fiber
- **React 19** -- Client component with hooks
- **Next.js 16** -- App Router
- **Tailwind CSS v4** -- Styling
- **TypeScript** -- Fully typed props
- **shadcn/ui** -- Project structure and conventions

## Installation

### Prerequisites

A React project with the shadcn/ui structure. If you don't have one:

```bash
npx shadcn@latest init
```

### Install dependencies

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

### Copy the component

Copy `3d-gallery-photography.tsx` into your project:

```
src/components/ui/3d-gallery-photography.tsx
```

> **Why `/components/ui`?** This is the shadcn convention. All reusable UI primitives live here so they're co-located, easy to find, and consistent with other shadcn components you may add.

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

## Features

- Infinite Z-axis scroll through a looping image set
- Custom GLSL vertex and fragment shaders for cloth deformation, depth blur, and opacity
- Flag-waving animation on hover via vertex displacement
- Auto-play with progressive speed ramp after 3 seconds idle
- Golden-angle spatial distribution for natural, non-grid placement
- Configurable fade and blur zones via depth-range percentages
- Automatic aspect ratio preservation
- Keyboard navigation (arrow keys) and scroll wheel support
- WebGL fallback to a static CSS grid when GPU is unavailable

## How It Works

### Rendering Pipeline

The component renders `visibleCount` textured planes distributed in 3D space. Each frame:

1. Scroll velocity is applied to all plane Z-positions
2. Planes that exit the depth range wrap around and receive the next image index
3. Per-plane opacity and blur are calculated from normalized depth position
4. Shader uniforms are updated directly (no React re-renders in the animation loop)

### Shader System

Two custom GLSL shaders handle all visual effects:

**Vertex Shader** -- Three layers of displacement:
- Scroll-force-based curvature (quadratic distance from center)
- Cloth ripple effect (sinusoidal waves modulated by scroll intensity)
- Flag-wave animation on hover (phase-shifted sine waves with edge dampening)

**Fragment Shader** -- Per-pixel effects:
- Depth-based Gaussian blur approximation (5x5 kernel, weighted sampling)
- Scroll-force highlight for subtle lighting on curved surfaces
- Alpha blending with the opacity uniform

### Spatial Distribution

Image positions use the golden angle (2.618 radians) for horizontal distribution and an offset golden ratio (1.618) for vertical. This avoids grid patterns and produces a natural, scattered arrangement across the viewport.

## Performance

- **Zero React re-renders during animation.** All per-frame updates write directly to Three.js uniforms and mutable refs. React state is only used for discrete events (hover, scroll start/stop, auto-play toggle).
- **Material pooling.** Shader materials are created once and reused across frames. Textures are loaded once via `useTexture` and assigned by index.
- **Fixed plane count.** The number of rendered meshes is constant regardless of image array length. Images cycle through planes via index wrapping, not DOM creation/destruction.
- **Geometry sharing.** All planes use the same `planeGeometry` instance (1x1, 32x32 subdivisions) scaled per-plane via the mesh scale property.
- **Lightweight shaders.** The blur kernel is a 5x5 weighted sample (25 texture lookups per fragment). Intentionally small to maintain 60fps on integrated GPUs while still producing a visible depth-of-field effect.
- **Single render pass.** All effects (blur, fade, cloth deformation) are computed per-material. No additional render targets or post-processing passes.

## Browser Support

Requires WebGL 1.0. Works in all modern browsers. When WebGL is unavailable, the component renders a static CSS grid fallback.

- Chrome / Edge 80+
- Firefox 80+
- Safari 15+
- Mobile Safari / Chrome on iOS and Android

## License

MIT
