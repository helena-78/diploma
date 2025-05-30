import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { LoginButton } from "@/components/auth/login-button"
import { SignUpButton } from "@/components/sign-up-button"
import { UserAccountNav } from "@/components/auth/user-account-nav"

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
          <Link href="/faq" className="text-sm font-medium">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
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

      <main className="flex-1 flex flex-col bg-gray-50">
        <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center">
          <div className="max-w-[600px] text-center">
            <h1 className="text-[40px] leading-[1.2] font-serif mb-4">
              Get your family
              <br />a new member.
            </h1>
            <p className="text-lg mb-12 text-gray-600">Open your doors and hearts to pets in need of a home</p>

            <div className="flex justify-center gap-16 max-w-[500px] mx-auto">
              <Link href="/search?species=Dog" className="group">
                <div className="flex flex-col items-center gap-4 p-6 hover:bg-gray-50 rounded-lg transition-colors">
                  {/* Dog Icon from SVG file */}
                  <div className="w-16 h-16 flex items-center justify-center">
                    <Image
                      src="/dog.svg"
                      alt="Dog"
                      width={64}
                      height={64}
                      className="text-purple-600 group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                  <span className="text-gray-700 font-medium text-lg">Dogs</span>
                </div>
              </Link>

              <Link href="/search?species=Cat" className="group">
                <div className="flex flex-col items-center gap-4 p-6 hover:bg-gray-50 rounded-lg transition-colors">
                  {/* Cat Icon */}
                  <div className="w-16 h-16 flex items-center justify-center">
                    <Image
                      src="/cat.svg"
                      alt="Dog"
                      width={64}
                      height={64}
                      className="text-purple-600 group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                  <span className="text-gray-700 font-medium text-lg">Cats</span>
                </div>
              </Link>

              <Link href="/search?species=Other" className="group">
                <div className="flex flex-col items-center gap-4 p-6 hover:bg-gray-50 rounded-lg transition-colors">
                  {/* Paw Icon */}
                  <div className="w-16 h-16 flex items-center justify-center">
                    <Image
                      src="/paw.svg"
                      alt="Dog"
                      width={64}
                      height={64}
                      className="text-purple-600 group-hover:opacity-80 transition-opacity"
                    />
                  </div>
                  <span className="text-gray-700 font-medium text-lg">Other</span>
                </div>
              </Link>
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
