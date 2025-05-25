"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Facebook,
  Instagram,
  Youtube,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  XCircle,
  Search,
  Check,
  X,
  User,
  Mail,
} from "lucide-react"
import { UserAccountNav } from "@/components/auth/user-account-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import CloudinaryImage from "@/components/cloudinary-image"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "@/lib/date-utils"

interface Pet {
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
  created_at: string
  saved_at?: string
}

interface Application {
  id: string
  pet_id: string
  pet_name: string
  pet_image_url: string
  pet_breed: string
  status: string
  description: string
  created_at: string
  updated_at?: string
}

interface Inquiry {
  id: string
  pet_id: string
  pet_name: string
  pet_image_url: string
  pet_breed: string
  status: string
  description: string
  created_at: string
  applicant_first_name: string
  applicant_last_name: string
  applicant_email: string
  has_pet_experience: boolean | null
  has_allergies: boolean | null
  living_space: string | null
  pet_spending: string | null
  time_commitment: string | null
}

interface DashboardClientProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  applications: Application[]
  publications: Pet[]
  favorites: Pet[]
  inquiries: Inquiry[]
}

export default function DashboardClient({
  user,
  applications,
  publications,
  favorites,
  inquiries,
}: DashboardClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})
  const [isWithdrawing, setIsWithdrawing] = useState<Record<string, boolean>>({})
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})

  const handleDeletePublication = async (petId: string) => {
    if (confirm("Are you sure you want to delete this pet listing? This action cannot be undone.")) {
      try {
        setIsDeleting((prev) => ({ ...prev, [petId]: true }))

        const response = await fetch(`/api/pets/${petId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete pet listing")
        }

        toast({
          title: "Pet listing deleted",
          description: "Your pet listing has been successfully deleted",
        })

        // Refresh the page to update the listings
        router.refresh()
      } catch (error) {
        console.error("Error deleting pet listing:", error)
        toast({
          title: "Error",
          description: "Failed to delete pet listing. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting((prev) => ({ ...prev, [petId]: false }))
      }
    }
  }

  const handleWithdrawApplication = async (applicationId: string) => {
    if (confirm("Are you sure you want to withdraw this application?")) {
      try {
        setIsWithdrawing((prev) => ({ ...prev, [applicationId]: true }))

        const response = await fetch(`/api/applications/${applicationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "withdrawn" }),
        })

        if (!response.ok) {
          throw new Error("Failed to withdraw application")
        }

        toast({
          title: "Application withdrawn",
          description: "Your adoption application has been withdrawn",
        })

        // Refresh the page to update the applications
        router.refresh()
      } catch (error) {
        console.error("Error withdrawing application:", error)
        toast({
          title: "Error",
          description: "Failed to withdraw application. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsWithdrawing((prev) => ({ ...prev, [applicationId]: false }))
      }
    }
  }

  const handleInquiryResponse = async (inquiryId: string, status: "approved" | "rejected") => {
    const action = status === "approved" ? "approve" : "reject"
    if (confirm(`Are you sure you want to ${action} this application?`)) {
      try {
        setIsProcessing((prev) => ({ ...prev, [inquiryId]: true }))

        console.log(`Sending ${action} request for application ${inquiryId} with status: ${status}`)

        const response = await fetch(`/api/applications/${inquiryId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Error ${action}ing application:`, errorData)
          throw new Error(errorData.error || `Failed to ${action} application`)
        }

        const result = await response.json()
        console.log(`Successfully ${status} application:`, result)

        toast({
          title: `Application ${status}`,
          description: `The adoption application has been ${status}`,
          variant: status === "approved" ? "default" : "destructive",
        })

        // Refresh the page to update the inquiries
        router.refresh()
      } catch (error) {
        console.error(`Error ${action}ing application:`, error)
        toast({
          title: "Error",
          description: `Failed to ${action} application. Please try again.`,
          variant: "destructive",
        })
      } finally {
        setIsProcessing((prev) => ({ ...prev, [inquiryId]: false }))
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "withdrawn":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Withdrawn
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your pet adoption activities</p>
        </div>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="applications" className="flex-1">
              My Applications
              {applications.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                  {applications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex-1">
              Inquiries
              {inquiries.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                  {inquiries.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex-1">
              My Listings
              {publications.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                  {publications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">
              Favorites
              {favorites.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                  {favorites.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Adoption Applications</h2>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Clock className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-500 mb-6">You haven't submitted any adoption applications yet</p>
                  <Link href="/search">
                    <Button>Find Pets to Adopt</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {applications.map((application) => (
                    <div key={application.id} className="border rounded-lg overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 h-48 md:h-auto relative">
                          <CloudinaryImage
                            src={application.pet_image_url || "/placeholder.svg?height=400&width=300&query=cute pet"}
                            alt={application.pet_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 flex-1">
                          <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold">{application.pet_name}</h3>
                              <p className="text-gray-600">{application.pet_breed}</p>
                            </div>
                            <div className="mt-2 md:mt-0">{getStatusBadge(application.status)}</div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Your Message</h4>
                            <p className="text-gray-700">{application.description}</p>
                          </div>

                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>
                                Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                              </span>
                            </div>

                            <div className="flex gap-2 mt-4 md:mt-0">
                              <Link href={`/pets/${application.pet_id}`}>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  View Pet
                                </Button>
                              </Link>

                              {application.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleWithdrawApplication(application.id)}
                                  disabled={isWithdrawing[application.id]}
                                >
                                  {isWithdrawing[application.id] ? (
                                    "Withdrawing..."
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3" />
                                      Withdraw
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Adoption Inquiries</h2>
                <p className="text-sm text-gray-500">Applications for your pet listings</p>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Mail className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No inquiries yet</h3>
                  <p className="text-gray-500 mb-6">You haven't received any adoption inquiries for your pets</p>
                  <Link href="/pets/create">
                    <Button>List a Pet</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="border rounded-lg overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 h-48 md:h-auto relative">
                          <CloudinaryImage
                            src={inquiry.pet_image_url || "/placeholder.svg?height=400&width=300&query=cute pet"}
                            alt={inquiry.pet_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 flex-1">
                          <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold">{inquiry.pet_name}</h3>
                              <p className="text-gray-600">{inquiry.pet_breed}</p>
                            </div>
                            <div className="mt-2 md:mt-0">{getStatusBadge(inquiry.status)}</div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Applicant</h4>
                            <div className="flex items-center gap-2 text-gray-700">
                              <User className="w-4 h-4" />
                              <span>
                                {inquiry.applicant_first_name} {inquiry.applicant_last_name}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{inquiry.applicant_email}</span>
                            </div>
                          </div>

                          {/* Add applicant preferences section */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Applicant Profile</h4>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">Pet Experience:</span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      inquiry.has_pet_experience === true
                                        ? "bg-green-100 text-green-800"
                                        : inquiry.has_pet_experience === false
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {inquiry.has_pet_experience === true
                                      ? "Yes"
                                      : inquiry.has_pet_experience === false
                                        ? "No"
                                        : "Not specified"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">Allergies:</span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      inquiry.has_allergies === true
                                        ? "bg-red-100 text-red-800"
                                        : inquiry.has_allergies === false
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {inquiry.has_allergies === true
                                      ? "Yes"
                                      : inquiry.has_allergies === false
                                        ? "No"
                                        : "Not specified"}
                                  </span>
                                </div>
                                {inquiry.living_space && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Living Space:</span>
                                    <span className="font-medium">{inquiry.living_space}</span>
                                  </div>
                                )}
                                {inquiry.pet_spending && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Pet Spending:</span>
                                    <span className="font-medium">{inquiry.pet_spending}</span>
                                  </div>
                                )}
                                {inquiry.time_commitment && (
                                  <div className="flex items-center gap-2 md:col-span-2">
                                    <span className="text-gray-600">Time Commitment:</span>
                                    <span className="font-medium">{inquiry.time_commitment}</span>
                                  </div>
                                )}
                              </div>
                              {!inquiry.has_pet_experience &&
                                !inquiry.has_allergies &&
                                !inquiry.living_space &&
                                !inquiry.pet_spending &&
                                !inquiry.time_commitment && (
                                  <div className="text-center text-gray-500 text-sm py-2">
                                    No profile information available
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                            <p className="text-gray-700">{inquiry.description}</p>
                          </div>

                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>
                                Received {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                              </span>
                            </div>

                            <div className="flex gap-2 mt-4 md:mt-0">
                              <Link href={`/pets/${inquiry.pet_id}`}>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  View Pet
                                </Button>
                              </Link>

                              {inquiry.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleInquiryResponse(inquiry.id, "approved")}
                                    disabled={isProcessing[inquiry.id]}
                                  >
                                    {isProcessing[inquiry.id] ? (
                                      "Processing..."
                                    ) : (
                                      <>
                                        <Check className="w-3 h-3" />
                                        Approve
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleInquiryResponse(inquiry.id, "rejected")}
                                    disabled={isProcessing[inquiry.id]}
                                  >
                                    {isProcessing[inquiry.id] ? (
                                      "Processing..."
                                    ) : (
                                      <>
                                        <X className="w-3 h-3" />
                                        Reject
                                      </>
                                    )}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Publications Tab */}
          <TabsContent value="publications">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Pet Listings</h2>
                <Link href="/pets/create">
                  <Button className="flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    List a Pet
                  </Button>
                </Link>
              </div>

              {publications.length === 0 ? (
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
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No pet listings yet</h3>
                  <p className="text-gray-500 mb-6">You haven't listed any pets for adoption</p>
                  <Link href="/pets/create">
                    <Button>List a Pet</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publications.map((pet) => (
                    <div key={pet.id} className="bg-white border rounded-lg overflow-hidden h-full">
                      <div className="relative">
                        <div className="aspect-[4/3] relative">
                          <CloudinaryImage
                            src={pet.image_url || "/placeholder.svg?height=400&width=600&query=cute pet"}
                            alt={pet.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white text-xs">
                            Listed {formatDistanceToNow(new Date(pet.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{pet.name}</h3>
                            <p className="text-gray-600 text-sm">{pet.breed}</p>
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {pet.gender}
                          </div>
                        </div>
                        <div className="mt-2 text-gray-500 text-sm">
                          {pet.age} • {pet.age_category}
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Link href={`/pets/${pet.id}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              View
                            </Button>
                          </Link>
                          <div className="flex gap-2">
                            <Link href={`/pets/${pet.id}/edit`}>
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeletePublication(pet.id)}
                              disabled={isDeleting[pet.id]}
                            >
                              {isDeleting[pet.id] ? (
                                "Deleting..."
                              ) : (
                                <>
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Favorite Pets</h2>
                <Link href="/search">
                  <Button variant="outline" className="flex items-center gap-1">
                    <Search className="w-4 h-4" />
                    Find More Pets
                  </Button>
                </Link>
              </div>

              {favorites.length === 0 ? (
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
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-500 mb-6">You haven't saved any pets to your favorites</p>
                  <Link href="/search">
                    <Button>Find Pets</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((pet) => (
                    <Link key={pet.id} href={`/pets/${pet.id}`}>
                      <div className="bg-white border rounded-lg overflow-hidden h-full transition-transform hover:scale-[1.02] cursor-pointer">
                        <div className="relative">
                          <div className="aspect-[4/3] relative">
                            <CloudinaryImage
                              src={pet.image_url || "/placeholder.svg?height=400&width=600&query=cute pet"}
                              alt={pet.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <p className="text-white text-xs">
                              Saved {formatDistanceToNow(new Date(pet.saved_at || Date.now()), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{pet.name}</h3>
                              <p className="text-gray-600 text-sm">{pet.breed}</p>
                            </div>
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              {pet.gender}
                            </div>
                          </div>
                          <div className="mt-2 text-gray-500 text-sm">
                            {pet.age} • {pet.age_category}
                          </div>
                          <div className="mt-3 flex items-center text-gray-500 text-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 mr-1"
                            >
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {pet.location}, {pet.city}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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
