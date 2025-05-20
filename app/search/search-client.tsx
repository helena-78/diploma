"use client"

import type React from "react"
import Image from "next/image"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Facebook, Instagram, Youtube, Search, Filter } from "lucide-react"
import { LoginButton } from "@/components/auth/login-button"
import { SignUpButton } from "@/components/sign-up-button"
import FilterSidebar, { type FilterValues } from "@/components/filter-sidebar"
import PetCard from "@/components/pet-card"
import { UserAccountNav } from "@/components/auth/user-account-nav"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Extended pet data with all filterable properties
const petsData = [
  {
    id: 1,
    name: "Max",
    breed: "Labrador",
    species: "Dog",
    age: "2 years",
    ageCategory: "Young",
    gender: "Male",
    size: "Large",
    coatLength: "Short",
    goodWithKids: "Yes",
    location: "New York, NY",
    city: "New York, NY",
    daysOnPlatform: "15",
    adoptionType: "Permanent",
    imageUrl: "/labrador.png",
  },
  {
    id: 2,
    name: "Bella",
    breed: "German Shepherd",
    species: "Dog",
    age: "1 year",
    ageCategory: "Young",
    gender: "Female",
    size: "Large",
    coatLength: "Medium",
    goodWithKids: "Yes",
    location: "Los Angeles, CA",
    city: "Los Angeles, CA",
    daysOnPlatform: "7",
    adoptionType: "Permanent",
    imageUrl: "/majestic-german-shepherd.png",
  },
  {
    id: 3,
    name: "Charlie",
    breed: "Golden Retriever",
    species: "Dog",
    age: "3 years",
    ageCategory: "Adult",
    gender: "Male",
    size: "Large",
    coatLength: "Medium",
    goodWithKids: "Yes",
    location: "Chicago, IL",
    city: "Chicago, IL",
    daysOnPlatform: "30",
    adoptionType: "Permanent",
    imageUrl: "/golden-retriever.png",
  },
  {
    id: 4,
    name: "Luna",
    breed: "Beagle",
    species: "Dog",
    age: "2 years",
    ageCategory: "Young",
    gender: "Female",
    size: "Medium",
    coatLength: "Short",
    goodWithKids: "Yes",
    location: "Houston, TX",
    city: "Houston, TX",
    daysOnPlatform: "45",
    adoptionType: "Permanent",
    imageUrl: "/beagle-portrait.png",
  },
  {
    id: 5,
    name: "Cooper",
    breed: "Bulldog",
    species: "Dog",
    age: "4 years",
    ageCategory: "Adult",
    gender: "Male",
    size: "Medium",
    coatLength: "Short",
    goodWithKids: "Yes",
    location: "Phoenix, AZ",
    city: "Phoenix, AZ",
    daysOnPlatform: "60",
    adoptionType: "Permanent",
    imageUrl: "/happy-bulldog.png",
  },
  {
    id: 6,
    name: "Lucy",
    breed: "Poodle",
    species: "Dog",
    age: "1 year",
    ageCategory: "Young",
    gender: "Female",
    size: "Small",
    coatLength: "Long",
    goodWithKids: "Yes",
    location: "Philadelphia, PA",
    city: "Philadelphia, PA",
    daysOnPlatform: "5",
    adoptionType: "Permanent",
    imageUrl: "/fluffy-white-poodle.png",
  },
  {
    id: 7,
    name: "Bailey",
    breed: "Siberian Husky",
    species: "Dog",
    age: "3 years",
    ageCategory: "Adult",
    gender: "Female",
    size: "Large",
    coatLength: "Medium",
    goodWithKids: "Yes",
    location: "San Antonio, TX",
    city: "San Antonio, TX",
    daysOnPlatform: "20",
    adoptionType: "Temporary",
    imageUrl: "/siberian-husky-portrait.png",
  },
  {
    id: 8,
    name: "Rocky",
    breed: "Boxer",
    species: "Dog",
    age: "5 years",
    ageCategory: "Adult",
    gender: "Male",
    size: "Large",
    coatLength: "Short",
    goodWithKids: "No",
    location: "San Diego, CA",
    city: "San Diego, CA",
    daysOnPlatform: "100",
    adoptionType: "Permanent",
    imageUrl: "/boxer-dog.png",
  },
  {
    id: 9,
    name: "Daisy",
    breed: "Dachshund",
    species: "Dog",
    age: "2 years",
    ageCategory: "Young",
    gender: "Female",
    size: "Small",
    coatLength: "Short",
    goodWithKids: "Yes",
    location: "Dallas, TX",
    city: "Dallas, TX",
    daysOnPlatform: "12",
    adoptionType: "Permanent",
    imageUrl: "/dachshund-in-garden.png",
  },
  {
    id: 10,
    name: "Whiskers",
    breed: "Siamese",
    species: "Cat",
    age: "3 years",
    ageCategory: "Adult",
    gender: "Male",
    size: "Medium",
    coatLength: "Short",
    goodWithKids: "Yes",
    location: "New York, NY",
    city: "New York, NY",
    daysOnPlatform: "25",
    adoptionType: "Permanent",
    imageUrl: "/siamese-cat.png",
  },
  {
    id: 11,
    name: "Mittens",
    breed: "Maine Coon",
    species: "Cat",
    age: "4 years",
    ageCategory: "Adult",
    gender: "Female",
    size: "Large",
    coatLength: "Long",
    goodWithKids: "Yes",
    location: "Chicago, IL",
    city: "Chicago, IL",
    daysOnPlatform: "40",
    adoptionType: "Permanent",
    imageUrl: "/maine-coon-cat.png",
  },
  {
    id: 12,
    name: "Tweety",
    breed: "Budgerigar",
    species: "Bird",
    age: "1 year",
    ageCategory: "Young",
    gender: "Male",
    size: "Small",
    coatLength: "Short",
    goodWithKids: "Yes",
    location: "Los Angeles, CA",
    city: "Los Angeles, CA",
    daysOnPlatform: "10",
    adoptionType: "Permanent",
    imageUrl: "/budgerigar-bird.png",
  },
]

