"use client"

import type React from "react"

import { Heart } from "lucide-react"
import { useState, useEffect } from "react"

interface PetCardProps {
  name: string
  breed: string
  age: string
  gender: string
  location: string
  imageUrl?: string
  isFavorite?: boolean
}

export default function PetCard({
  name,
  breed,
  age,
  gender,
  location,
  imageUrl,
  isFavorite: propIsFavorite,
}: PetCardProps) {
  const [isFavorite, setIsFavorite] = useState(propIsFavorite || false)

  // Update state if prop changes
  useEffect(() => {
    if (propIsFavorite !== undefined) {
      setIsFavorite(propIsFavorite)
    }
  }, [propIsFavorite])

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Toggle favorite state
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)

    // Get current favorites from localStorage
    const storedFavorites = localStorage.getItem("petFavorites")
    let favorites: number[] = storedFavorites ? JSON.parse(storedFavorites) : []

    // Extract pet ID from imageUrl (in a real app, you'd have the actual ID)
    const petIdMatch = imageUrl?.match(/\/placeholder\.svg\?height=\d+&width=\d+$/)
    const petId = petIdMatch ? Number.parseInt(name.replace(/\D/g, "")) || 1 : 1

    // Update favorites in localStorage
    if (newFavoriteState) {
      if (!favorites.includes(petId)) {
        favorites.push(petId)
      }
    } else {
      favorites = favorites.filter((id) => id !== petId)
    }

    localStorage.setItem("petFavorites", JSON.stringify(favorites))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="h-48 bg-gray-100">
          {imageUrl && <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />}
        </div>
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-black text-black" : "text-black"}`} />
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-900">{name}</h2>
        <p className="text-gray-600 text-sm">
          {breed} • {age} • {gender}
        </p>
        <p className="text-gray-500 text-sm mt-1">{location}</p>
      </div>
    </div>
  )
}
