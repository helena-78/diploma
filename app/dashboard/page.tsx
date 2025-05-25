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
      SELECT a.*, p.name as pet_name, p.image_url as pet_image_url, p.breed as pet_breed,
         owner.first_name as owner_first_name, owner.last_name as owner_last_name, owner.email as owner_email
      FROM applications a
      JOIN pets p ON a.pet_id = p.id
      JOIN users owner ON p.owner_id = owner.id
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

    // Fetch inquiries for user's pets (applications from other users)
    const inquiriesResult = await query(
      `
      SELECT a.*, p.name as pet_name, p.image_url as pet_image_url, p.breed as pet_breed,
             u.first_name as applicant_first_name, u.last_name as applicant_last_name, u.email as applicant_email,
             up.has_pet_experience, up.has_allergies, up.living_space, up.pet_spending, up.time_commitment
      FROM applications a
      JOIN pets p ON a.pet_id = p.id
      JOIN users u ON a.applicant_id = u.id
      LEFT JOIN user_preferences up ON u.id = up.user_id
      WHERE p.owner_id = $1
      ORDER BY a.created_at DESC
    `,
      [user.id],
    )

    return (
      <DashboardClient
        user={user}
        applications={applicationsResult.rows}
        publications={publicationsResult.rows}
        favorites={favoritesResult.rows}
        inquiries={inquiriesResult.rows}
      />
    )
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error("Failed to load dashboard data")
  }
}
