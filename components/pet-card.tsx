"use client"

import type React from "react"
import { Heart, MapPin } from "lucide-react"
import CloudinaryImage from "./cloudinary-image"

interface PetCardProps {
  name: string
  breed: string
  age: string
  gender: string
  location: string
  imageUrl: string
  isFavorite: boolean
  onFavoriteToggle?: () => void
  petId?: string // Add petId prop
}

export default function PetCard({
  name,
  breed,
  age,
  gender,
  location,
  imageUrl,
  isFavorite,
  onFavoriteToggle,
  petId,
}: PetCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onFavoriteToggle) {
      onFavoriteToggle()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform hover:scale-[1.02] cursor-pointer">
      <div className="relative">
        <div className="aspect-[4/3] relative">
          <CloudinaryImage
            src={imageUrl || "/placeholder.svg?height=400&width=600&query=cute pet"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          data-pet-id={petId} // Add data attribute for pet ID
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-gray-600 text-sm">{breed}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">{gender}</div>
        </div>
        <div className="mt-2 text-gray-500 text-sm">{age}</div>
        <div className="mt-3 flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </div>
      </div>
    </div>
  )
}
