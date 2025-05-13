"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface UserAccountNavClientProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export function UserAccountNavClient({ user }: UserAccountNavClientProps) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const handleLogout = async () => {
    try {
      // Clear client-side state
      localStorage.removeItem("isLoggedIn")

      // Submit the logout form
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.redirected) {
        window.location.href = response.url
      } else {
        // Fallback if no redirect
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback if error
      router.push("/")
      router.refresh()
    }
  }

  return (
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
          <span className="ml-2 text-gray-600">{user.firstName || "My Account"}</span>
          <ChevronDown
            className={`ml-1 h-4 w-4 text-gray-600 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
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
            onClick={() => setIsDropdownOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            role="menuitem"
            onClick={() => setIsDropdownOpen(false)}
          >
            Settings
          </Link>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            onClick={handleLogout}
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
