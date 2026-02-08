import { motion } from "framer-motion"
import { CircularCarouselGallery } from "./circular-carousel-gallery"
import { Camera, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryImage {
  title: string
  url: string
}

interface AboutGallerySectionProps {
  gallery?: string[]
  title?: string
  subtitle?: string
  description?: string
}

// Convert string URLs to GalleryImage format with default titles
const formatGalleryImages = (gallery: string[]): GalleryImage[] => {
  return gallery.map((url, index) => ({
    title: getImageTitle(index),
    url,
  }))
}

const getImageTitle = (index: number): string => {
  const titles = [
    "Research Lab",
    "Innovation Space",
    "Team Collaboration",
    "Advanced Equipment",
    "Design Studio",
    "Testing Facility",
    "Workshop Area",
    "Presentation Room",
  ]
  return titles[index % titles.length] || `Gallery Image ${index + 1}`
}

export function AboutGallerySection({
  gallery = [],
  title = "Our Space",
  subtitle = "Where Innovation Happens",
  description = "Take a glimpse into our state-of-the-art facilities where ideas transform into breakthrough technologies.",
}: AboutGallerySectionProps) {
  const galleryImages = formatGalleryImages(gallery)

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(120,119,198,0.4) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(138,180,248,0.4) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Camera className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-sm font-medium">Lab Gallery</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-xl sm:text-2xl text-white/50 font-light mb-4">
            {subtitle}
          </p>
          <p className="text-white/40 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Carousel Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <CircularCarouselGallery 
            images={galleryImages}
            autoPlay={true}
            autoPlayInterval={5000}
            className="w-full"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 sm:mt-20"
        >
          <Button
            variant="outline"
            className="gap-2 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 px-6"
          >
            Schedule a Visit
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
