import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petId = params.id

    // Fetch pet details from the database
    const petResult = await query(`SELECT * FROM pets WHERE id = $1`, [petId])

    if (petResult.rows.length === 0) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    const pet = petResult.rows[0]

    return NextResponse.json({
      pet,
    })
  } catch (error) {
    console.error("Error fetching pet details:", error)
    return NextResponse.json({ error: "Failed to fetch pet details" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petId = params.id

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
      console.error("Error parsing user data:", error)
      return NextResponse.json({ error: "Invalid user data" }, { status: 401 })
    }

    // Verify the pet belongs to the user (using owner_id)
    const petResult = await query(`SELECT * FROM pets WHERE id = $1 AND owner_id = $2`, [petId, user.id])

    if (petResult.rows.length === 0) {
      return NextResponse.json({ error: "Pet not found or unauthorized" }, { status: 404 })
    }

    // Delete the pet
    await query(`DELETE FROM pets WHERE id = $1`, [petId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting pet:", error)
    return NextResponse.json({ error: "Failed to delete pet" }, { status: 500 })
  }
}
