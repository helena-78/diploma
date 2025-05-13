"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function SignUpButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/signup")
  }

  return (
    <Button size="lg" className="px-8" onClick={handleClick}>
      Sign Up
    </Button>
  )
}
