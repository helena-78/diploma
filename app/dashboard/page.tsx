import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  // Get user data from cookies
  const cookieStore = await cookies()
  const userDataCookie = cookieStore.get("user-data")

  let user = null
  if (userDataCookie) {
    try {
      user = JSON.parse(userDataCookie.value)
    } catch (error) {
      console.error("Error parsing user data:", error)
      redirect("/login")
    }
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    redirect("/login")
  }

  try {
    // Fetch user's adoption applications
    const applicationsResult = await query(
      `
      SELECT a.*, p.name as pet_name, p.image_url as pet_image_url, p.breed as pet_breed
      FROM applications a
      JOIN pets p ON a.pet_id = p.id
      WHERE a.applicant_id = $1
      ORDER BY a.created_at DESC
    `,
      [user.id],
    )

    // Fetch user's pet publications (pets they've listed for adoption)
    const publicationsResult = await query(
      `
      SELECT * FROM pets
      WHERE owner_id = $1
      ORDER BY created_at DESC
    `,
      [user.id],
    )

    // Fetch user's saved pets (favorites)
    const favoritesResult = await query(
      `
      SELECT p.*, sp.created_at as saved_at
      FROM pets p
      JOIN saved_publications sp ON p.id = sp.pet_id
      WHERE sp.user_id = $1
      ORDER BY sp.created_at DESC
    `,
      [user.id],
    )

    return (
      <DashboardClient
        user={user}
        applications={applicationsResult.rows}
        publications={publicationsResult.rows}
        favorites={favoritesResult.rows}
      />
    )
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to load dashboard data")
  }
}
