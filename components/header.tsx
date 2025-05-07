"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SignInButton } from "@/components/sign-in-button"
import { SignUpButton } from "@/components/sign-up-button"

export default function Header() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState("ENG")
  const pathname = usePathname()

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("petFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
    setIsLoading(false)
  }, [])

  // Update favorites when localStorage changes (from other components)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedFavorites = localStorage.getItem("petFavorites")
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === "ENG" ? "UKR" : "ENG")
  }

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and site name */}
          <div className="flex items-center">
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
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/search"
              className={`text-sm font-medium ${
                pathname === "/find-a-pet" ? "text-black" : "text-gray-600 hover:text-black"
              }`}
            >
              FIND A PET
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium ${
                pathname === "/about-us" ? "text-black" : "text-gray-600 hover:text-black"
              }`}
            >
              ABOUT US
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-medium ${
                pathname === "/how-it-works" ? "text-black" : "text-gray-600 hover:text-black"
              }`}
            >
              HOW IT WORKS
            </Link>
          </nav>

          {/* Right side - Favorites, Sign In/Up, Language */}
          <div className="flex items-center space-x-4">
            <Link href="/favorites" className="flex items-center text-gray-700 hover:text-black">
              <Heart className={`h-5 w-5 ${favorites.length > 0 ? "fill-black" : ""}`} />
              <span className="ml-1">({!isLoading ? favorites.length : "..."})</span>
            </Link>
            <SignInButton />
            <SignUpButton />

            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={toggleLanguage}
                className={`font-medium ${language === "ENG" ? "text-black" : "text-gray-500"}`}
              >
                ENG
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={toggleLanguage}
                className={`font-medium ${language === "UKR" ? "text-black" : "text-gray-500"}`}
              >
                UKR
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
