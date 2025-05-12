"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Youtube, ChevronDown } from "lucide-react"
import { SignInButton } from "@/components/sign-in-button"
import { SignUpButton } from "@/components/sign-up-button"
import FilterSidebar from "@/components/filter-sidebar"
import PetCard from "@/components/pet-card"

const pets = [
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
  {
    id: 7,
    name: "Bailey",
    breed: "Siberian Husky",
    age: "3 years",
    gender: "Female",
    location: "San Antonio, TX",
    imageUrl: "/placeholder.svg?height=192&width=384",
  },
  {
    id: 8,
    name: "Rocky",
    breed: "Boxer",
    age: "5 years",
    gender: "Male",
    location: "San Diego, CA",
    imageUrl: "/placeholder.svg?height=192&width=384",
  },
  {
    id: 9,
    name: "Daisy",
    breed: "Dachshund",
    age: "2 years",
    gender: "Female",
    location: "Dallas, TX",
    imageUrl: "/placeholder.svg?height=192&width=384",
  },
]

export default function SearchPage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("petFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }

    const loggedInStatus = localStorage.getItem("isLoggedIn")
    if (loggedInStatus === "true") {
      setIsLoggedIn(true)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isDropdownOpen])

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
            <Image src="/saved.svg" alt="Saved" width={16} height={16} className="w-5 h-5" />({favorites.length})
          </Link>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-gray-600"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="ml-2 text-gray-600">My Account</span>
                  <ChevronDown
                    className={`ml-1 h-4 w-4 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md py-1 z-10 border border-gray-100"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    onClick={() => {
                      localStorage.setItem("isLoggedIn", "false")
                      setIsLoggedIn(false)
                      setIsDropdownOpen(false)
                    }}
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <SignInButton />
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

      <div className="flex min-h-screen">
        <FilterSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Pet Listings</h1>
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
