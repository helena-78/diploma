"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff } from "lucide-react"

interface SignInFormProps {
  onClose: () => void
}

export function SignInForm({ onClose }: SignInFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)

    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // In a real app, you would validate credentials with your backend
      // For this demo, we'll simulate a successful login after a brief delay

      // Simple validation
      if (!email) {
        setError("Please enter your email")
        setIsLoading(false)
        return
      }

      if (!password) {
        setError("Please enter your password")
        setIsLoading(false)
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Set user as logged in
      localStorage.setItem("isLoggedIn", "true")

      // Trigger storage event for other components to detect the change
      window.dispatchEvent(new Event("storage"))

      // Close the modal
      onClose()

      // Redirect to search page
      router.push("/search")
    } catch (err) {
      console.error("Sign in error:", err)
      setError("An error occurred during sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        ref={formRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-300"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-medium">Sign in</h2>
          <p className="text-gray-500 mt-1">Enter your email and password to sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 px-2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} Hide
              </Button>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <Link href="#" className="text-sm text-gray-900 underline underline-offset-2">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-gray-900 underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
