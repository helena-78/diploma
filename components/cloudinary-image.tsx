"use client"

import Image from "next/image"
import { useState } from "react"

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
}

export default function CloudinaryImage({ src, alt, width, height, fill = false, className }: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Handle image load error by falling back to placeholder
  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  // Use placeholder if there's an error or if src is empty
  const imageSrc = hasError || !src ? "/placeholder.svg?height=400&width=600&query=cute pet" : src

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""} ${isLoading ? "bg-gray-200 animate-pulse" : ""}`}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
        // Add priority for above-the-fold images
        priority={false}
      />
    </div>
  )
}
