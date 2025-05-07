"use client"

import { useState, useEffect } from "react"
import { Heart, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"

interface PetDetailsProps {
  params: {
    id: string
  }
}

export default function PetDetails({ params }: PetDetailsProps) {
  const petId = Number.parseInt(params.id)
  const [isFavorite, setIsFavorite] = useState(false)

  // Load favorite status from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("petFavorites")
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites)
      setIsFavorite(favorites.includes(petId))
    }
  }, [petId])

  // Toggle favorite status and update localStorage
  const toggleFavorite = () => {
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)

    // Update localStorage
    const storedFavorites = localStorage.getItem("petFavorites")
    let favorites: number[] = storedFavorites ? JSON.parse(storedFavorites) : []

    if (newFavoriteState) {
      if (!favorites.includes(petId)) {
        favorites.push(petId)
      }
    } else {
      favorites = favorites.filter((id) => id !== petId)
    }

    localStorage.setItem("petFavorites", JSON.stringify(favorites))
  }

  // This would normally come from an API or database
  const pet = {
    id: petId,
    name: "Max",
    breed: "Labrador Retriever",
    age: "2 years",
    coatLength: "Short",
    gender: "Male",
    size: "Large",
    goodWithKids: "Yes",
    location: "New York, NY",
    daysOnPlatform: "15 days",
    adoptionType: "Standard Adoption",
    description:
      "Max is a friendly and energetic Labrador Retriever who loves to play fetch and go for long walks. He's well-trained, house-broken, and gets along great with children and other pets. Max was rescued from a shelter and is now looking for his forever home. He's in excellent health, up-to-date on all vaccinations, and has been neutered. Max would thrive in an active household with a yard where he can run and play. He's a loyal companion who will bring joy and love to his new family.",
    imageUrl: "/placeholder.svg?height=400&width=600",
  }

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all pets
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Image and Adoption Inquiry */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img src={pet.imageUrl || "/placeholder.svg"} alt={pet.name} className="w-full h-[400px] object-cover" />
            </div>

            {/* Adoption inquiry section - matching the screenshot */}
            <div className="bg-[#1a2c44] rounded-lg p-6 text-center text-white">
              <h2 className="text-2xl font-medium mb-6">Considering {pet.name} for adoption?</h2>

              <div className="space-y-4">
                <button className="bg-white text-[#1a2c44] font-medium py-3 px-6 rounded-full w-64 hover:bg-gray-100 transition-colors mx-auto">
                  START YOUR INQUIRY
                </button>

                <button className="bg-white text-[#1a2c44] font-medium py-3 px-6 rounded-full w-64 hover:bg-gray-100 transition-colors mx-auto">
                  READ FAQs
                </button>

                <button
                  className="bg-white text-[#1a2c44] font-medium py-3 px-6 rounded-full w-64 hover:bg-gray-100 transition-colors mx-auto"
                  onClick={toggleFavorite}
                >
                  <div className="flex items-center justify-center">
                    <Heart className={`h-5 w-5 mr-2 ${isFavorite ? "fill-[#1a2c44]" : ""}`} />
                    <span>FAVORITE</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right column - Pet details */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                <p className="text-lg text-gray-600">{pet.breed}</p>
                <p className="text-gray-500">{pet.location}</p>
              </div>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => {}} // Share functionality would go here
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-y-3">
                <div className="text-gray-600">Age</div>
                <div>{pet.age}</div>

                <div className="text-gray-600">Gender</div>
                <div>{pet.gender}</div>

                <div className="text-gray-600">Size</div>
                <div>{pet.size}</div>

                <div className="text-gray-600">Coat Length</div>
                <div>{pet.coatLength}</div>

                <div className="text-gray-600">Good with Kids</div>
                <div>{pet.goodWithKids}</div>

                <div className="text-gray-600">Days on Platform</div>
                <div>{pet.daysOnPlatform}</div>

                <div className="text-gray-600">Adoption Type</div>
                <div>{pet.adoptionType}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">About {pet.name}</h2>
              <p className="text-gray-700 leading-relaxed">{pet.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
