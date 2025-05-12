"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// User registration action (from previous implementation)
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

// New login action
export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        message: data.message || "Login failed",
      }
    }

    // Store the token in a cookie - properly await the cookies() call
    const cookieStore = await cookies()
    cookieStore.set("auth-token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Store user data in a non-HTTP-only cookie for client access
    cookieStore.set(
      "user-data",
      JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    revalidatePath("/")
    return {
      success: true,
      user: data.user,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Logout action
export async function logoutUser() {
  const cookieStore = await cookies()

  // Clear auth cookies
  cookieStore.delete("auth-token")
  cookieStore.delete("user-data")

  revalidatePath("/")
  return { success: true }
}

// Check if user is authenticated
export async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")
  const userData = cookieStore.get("user-data")

  if (!token || !userData) {
    return { authenticated: false, user: null }
  }

  try {
    const user = JSON.parse(userData.value)
    return { authenticated: true, user }
  } catch (error) {
    return { authenticated: false, user: null }
  }
}
