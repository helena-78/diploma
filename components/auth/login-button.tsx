"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"

export function LoginButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button size="lg" className="px-8" onClick={() => setIsOpen(true)}>
        Sign In
      </Button>

      {isOpen && <LoginForm onClose={() => setIsOpen(false)} />}
    </>
  )
}
