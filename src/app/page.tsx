import InfiniteGallery from "@/components/ui/3d-gallery-photography"

export default function Home() {
  const sampleImages = [
    { src: "/images/mountain.jpg", alt: "Mountain landscape" },
    { src: "/images/ocean.jpg", alt: "Ocean waves" },
    { src: "/images/forest.jpg", alt: "Forest path" },
    { src: "/images/desert.jpg", alt: "Desert dunes" },
    { src: "/images/city.jpg", alt: "City skyline" },
    { src: "/images/aurora.jpg", alt: "Northern lights" },
    { src: "/images/waterfall.jpg", alt: "Waterfall" },
    { src: "/images/sunset.jpg", alt: "Sunset beach" },
  ]

  return (
    <main className="min-h-screen w-full">
      <InfiniteGallery
        images={sampleImages}
        speed={1.2}
        zSpacing={3}
        visibleCount={12}
        falloff={{ near: 0.8, far: 14 }}
        className="h-screen w-full rounded-lg overflow-hidden"
      />

      <div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
        <h1 className="font-serif italic text-5xl md:text-8xl tracking-tight">
          Create
        </h1>
      </div>
      <div className="text-center fixed bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold">
        <p>Use mouse wheel, arrow keys, or touch to navigate</p>
        <p className="opacity-60">Auto-play resumes after 3 seconds of inactivity</p>
      </div>
    </main>
  )
}
