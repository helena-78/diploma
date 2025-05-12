"use server"

import { revalidatePath } from "next/cache"

export async function registerUser(formData: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Registration failed")
    }

    revalidatePath("/")
    return { success: true, userId: data.userId }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
