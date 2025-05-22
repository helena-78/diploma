"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Youtube, Trash2, Search } from "lucide-react"
import { UserAccountNav } from "@/components/auth/user-account-nav"
import { Button } from "@/components/ui/button"
import CloudinaryImage from "@/components/cloudinary-image"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "@/lib/date-utils"

interface Pet {
  id: string
  name: string
  breed: string
  species: string
  age: string
  age_category: string
  gender: string
  size: string
  coat_length: string
  good_with_kids: string
  location: string
  city: string
  days_on_platform: string
  adoption_type: string
  image_url: string
  saved_at: string
}

interface FavoritesClientProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  savedPets: Pet[]
}

export default function FavoritesClient({ user, savedPets: initialSavedPets }: FavoritesClientProps) {
  const [savedPets, setSavedPets] = useState<Pet[]>(initialSavedPets)
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredPets = savedPets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRemovePet = async (petId: string) => {
    try {
      setIsRemoving((prev) => ({ ...prev, [petId]: true }))

      // Send request to remove pet from favorites
      const response = await fetch(`/api/favorites/${petId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove pet from favorites")
      }

      // Update local state
      setSavedPets((prev) => prev.filter((pet) => pet.id !== petId))

      // Update localStorage for immediate UI consistency
      const storedFavorites = localStorage.getItem("petFavorites")
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites)
        const updatedFavorites = favorites.filter((id: string) => id !== petId)
        localStorage.setItem("petFavorites", JSON.stringify(updatedFavorites))
      }

      // Show success toast
      const removedPet = savedPets.find((pet) => pet.id === petId)
      toast({
        title: "Removed from favorites",
        description: removedPet
          ? `${removedPet.name} has been removed from your favorites`
          : "Pet removed from favorites",
      })
    } catch (error) {
      console.error("Error removing pet from favorites:", error)
      toast({
        title: "Error",
        description: "Failed to remove pet from favorites",
        variant: "destructive",
      })
    } finally {
      setIsRemoving((prev) => ({ ...prev, [petId]: false }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-serif">
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} className="w-8 h-8" />
          <span className="font-semibold text-lg">Pet Adoption Network</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/search" className="text-sm font-medium">
            FIND A PET
          </Link>
          <Link href="/about" className="text-sm font-medium">
            ABOUT US
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium">
            HOW IT WORKS
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/favorites" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-red-500"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            ({savedPets.length})
          </Link>

          <UserAccountNav user={user} />

          <div className="flex gap-2 text-sm">
            <button className="font-medium">ENG</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-500">UKR</button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Favorites</h1>
            <p className="text-gray-500 mt-1">Pets you've saved for later</p>
          </div>

          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </div>

        {savedPets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">Start browsing and save pets you're interested in</p>
            <Link href="/search">
              <Button>Find Pets</Button>
            </Link>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search query</p>
            <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                <div className="relative">
                  <Link href={`/pets/${pet.id}`}>
                    <div className="aspect-[4/3] relative">
                      <CloudinaryImage
                        src={pet.image_url || "/placeholder.svg?height=400&width=600&query=cute pet"}
                        alt={pet.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemovePet(pet.id)}
                    disabled={isRemoving[pet.id]}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-xs">
                      Saved {formatDistanceToNow(new Date(pet.saved_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Link href={`/pets/${pet.id}`}>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{pet.name}</h3>
                        <p className="text-gray-600 text-sm">{pet.breed}</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {pet.gender}
                      </div>
                    </div>
                    <div className="mt-2 text-gray-500 text-sm">
                      {pet.age} • {pet.age_category}
                    </div>
                    <div className="mt-3 flex items-center text-gray-500 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 mr-1"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {pet.location}, {pet.city}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-[#1a2c3d] text-white py-8 px-12 mt-12">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-4">Policy</h3>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Refund Policy</li>
              <li>Cancellation Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contacts</h3>
            <ul className="space-y-2 text-sm">
              <li>+(02)12-345-67-89</li>
              <li>+(02)12-345-67-89</li>
              <li>info-pan@gmail.com</li>
              <li className="flex gap-4 pt-2">
                <Facebook className="w-5 h-5" />
                <Instagram className="w-5 h-5" />
                <Youtube className="w-5 h-5" />
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
