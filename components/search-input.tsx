"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function SearchInput() {
  const [location, setLocation] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      router.push(`/search?location=${encodeURIComponent(location)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative flex-1">
      <input
        type="text"
        placeholder="Zip code or City"
        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </button>
    </form>
  )
}
