import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  // Get user data from cookies
  const cookieStore = await cookies()
  const userDataCookie = cookieStore.get("user-data")

  // If no user data, redirect to home
  if (!userDataCookie) {
    redirect("/")
  }

  // Parse user data
  let user
  try {
    user = JSON.parse(userDataCookie.value)
  } catch (error) {
    console.error("Error parsing user data:", error)
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="p-3 bg-gray-50 rounded-md">{user.firstName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="p-3 bg-gray-50 rounded-md">{user.lastName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="p-3 bg-gray-50 rounded-md">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <div className="p-3 bg-gray-50 rounded-md">{user.id}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Account Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/settings">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="outline">My Favorites</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
