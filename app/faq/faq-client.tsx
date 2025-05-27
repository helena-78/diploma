"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Search, PlusCircle, User, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { UserAccountNav } from "@/components/auth/user-account-nav"
import { LoginButton } from "@/components/auth/login-button"
import { SignUpButton } from "@/components/sign-up-button"

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "You can create an account by clicking the 'Sign Up' button in the top right corner of any page. Fill in your basic information including name, email, and password to get started.",
      },
      {
        question: "Is the platform free to use?",
        answer:
          "Yes, our pet adoption platform is completely free for both adopters and pet owners. We believe in making pet adoption accessible to everyone.",
      },
      {
        question: "What types of pets can I find here?",
        answer:
          "You can find cats, dogs, and other pets including rabbits, birds, reptiles, and small mammals. Use our search filters to find exactly what you're looking for.",
      },
    ],
  },
  {
    category: "Adoption Process",
    questions: [
      {
        question: "How does the adoption process work?",
        answer:
          "1. Browse pets and find one you're interested in\n2. Submit an adoption application\n3. Wait for the pet owner to review your application\n4. If approved, you'll receive the owner's contact information\n5. Arrange a meeting and complete the adoption",
      },
      {
        question: "What information do I need to provide in my application?",
        answer:
          "You'll need to provide information about your living situation, experience with pets, lifestyle, and why you want to adopt. This helps pet owners find the best match for their pets.",
      },
      {
        question: "How long does it take to hear back about my application?",
        answer:
          "Response times vary by pet owner, but most applications receive a response within 2-7 days. You can check the status of your applications in your dashboard.",
      },
      {
        question: "Can I apply for multiple pets?",
        answer:
          "Yes, you can submit applications for multiple pets. However, we recommend being selective and only applying for pets you're genuinely interested in adopting.",
      },
    ],
  },
  {
    category: "For Pet Owners",
    questions: [
      {
        question: "How do I list my pet for adoption?",
        answer:
          "Click 'List a Pet' in the navigation menu, fill out the detailed form with your pet's information, upload photos, and submit. Your listing will be live immediately.",
      },
      {
        question: "What documents should I prepare?",
        answer:
          "Prepare your pet's medical records, vaccination certificates, and any relevant documentation. You can also upload a pet passport if available.",
      },
      {
        question: "How do I review adoption applications?",
        answer:
          "Go to your dashboard to see all applications for your pets. You can review applicant information, approve, or reject applications based on what's best for your pet.",
      },
      {
        question: "Can I edit my pet's listing after posting?",
        answer: "Yes, you can edit your pet's information, photos, and description at any time through your dashboard.",
      },
    ],
  },
  {
    category: "Safety & Trust",
    questions: [
      {
        question: "How do you ensure the safety of pets and users?",
        answer:
          "We encourage users to meet in safe, public places and take time to get to know each other. Always trust your instincts and report any suspicious behavior.",
      },
      {
        question: "What should I do if I encounter a problem?",
        answer:
          "If you encounter any issues with users or have concerns about a listing, please contact our support team immediately. We take all reports seriously.",
      },
      {
        question: "Are the pets health-checked?",
        answer:
          "Pet owners are responsible for providing accurate health information. We recommend asking for recent veterinary records and arranging a vet check after adoption.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "I'm having trouble uploading photos. What should I do?",
        answer:
          "Make sure your photos are in JPG, PNG, or WebP format and under 5MB each. Try refreshing the page or using a different browser if you continue to have issues.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page and enter your email address. You'll receive instructions to reset your password.",
      },
      {
        question: "The website isn't working properly on my device. What can I do?",
        answer:
          "Try clearing your browser cache, updating your browser, or using a different device. If problems persist, contact our technical support team.",
      },
    ],
  },
]

export default function FAQClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          <div className="flex gap-2 text-sm">
            <button className="font-medium">ENG</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-500">UKR</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions about pet adoption and our platform
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No questions found matching your search.</p>
            </div>
          ) : (
            filteredFAQ.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b bg-gray-50">
                  <h2 className="text-2xl font-semibold text-gray-900">{category.category}</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq, questionIndex) => {
                    const itemId = `${categoryIndex}-${questionIndex}`
                    const isOpen = openItems.includes(itemId)

                    return (
                      <Collapsible key={questionIndex} open={isOpen} onOpenChange={() => toggleItem(itemId)}>
                        <CollapsibleTrigger className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-6 pb-4">
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</div>
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-purple-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">Can't find what you're looking for? We're here to help!</p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Contact Support</Button>
        </div>
      </main>
    </div>
  )
}
