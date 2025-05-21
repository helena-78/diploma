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

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""} ${isLoading ? "bg-gray-200 animate-pulse" : ""}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  )
}
