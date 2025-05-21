import { cookies } from "next/headers"
import { query } from "@/lib/db"
import { notFound } from "next/navigation"
import PetDetailsClient from "./pet-details-client"

export default async function PetDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const petId = params.id

  try {
    // Fetch pet details from the database
    const petResult = await query(`SELECT * FROM pets WHERE id = $1`, [petId])

    if (petResult.rows.length === 0) {
      notFound()
    }

    const pet = petResult.rows[0]

    // Get user data from cookies
    const cookieStore = await cookies()
    const userDataCookie = cookieStore.get("user-data")

    let user = null
    if (userDataCookie) {
      try {
        user = JSON.parse(userDataCookie.value)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    return <PetDetailsClient pet={pet} user={user} />
  } catch (error) {
    console.error("Error fetching pet details:", error)
    throw new Error("Failed to load pet details")
  }
}
