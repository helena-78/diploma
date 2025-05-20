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

interface Pet {
  id: number
  name: string
  breed: string
  species: string
  age: string
  ageCategory: string
  gender: string
  size: string
  coatLength: string
  goodWithKids: string
  location: string
  city: string
  daysOnPlatform: string
  adoptionType: string
  imageUrl: string
}

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
  const [pets, setPets] = useState<Pet[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("petFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  // Fetch pets from the API with filters
  useEffect(() => {
    async function fetchPets() {
      try {
        setIsLoading(true)
        setError(null)

        // Build query string with all filters
        const params = new URLSearchParams()

        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value !== "Any") {
            params.append(key, value)
          }
        })

        if (searchQuery) {
          params.append("search", searchQuery)
        }

        const response = await fetch(`/api/pets?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Error fetching pets: ${response.status}`)
        }

        const data = await response.json()
        setPets(data.pets || [])
      } catch (error) {
        console.error("Error fetching pets:", error)
        setError("Failed to load pets. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchPets()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [activeFilters, searchQuery])

  const handleFiltersChange = (filters: FilterValues) => {
    setActiveFilters(filters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearAllFilters = () => {
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
            <p className="text-gray-500">{pets.length} pets found</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : pets.length === 0 ? (
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
              <Button onClick={clearAllFilters}>Clear all filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
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
