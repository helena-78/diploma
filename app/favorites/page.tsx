import { cookies } from "next/headers"
import { query } from "@/lib/db"
import { redirect } from "next/navigation"
import FavoritesClient from "./favorites-client"

export default async function FavoritesPage() {
  // Get user data from cookies
  const cookieStore = await cookies()
  const userDataCookie = cookieStore.get("user-data")

  let user = null
  if (userDataCookie) {
    try {
      user = JSON.parse(userDataCookie.value)
    } catch (error) {
      console.error("Error parsing user data:", error)
      // If we can't parse the user data, redirect to login
      redirect("/login")
    }
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    redirect("/login")
  }

  try {
    // Fetch saved pets from the database
    const savedPetsResult = await query(
      `
      SELECT p.*, sp.created_at as saved_at
      FROM pets p
      JOIN saved_publications sp ON p.id = sp.pet_id
      WHERE sp.user_id = $1
      ORDER BY sp.created_at DESC
    `,
      [user.id],
    )

    return <FavoritesClient user={user} savedPets={savedPetsResult.rows} />
  } catch (error) {
    console.error("Error fetching saved pets:", error)
    throw new Error("Failed to load saved pets")
  }
}
