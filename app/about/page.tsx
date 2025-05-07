import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton } from "@/components/sign-in-button"
import { SignUpButton } from "@/components/sign-up-button"
import { Facebook, Instagram, Youtube} from "lucide-react";


export default function AboutPage() {
  return (
    <div className="bg-white font-serif">
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
          src="/logo.svg" 
          alt="Logo" 
          width={32} 
          height={32} 
          className="w-8 h-8"
        />
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
          <SignInButton />
          <SignUpButton />
          <div className="flex gap-2 text-sm">
            <button className="font-medium">ENG</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-500">UKR</button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative bg-gray-100">
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">About PAN</h1>
              <p className="text-xl text-gray-600 mb-8">
                We're on a mission to connect loving homes with pets in need, creating happier lives for animals and
                humans alike.
              </p>
              <Button size="lg" asChild>
                <Link href="/search">Find Your New Best Friend</Link>
              </Button>
            </div>
            <div className="relative h-64 sm:h-80 lg:h-96">
              <Image
                src="/dog_and_owner.webp?height=600&width=800"
                alt="Happy dog with owner"
                fill
                className="rounded-lg object-cover shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              At PetPal, we believe every pet deserves a loving home. Our mission is to reduce pet homelessness through
              adoption, education, and community support. We strive to make the adoption process simple, enjoyable, and
              accessible to everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">10,000+</h3>
                <p className="text-gray-600 text-center">Pets adopted through our platform</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">500+</h3>
                <p className="text-gray-600 text-center">Partner shelters and rescues nationwide</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">15 Years</h3>
                <p className="text-gray-600 text-center">Of dedicated service to pets and their people</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  PetPal was founded in 2008 by Sarah and Mark Johnson, two animal lovers who saw a need for a better
                  way to connect adoptable pets with loving homes.
                </p>
                <p className="text-gray-600 mb-4">
                  After volunteering at local shelters, they realized that many wonderful animals were being overlooked
                  simply because they didn't have enough visibility. They created PetPal as a platform to showcase these
                  animals and streamline the adoption process.
                </p>
                <p className="text-gray-600">
                  What started as a small local initiative has grown into a nationwide network of shelters, rescues, and
                  adopters all working together to find homes for pets in need. Today, PetPal continues to innovate and
                  expand, but our core mission remains the same: to help every pet find their perfect match.
                </p>
              </div>
              <div className="order-1 lg:order-2 relative h-64 sm:h-80 lg:h-96">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="PetPal founders"
                  fill
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Co-Founder & CEO",
                bio: "Animal lover with 20+ years of rescue experience",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Mark Johnson",
                role: "Co-Founder & CTO",
                bio: "Tech expert passionate about using technology for good",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Dr. Emily Chen",
                role: "Chief Veterinary Officer",
                bio: "Specializes in shelter medicine and animal welfare",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "James Wilson",
                role: "Director of Shelter Relations",
                bio: "Former shelter manager with a passion for networking",
                image: "/placeholder.svg?height=400&width=400",
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Compassion First</h3>
              <p className="text-gray-600">
                We believe in treating every animal with dignity and respect. Our decisions are guided by what's best
                for the pets in our care.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Connection</h3>
              <p className="text-gray-600">
                We foster strong relationships between shelters, adopters, and volunteers, creating a network of support
                for animals in need.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ethical Practices</h3>
              <p className="text-gray-600">
                We uphold the highest standards of transparency, honesty, and ethical behavior in all our operations and
                partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a2c3d] text-white py-8 px-12">
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
      </section>
    </div>
  )
}
