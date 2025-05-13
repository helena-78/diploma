"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function LoginButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/login")
  }

  return (
    <Button size="lg" className="px-8" onClick={handleClick}>
      Sign In
    </Button>
  )
}
