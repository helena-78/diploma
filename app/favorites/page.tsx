"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import PetCard from "@/components/pet-card"

// Sample pet data - in a real app, this would come from an API
const allPets = [
  {
    id: 1,
    name: "Max",
    breed: "Labrador",
    age: "2 years",
    gender: "Male",
    location: "New York, NY",
    imageUrl: "/placeholder.svg?height=192&width=384",
  },
  {
    id: 2,
    name: "Bella",
    breed: "German Shepherd",
    age: "1 year",
    gender: "Female",
    location: "Los Angeles, CA",
    imageUrl: "/placeholder.svg?height=192&width=384",
  },
  {
    id: 3,
    name: "Charlie",
    breed: "Golden Retriever",
    age: "3 years",
    gender: "Male",
    location: "Chicago, IL",
    imageUrl: "/placeholder.svg?height=192&width=384",
  },
  {
    id: 4,
    name: "Luna",
    breed: "Beagle",
    age: "2 years",
    gender: "Female",
    location: "Houston, TX",
    imageUrl: "/placeholder.svg?height=192&width=384",
  },
  {
    id: 5,
    name: "Cooper",
    breed: "Bulldog",
    age: "4 years",
    gender: "Male",
    location: "Phoenix, AZ",
    imageUrl: "/placeholder.svg?height=192&width=384",
  },
  {
    id: 6,
    name: "Lucy",
    breed: "Poodle",
    age: "1 year",
    gender: "Female",
    location: "Philadelphia, PA",
    imageUrl: "/placeholder.svg?height=192&width=384",
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("petFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
    setIsLoading(false)
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("petFavorites", JSON.stringify(favorites))
    }
  }, [favorites, isLoading])

  // Remove a pet from favorites
  const removeFavorite = (petId: number) => {
    setFavorites(favorites.filter((id) => id !== petId))
  }

  // Filter pets to only show favorites
  const favoritePets = allPets.filter((pet) => favorites.includes(pet.id))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all pets
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Favorite Pets</h1>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {favoritePets.length} {favoritePets.length === 1 ? "pet" : "pets"}
          </span>
        </div>

        {favoritePets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">You haven't added any pets to your favorites list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePets.map((pet) => (
              <div key={pet.id} className="relative group">
                <Link href={`/pets/${pet.id}`}>
                  <PetCard
                    name={pet.name}
                    breed={pet.breed}
                    age={pet.age}
                    gender={pet.gender}
                    location={pet.location}
                    imageUrl={pet.imageUrl}
                    isFavorite={true}
                  />
                </Link>
                <button
                  onClick={() => removeFavorite(pet.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove from favorites"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
