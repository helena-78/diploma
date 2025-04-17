"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import SignupForm from "./signup-form"
import { useRouter } from "next/navigation"

export function SignUpButton() {
  const router = useRouter()

  return (
    <>
      <Button size="lg" className="px-8" onClick={() => router.push("/signup")}>
        Sign Up
      </Button>
    </>
  )
}
