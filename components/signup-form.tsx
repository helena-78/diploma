"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function SignupForm() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    zipCode: "",
    gender: "",
    birthMonth: "",
    birthDate: "",
    birthYear: "",
    hasPetExperience: "",
    hasAllergies: "",
    livingSpace: "",
    petSpending: "",
    timeCommitment: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user selects
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP/Postal code is required"
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender"
    }

    if (!formData.birthMonth || !formData.birthDate || !formData.birthYear) {
      newErrors.birthDate = "Please select your full date of birth"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.hasPetExperience) {
      newErrors.hasPetExperience = "Please answer this question"
    }

    if (!formData.hasAllergies) {
      newErrors.hasAllergies = "Please answer this question"
    }

    if (!formData.livingSpace) {
      newErrors.livingSpace = "Please select your living space"
    }

    if (!formData.petSpending) {
      newErrors.petSpending = "Please select your expected spending"
    }

    if (!formData.timeCommitment) {
      newErrors.timeCommitment = "Please select your time commitment"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and privacy policy"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      handleNextStep()
    } else {
      if (validateStep2()) {
        try {
          // Show loading state
          setIsSubmitting(true)

          // Simulate API call with a timeout
          // In a real app, you would make an actual API request here
          await new Promise((resolve) => setTimeout(resolve, 1500))

          console.log("Form submitted:", formData)

          // Redirect to user page after successful signup
          router.push("/user/dashboard")
        } catch (error) {
          console.error("Signup error:", error)
          setSubmissionError("An error occurred during signup. Please try again.")
        } finally {
          setIsSubmitting(false)
        }
      }
    }
  }

  // Generate month options
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Generate date options (1-31)
  const dates = Array.from({ length: 31 }, (_, i) => i + 1)

  // Generate year options (current year - 100 to current year - 18)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 - 18 + 1 }, (_, i) => currentYear - 18 - i)

  // Living space options
  const livingSpaceOptions = ["Less than 50 m²", "50-100 m²", "100-150 m²", "150-200 m²", "More than 200 m²"]

  // Spending options
  const spendingOptions = [
    "Less than $50/month",
    "$50-100/month",
    "$100-200/month",
    "$200-300/month",
    "More than $300/month",
  ]

  // Time commitment options
  const timeOptions = [
    "Less than 1 hour/day",
    "1-2 hours/day",
    "2-3 hours/day",
    "3-4 hours/day",
    "More than 4 hours/day",
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create an account</h1>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  step >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-500",
                )}
              >
                1
              </div>
              <span className={cn("text-xs mt-1", step >= 1 ? "text-black" : "text-gray-500")}>Basic Info</span>
            </div>

            <div className="flex-1 h-px bg-gray-200 mx-2"></div>

            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  step >= 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500",
                )}
              >
                2
              </div>
              <span className={cn("text-xs mt-1", step >= 2 ? "text-black" : "text-gray-500")}>Questionnaire</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2",
                    "bg-black text-white",
                  )}
                >
                  1
                </div>
                <h2 className="text-lg font-medium">Basic info</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">
                    Use 8 or more characters with a mix of letters, numbers & symbols
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/ Postal Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="Enter your ZIP code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>

              <div className="space-y-2">
                <Label>What's your gender?</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">
                      Male
                    </Label>
                  </div>
                </RadioGroup>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>

              <div className="space-y-2">
                <Label>What's your date of birth?</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <Select
                    value={formData.birthMonth}
                    onValueChange={(value) => handleSelectChange("birthMonth", value)}
                  >
                    <SelectTrigger className={errors.birthDate ? "border-red-500" : ""}>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={formData.birthDate} onValueChange={(value) => handleSelectChange("birthDate", value)}>
                    <SelectTrigger className={errors.birthDate ? "border-red-500" : ""}>
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      {dates.map((date) => (
                        <SelectItem key={date} value={date.toString()}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={formData.birthYear} onValueChange={(value) => handleSelectChange("birthYear", value)}>
                    <SelectTrigger className={errors.birthDate ? "border-red-500" : ""}>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
              </div>

              <Button
                type="button"
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 flex items-center justify-center gap-2"
                onClick={handleNextStep}
              >
                Next
                <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2",
                    "bg-black text-white",
                  )}
                >
                  1
                </div>
                <h2 className="text-lg font-medium">Questionnaire</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Do you have a previous experience of owning a pet(s)?</Label>
                  <RadioGroup
                    value={formData.hasPetExperience}
                    onValueChange={(value) => handleSelectChange("hasPetExperience", value)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="pet-exp-yes" />
                      <Label htmlFor="pet-exp-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="pet-exp-no" />
                      <Label htmlFor="pet-exp-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.hasPetExperience && <p className="text-red-500 text-xs mt-1">{errors.hasPetExperience}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Are you allergic to animal coat?</Label>
                  <RadioGroup
                    value={formData.hasAllergies}
                    onValueChange={(value) => handleSelectChange("hasAllergies", value)}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="allergies-yes" />
                      <Label htmlFor="allergies-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="allergies-no" />
                      <Label htmlFor="allergies-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.hasAllergies && <p className="text-red-500 text-xs mt-1">{errors.hasAllergies}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Please specify the square meters of the space a pet(s) would live in</Label>
                  <Select
                    value={formData.livingSpace}
                    onValueChange={(value) => handleSelectChange("livingSpace", value)}
                  >
                    <SelectTrigger className={errors.livingSpace ? "border-red-500" : ""}>
                      <SelectValue placeholder="Square meters" />
                    </SelectTrigger>
                    <SelectContent>
                      {livingSpaceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.livingSpace && <p className="text-red-500 text-xs mt-1">{errors.livingSpace}</p>}
                </div>

                <div className="space-y-2">
                  <Label>What would be the amount of spendings on a pet(s)?</Label>
                  <Select
                    value={formData.petSpending}
                    onValueChange={(value) => handleSelectChange("petSpending", value)}
                  >
                    <SelectTrigger className={errors.petSpending ? "border-red-500" : ""}>
                      <SelectValue placeholder="Spendings" />
                    </SelectTrigger>
                    <SelectContent>
                      {spendingOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.petSpending && <p className="text-red-500 text-xs mt-1">{errors.petSpending}</p>}
                </div>

                <div className="space-y-2">
                  <Label>How much time would you spend on the pet(s) (walking, playing, training)?</Label>
                  <Select
                    value={formData.timeCommitment}
                    onValueChange={(value) => handleSelectChange("timeCommitment", value)}
                  >
                    <SelectTrigger className={errors.timeCommitment ? "border-red-500" : ""}>
                      <SelectValue placeholder="Time spending" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.timeCommitment && <p className="text-red-500 text-xs mt-1">{errors.timeCommitment}</p>}
                </div>

                <div className="flex items-start space-x-2 mt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    By creating an account, you agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of use
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing up..." : "Sign up"}
                </Button>
                {submissionError && <p className="text-red-500 text-sm text-center mt-2">{submissionError}</p>}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
