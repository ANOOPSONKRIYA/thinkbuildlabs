"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface GalleryImage {
  title: string
  url: string
}

interface CircularCarouselGalleryProps {
  images: GalleryImage[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

// Default tech/lab themed images if none provided
const DEFAULT_IMAGES: GalleryImage[] = [
  {
    title: "Research Lab",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Circuit Design",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Innovation Hub",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Team Collaboration",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Robotics Lab",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Data Center",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
  },
]

export function CircularCarouselGallery({
  images,
  autoPlay = true,
  autoPlayInterval = 4500,
  className,
}: CircularCarouselGalleryProps) {
  const [opened, setOpened] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Use provided images or fallbacks
  const galleryImages = images.length > 0 ? images : DEFAULT_IMAGES

  const next = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setOpened((current) => {
      const nextIndex = (current + 1) % galleryImages.length
      return nextIndex
    })
    setTimeout(() => setIsAnimating(false), 600)
  }, [galleryImages.length, isAnimating])

  const prev = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setOpened((current) => {
      const prevIndex = current === 0 ? galleryImages.length - 1 : current - 1
      return prevIndex
    })
    setTimeout(() => setIsAnimating(false), 600)
  }, [galleryImages.length, isAnimating])

  const goTo = useCallback((index: number) => {
    if (isAnimating || index === opened) return
    setIsAnimating(true)
    setOpened(index)
    setTimeout(() => setIsAnimating(false), 600)
  }, [isAnimating, opened])

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return
    
    autoplayTimer.current = setInterval(next, autoPlayInterval)
    
    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current)
      }
    }
  }, [autoPlay, autoPlayInterval, next])

  // Reset autoplay on manual interaction
  const handleManualInteraction = useCallback((action: () => void) => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current)
    }
    action()
    if (autoPlay) {
      autoplayTimer.current = setInterval(next, autoPlayInterval)
    }
  }, [autoPlay, autoPlayInterval, next])

  if (galleryImages.length === 0) {
    return null
  }

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      {/* Main Gallery Container */}
      <div className="relative w-[85vmin] h-[85vmin] max-w-[550px] max-h-[550px] sm:w-[70vmin] sm:h-[70vmin] sm:max-w-[500px] sm:max-h-[500px]">
        {/* Images Stack */}
        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-surface border border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            {galleryImages.map((image, index) => {
              const isActive = index === opened
              const isPrev = index === (opened === 0 ? galleryImages.length - 1 : opened - 1)
              const isNext = index === (opened === galleryImages.length - 1 ? 0 : opened + 1)
              
              if (!isActive && !isPrev && !isNext) return null

              return (
                <motion.div
                  key={image.url}
                  className="absolute inset-0"
                  initial={{ 
                    scale: 0.8, 
                    opacity: 0,
                    clipPath: "circle(0% at 50% 50%)"
                  }}
                  animate={{ 
                    scale: isActive ? 1 : 0.85, 
                    opacity: isActive ? 1 : 0,
                    zIndex: isActive ? 10 : 0,
                    clipPath: isActive ? "circle(100% at 50% 50%)" : "circle(0% at 50% 50%)"
                  }}
                  exit={{ 
                    scale: 0.8, 
                    opacity: 0,
                    clipPath: "circle(0% at 50% 50%)"
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />
                  
                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
                  >
                    <h3 className="text-white text-lg sm:text-xl font-semibold tracking-tight">
                      {image.title}
                    </h3>
                    <p className="text-white/50 text-sm mt-1">
                      {index + 1} / {galleryImages.length}
                    </p>
                  </motion.div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Navigation Arrows - Inside Container */}
          <button
            onClick={() => handleManualInteraction(prev)}
            disabled={isAnimating}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:bg-white/20 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => handleManualInteraction(next)}
            disabled={isAnimating}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:bg-white/20 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Next Image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Circular Thumbnails */}
        <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 sm:gap-3">
            {galleryImages.map((image, index) => (
              <button
                key={image.url}
                onClick={() => handleManualInteraction(() => goTo(index))}
                disabled={isAnimating}
                className={cn(
                  "relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden transition-all duration-300",
                  opened === index 
                    ? "ring-2 ring-white ring-offset-2 ring-offset-void scale-110" 
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                )}
                aria-label={`Go to ${image.title}`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                {opened === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 border-2 border-white rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 mt-20 sm:mt-24">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleManualInteraction(() => goTo(index))}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              opened === index 
                ? "w-6 bg-white" 
                : "w-1.5 bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
