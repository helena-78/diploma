import { cookies } from "next/headers"
import Link from "next/link"
import { Facebook, Instagram, Youtube, Search } from "lucide-react"
import { LoginButton } from "@/components/auth/login-button"
import { SignUpButton } from "@/components/sign-up-button"

export default async function Home() {
  // Get user data from cookies
  const cookieStore = await cookies()
  const userDataCookie = cookieStore.get("user-data")

  let user = null
  if (userDataCookie) {
    try {
      user = JSON.parse(userDataCookie.value)
    } catch (error) {
      console.error("Error parsing user data:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-serif">
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">P</span>
          </div>
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
          {user ? (
            <UserAccountNavServer user={user} />
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

      <main className="flex-1 flex flex-col md:flex-row bg-gray-50">
        <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center">
          <div className="max-w-[600px] text-center">
            <h1 className="text-[40px] leading-[1.2] font-serif mb-4">
              Get your family
              <br />a new member.
            </h1>
            <p className="text-lg mb-8">Open your doors and hearts to pets in need of a home</p>

            <div className="flex gap-4 max-w-[500px] mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Zip code or City"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="bg-[#1a2c3d] text-white py-8 px-12">
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

// Server component for user account navigation
function UserAccountNavServer({ user }: { user: any }) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
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
        <Link href="/profile" className="ml-2 text-sm text-blue-600 hover:underline">
          Profile
        </Link>
        <Link href="/settings" className="ml-2 text-sm text-blue-600 hover:underline">
          Settings
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="ml-2 text-sm text-blue-600 hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
