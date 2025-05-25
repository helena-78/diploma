"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Upload, X, Facebook, Instagram, Youtube } from "lucide-react"
import { UserAccountNav } from "@/components/auth/user-account-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CreatePetFormProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  species: string[]
  breeds: string[]
  cities: string[]
}

export default function CreatePetForm({ user, species, breeds, cities }: CreatePetFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null)
  const [pdfFileName, setPdfFileName] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    ageCategory: "",
    gender: "",
    size: "",
    coatLength: "",
    goodWithKids: "",
    location: "",
    city: "",
    adoptionType: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (10MB limit for PDFs)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a PDF file smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      setSelectedPdf(file)
      setPdfFileName(file.name)
    }
  }

  const removePdf = () => {
    setSelectedPdf(null)
    setPdfFileName("")
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Pet name is required"
    if (!formData.species) newErrors.species = "Species is required"
    if (!formData.breed.trim()) newErrors.breed = "Breed is required"
    if (!formData.age.trim()) newErrors.age = "Age is required"
    if (!formData.ageCategory) newErrors.ageCategory = "Age category is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.size) newErrors.size = "Size is required"
    if (!formData.coatLength) newErrors.coatLength = "Coat length is required"
    if (!formData.goodWithKids) newErrors.goodWithKids = "Good with kids selection is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.adoptionType) newErrors.adoptionType = "Adoption type is required"

    // Validate age is a number
    if (formData.age && isNaN(Number(formData.age))) {
      newErrors.age = "Age must be a number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value)
      })

      // Add image if selected
      if (selectedImage) {
        submitData.append("image", selectedImage)
      }

      // Add PDF if selected
      if (selectedPdf) {
        submitData.append("passport", selectedPdf)
      }

      const response = await fetch("/api/pets", {
        method: "POST",
        body: submitData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create pet listing")
      }

      toast({
        title: "Success!",
        description: "Your pet listing has been created successfully",
      })

      // Redirect to the new pet's page
      router.push(`/pets/${result.petId}`)
    } catch (error) {
      console.error("Error creating pet listing:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create pet listing",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-red-500"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="sr-only">Favorites</span>
          </Link>

          <UserAccountNav user={user} />

          <div className="flex gap-2 text-sm">
            <button className="font-medium">ENG</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-500">UKR</button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">List a Pet for Adoption</h1>
            <p className="text-gray-500 mt-1">Help your pet find a loving new home</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-8">
            {/* Image Upload Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pet Photo</h2>
              <div className="space-y-4">
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload a photo of your pet</p>
                    <p className="text-sm text-gray-500 mb-4">JPG, PNG or GIF (max 5MB)</p>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="pointer-events-none">
                        Choose File
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <Image src={imagePreview || "/placeholder.svg"} alt="Pet preview" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Pet Passport Document */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pet Passport (Optional)</h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Upload your pet's passport or medical records (PDF format only, max 10MB)
                </p>
                {!selectedPdf ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-600 mb-2">Upload pet passport document</p>
                    <p className="text-sm text-gray-500 mb-4">PDF only (max 10MB)</p>
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="pointer-events-none">
                        Choose PDF File
                      </Button>
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">{pdfFileName}</p>
                          <p className="text-sm text-gray-500">PDF Document</p>
                        </div>
                      </div>
                      <button type="button" onClick={removePdf} className="text-red-500 hover:text-red-700 p-1">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                    placeholder="Enter pet's name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="species">Species *</Label>
                  <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)}>
                    <SelectTrigger className={errors.species ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      {species.map((s, index) => (
                        <SelectItem key={`species-${index}-${s}`} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.species && <p className="text-red-500 text-sm mt-1">{errors.species}</p>}
                </div>

                <div>
                  <Label htmlFor="breed">Breed *</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => handleInputChange("breed", e.target.value)}
                    className={errors.breed ? "border-red-500" : ""}
                    placeholder="Enter breed"
                  />
                  {errors.breed && <p className="text-red-500 text-sm mt-1">{errors.breed}</p>}
                </div>

                <div>
                  <Label htmlFor="age">Age (in years) *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="30"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className={errors.age ? "border-red-500" : ""}
                    placeholder="Enter age"
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                <div>
                  <Label htmlFor="ageCategory">Age Category *</Label>
                  <Select
                    value={formData.ageCategory}
                    onValueChange={(value) => handleInputChange("ageCategory", value)}
                  >
                    <SelectTrigger className={errors.ageCategory ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select age category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baby">Baby</SelectItem>
                      <SelectItem value="Young">Young</SelectItem>
                      <SelectItem value="Adult">Adult</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.ageCategory && <p className="text-red-500 text-sm mt-1">{errors.ageCategory}</p>}
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>
              </div>
            </div>

            {/* Physical Characteristics */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Physical Characteristics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size *</Label>
                  <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                    <SelectTrigger className={errors.size ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small">Small</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Large">Large</SelectItem>
                      <SelectItem value="Extra Large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
                </div>

                <div>
                  <Label htmlFor="coatLength">Coat Length *</Label>
                  <Select value={formData.coatLength} onValueChange={(value) => handleInputChange("coatLength", value)}>
                    <SelectTrigger className={errors.coatLength ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select coat length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Short">Short</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Long">Long</SelectItem>
                      <SelectItem value="Hairless">Hairless</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.coatLength && <p className="text-red-500 text-sm mt-1">{errors.coatLength}</p>}
                </div>

                <div>
                  <Label htmlFor="goodWithKids">Good with Kids *</Label>
                  <Select
                    value={formData.goodWithKids}
                    onValueChange={(value) => handleInputChange("goodWithKids", value)}
                  >
                    <SelectTrigger className={errors.goodWithKids ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.goodWithKids && <p className="text-red-500 text-sm mt-1">{errors.goodWithKids}</p>}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Address *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={errors.location ? "border-red-500" : ""}
                    placeholder="Enter full address"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                    placeholder="Enter city"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>
            </div>

            {/* Adoption Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Adoption Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adoptionType">Adoption Type *</Label>
                  <Select
                    value={formData.adoptionType}
                    onValueChange={(value) => handleInputChange("adoptionType", value)}
                  >
                    <SelectTrigger className={errors.adoptionType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select adoption type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adoption">Adoption</SelectItem>
                      <SelectItem value="Foster">Foster</SelectItem>
                      <SelectItem value="Foster to Adopt">Foster to Adopt</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.adoptionType && <p className="text-red-500 text-sm mt-1">{errors.adoptionType}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Tell us more about your pet's personality, habits, and any special needs..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link href="/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating Listing..." : "Create Listing"}
              </Button>
            </div>
          </form>
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
