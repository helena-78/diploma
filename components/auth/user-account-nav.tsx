"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserAccountNavProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const handleSignOut = async () => {
    // Clear user-specific favorites from localStorage before signing out
    localStorage.removeItem(`petFavorites-${user.id}`)

    // Perform sign out
    await fetch("/api/auth/signout", {
      method: "POST",
    })

    // Remove the user-data cookie
    document.cookie = "user-data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // Remove from localStorage and dispatch event
    localStorage.removeItem("user-data")
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "user-data",
        newValue: null,
      }),
    )

    // Redirect to home page
    window.location.href = "/"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 focus:outline-none">
        <span className="font-medium">
          {user.firstName} {user.lastName}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2">
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="w-[200px] truncate text-sm text-gray-500">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="cursor-pointer">
            Favorites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            handleSignOut()
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
