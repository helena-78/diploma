"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Youtube, Heart, Share2, ArrowLeft, MapPin, Calendar, Info } from "lucide-react"
import { LoginButton } from "@/components/auth/login-button"
import { SignUpButton } from "@/components/sign-up-button"
import { UserAccountNav } from "@/components/auth/user-account-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CloudinaryImage from "@/components/cloudinary-image"

interface PetDetailsClientProps {
  pet: {
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
    description: string
  }
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

export default function PetDetailsClient({ pet, user }: PetDetailsClientProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("petFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const isFavorite = favorites.includes(pet.id)

  const toggleFavorite = () => {
    let newFavorites: string[]

    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== pet.id)
    } else {
      newFavorites = [...favorites, pet.id]
    }

    setFavorites(newFavorites)
    localStorage.setItem("petFavorites", JSON.stringify(newFavorites))
  }

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInquiryForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    console.log("Inquiry submitted:", inquiryForm)
    setIsInquirySubmitted(true)
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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/search" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to search results
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Image and details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative aspect-video">
                <CloudinaryImage
                  src={pet.image_url || "/placeholder.svg?height=600&width=800&query=cute pet"}
                  alt={pet.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Pet details tabs */}
            <div className="mt-8">
              <Tabs defaultValue="about">
                <TabsList className="w-full">
                  <TabsTrigger value="about" className="flex-1">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex-1">
                    Details
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="p-4 bg-white rounded-b-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">About {pet.name}</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {pet.description ||
                      `${pet.name} is a lovely ${pet.age_category.toLowerCase()} ${pet.breed} looking for a forever home. ${pet.gender === "Male" ? "He" : "She"} is ${pet.good_with_kids === "Yes" ? "good with kids and" : ""} would make a wonderful addition to your family.`}
                  </p>
                </TabsContent>
                <TabsContent value="details" className="p-4 bg-white rounded-b-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Pet Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Species</p>
                      <p className="font-medium">{pet.species}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Breed</p>
                      <p className="font-medium">{pet.breed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Age</p>
                      <p className="font-medium">
                        {pet.age} ({pet.age_category})
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Gender</p>
                      <p className="font-medium">{pet.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Size</p>
                      <p className="font-medium">{pet.size}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Coat Length</p>
                      <p className="font-medium">{pet.coat_length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Good with Kids</p>
                      <p className="font-medium">{pet.good_with_kids}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Adoption Type</p>
                      <p className="font-medium">{pet.adoption_type}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right column - Pet info and adoption inquiry */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{pet.name}</h1>
                  <p className="text-gray-600">
                    {pet.breed} · {pet.age_category}
                  </p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {pet.location}, {pet.city}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>On platform for {pet.days_on_platform} days</span>
              </div>

              <div className="flex gap-2 mb-6">
                <Button className="flex-1">Adopt Me</Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">
                    Interested in {pet.name}? Fill out the inquiry form below to get in touch with the owner.
                  </p>
                </div>
              </div>
            </div>

            {/* Adoption inquiry form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Adoption Inquiry</h2>

              {isInquirySubmitted ? (
                <div className="text-center py-6">
                  <div className="text-green-500 mb-4">
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
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Inquiry Sent!</h3>
                  <p className="text-gray-500 mb-6">
                    Thank you for your interest in {pet.name}. The owner will contact you soon.
                  </p>
                  <Button onClick={() => setIsInquirySubmitted(false)}>Send Another Inquiry</Button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={inquiryForm.name}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={inquiryForm.email}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={inquiryForm.phone}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={inquiryForm.message}
                        onChange={handleInquiryChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder={`Hi, I'm interested in adopting ${pet.name}...`}
                      ></textarea>
                    </div>

                    <Button type="submit" className="w-full">
                      Send Inquiry
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
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
