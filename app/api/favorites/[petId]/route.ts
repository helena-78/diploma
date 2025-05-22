import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { petId: string } }) {
  try {
    const petId = params.petId

    // Get user from cookies
    const cookieStore = await cookies()
    const userDataCookie = cookieStore.get("user-data")

    if (!userDataCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    let user
    try {
      user = JSON.parse(userDataCookie.value)
    } catch (error) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 401 })
    }

    // Delete the saved publication
    await query(
      `DELETE FROM saved_publications 
       WHERE user_id = $1 AND pet_id = $2`,
      [user.id, petId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing favorite:", error)
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { petId: string } }) {
  try {
    const petId = params.petId

    // Get user from cookies
    const cookieStore = await cookies()
    const userDataCookie = cookieStore.get("user-data")

    if (!userDataCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    let user
    try {
      user = JSON.parse(userDataCookie.value)
    } catch (error) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 401 })
    }

    // Check if already saved
    const existingResult = await query(
      `SELECT id FROM saved_publications 
       WHERE user_id = $1 AND pet_id = $2`,
      [user.id, petId],
    )

    if (existingResult.rows.length > 0) {
      return NextResponse.json({ success: true, alreadySaved: true })
    }

    // Save the publication
    await query(
      `INSERT INTO saved_publications (user_id, pet_id)
       VALUES ($1, $2)`,
      [user.id, petId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding favorite:", error)
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 })
  }
}
