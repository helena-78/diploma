"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SignInForm } from "./sign-in-form"

export function SignInButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button size="lg" className="px-8" onClick={() => setIsOpen(true)}>
        Sign In
      </Button>

      {isOpen && <SignInForm onClose={() => setIsOpen(false)} />}
    </>
  )
}
