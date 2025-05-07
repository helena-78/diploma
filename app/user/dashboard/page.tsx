"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UserDashboard() {
  const [userName, setUserName] = useState("New User")
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      // In a real app, you would fetch user data from an API
      setUserName(localStorage.getItem("userName") || "New User")

      // Get favorites from localStorage
      const storedFavorites = localStorage.getItem("petFavorites")
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
                <p className="text-gray-600">Thank you for joining Pet Adoption Network</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Account Status</h2>
              <p className="text-green-600 font-medium">Active</p>
              <p className="text-gray-600 text-sm mt-2">Your account was created just now</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Favorite Pets</h2>
              <p className="font-medium">{favorites.length} pets</p>
              <Link href="/favorites" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                View all favorites
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Adoption Status</h2>
              <p className="text-gray-600">No active adoptions</p>
              <Link href="/search" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Browse pets
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold mb-6">Getting Started</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Find Your Perfect Pet</h3>
              <p className="text-gray-600 mb-4">
                Browse our selection of pets looking for a loving home. Filter by species, breed, age, and more.
              </p>
              <Button asChild variant="outline">
                <Link href="/search">Browse Pets</Link>
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn About Adoption</h3>
              <p className="text-gray-600 mb-4">
                Understand the adoption process, requirements, and what to expect when bringing your new pet home.
              </p>
              <Button asChild variant="outline">
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
