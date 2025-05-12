import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
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
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

          <div className="space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
              <p className="text-gray-600 mb-4">
                This is a placeholder settings page. In a real application, you would be able to edit your profile
                information here.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue={user.firstName}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue={user.lastName}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue={user.email}
                    disabled
                  />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 italic">
                  Note: Fields are disabled in this demo. To implement full functionality, you would need to create a
                  server action to update user information.
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Password</h3>
              <Button variant="outline" disabled>
                Change Password
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    className="h-4 w-4 rounded border-gray-300"
                    disabled
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="marketing-emails" className="h-4 w-4 rounded border-gray-300" disabled />
                  <label htmlFor="marketing-emails" className="ml-2 block text-sm text-gray-700">
                    Marketing Emails
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Account Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/profile">
                  <Button variant="outline">View Profile</Button>
                </Link>
                <Button variant="destructive" disabled>
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
