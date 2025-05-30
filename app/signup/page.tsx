import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <SignupForm />
      </div>
    </div>
  )
}
