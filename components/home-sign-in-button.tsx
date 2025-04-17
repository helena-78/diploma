"use client"

import { Button } from "@/components/ui/button"
import { SignInModal } from "@/components/sign-in-modal"

export function HomeSignInButton() {
  return (
    <SignInModal
      trigger={
        <Button size="lg" className="px-8">
          Sign In
        </Button>
      }
    />
  )
}