interface SearchPageClientProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

export default function SearchPageClient({ user }: SearchPageClientProps) {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    species: "Any",
    breed: "Any",
    age: "Any",
    size: "Any",
    gender: "Any",
    city: "Any",
    coatLength: "Any",
    goodWithKids: "Any",
    adoptionType: "Any",
    daysOnPlatform: "Any",
  })
  const [filteredPets, setFilteredPets] = useState(petsData)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("petFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
    setIsLoading(false)
  }, [])

  // Filter pets based on search query and active filters
  useEffect(() => {
    let result = petsData

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (pet) =>
          pet.name.toLowerCase().includes(query) ||
          pet.breed.toLowerCase().includes(query) ||
          pet.species.toLowerCase().includes(query),
      )
    }

    // Apply all other filters
    result = result.filter((pet) => {
      // Species filter
      if (activeFilters.species !== "Any" && pet.species !== activeFilters.species) {
        return false
      }

      // Breed filter
      if (activeFilters.breed !== "Any" && pet.breed !== activeFilters.breed) {
        return false
      }

      // City filter
      if (activeFilters.city !== "Any" && pet.city !== activeFilters.city) {
        return false
      }

      // Age filter
      if (activeFilters.age !== "Any" && pet.ageCategory !== activeFilters.age) {
        return false
      }

      // Size filter
      if (activeFilters.size !== "Any" && pet.size !== activeFilters.size) {
        return false
      }

      // Gender filter
      if (activeFilters.gender !== "Any" && pet.gender !== activeFilters.gender) {
        return false
      }

      // Coat length filter
      if (activeFilters.coatLength !== "Any" && pet.coatLength !== activeFilters.coatLength) {
        return false
      }

      // Good with kids filter
      if (activeFilters.goodWithKids !== "Any" && pet.goodWithKids !== activeFilters.goodWithKids) {
        return false
      }

      // Adoption type filter
      if (activeFilters.adoptionType !== "Any" && pet.adoptionType !== activeFilters.adoptionType) {
        return false
      }

      // Days on platform filter
      if (activeFilters.daysOnPlatform !== "Any") {
        const days = Number.parseInt(pet.daysOnPlatform)

        if (activeFilters.daysOnPlatform === "1-7" && (days < 1 || days > 7)) {
          return false
        } else if (activeFilters.daysOnPlatform === "8-30" && (days < 8 || days > 30)) {
          return false
        } else if (activeFilters.daysOnPlatform === "31-90" && (days < 31 || days > 90)) {
          return false
        } else if (activeFilters.daysOnPlatform === "91+" && days < 91) {
          return false
        }
      }

      return true
    })

    setFilteredPets(result)
  }, [searchQuery, activeFilters])

  const handleFiltersChange = (filters: FilterValues) => {
    setActiveFilters(filters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col font-serif">
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8"
            />
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
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            ({favorites.length})
          </Link>

          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <>
              <LoginButton />
              <SignUpButton />
            </>
          )}

          <div className="flex gap-2 text-sm">
            <button className="font-medium">ENG</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-500">UKR</button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Mobile filters - shown/hidden based on state */}
        <div className={`${showMobileFilters ? "block" : "hidden"} md:hidden`}>
          <FilterSidebar onFiltersChange={handleFiltersChange} initialFilters={activeFilters} />
        </div>

        {/* Desktop filters - always visible on md+ screens */}
        <div className="hidden md:block">
          <FilterSidebar onFiltersChange={handleFiltersChange} initialFilters={activeFilters} />
        </div>

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Pet Listings</h1>
            <p className="text-gray-500">{filteredPets.length} pets found</p>
          </div>

          {filteredPets.length === 0 ? (
            <div className="text-center py-12">
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
              <h3 className="text-xl font-medium text-gray-900 mb-2">No pets found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
              <Button
                onClick={() => {
                  setActiveFilters({
                    species: "Any",
                    breed: "Any",
                    age: "Any",
                    size: "Any",
                    gender: "Any",
                    city: "Any",
                    coatLength: "Any",
                    goodWithKids: "Any",
                    adoptionType: "Any",
                    daysOnPlatform: "Any",
                  })
                  setSearchQuery("")
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => (
                <Link key={pet.id} href={`/pets/${pet.id}`}>
                  <PetCard
                    key={pet.id}
                    name={pet.name}
                    breed={pet.breed}
                    age={pet.age}
                    gender={pet.gender}
                    location={pet.location}
                    imageUrl={pet.imageUrl}
                    isFavorite={favorites.includes(pet.id)}
                  />
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="bg-[#1a2c3d] text-white py-8 px-12">
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
