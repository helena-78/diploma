import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Get user from cookies
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user-data")

    if (!userCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)

    // Parse request body
    const body = await request.json()
    const { pet_id, description } = body

    // Validate input
    if (!pet_id || !description) {
      return NextResponse.json({ error: "Pet ID and description are required" }, { status: 400 })
    }

    if (!description.trim()) {
      return NextResponse.json({ error: "Description cannot be empty" }, { status: 400 })
    }

    // Check if the pet exists and get owner info
    const petResult = await query("SELECT id, owner_id FROM pets WHERE id = $1", [pet_id])

    if (petResult.rows.length === 0) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    const pet = petResult.rows[0]

    // Prevent users from applying to their own pets
    if (pet.owner_id === user.id) {
      return NextResponse.json({ error: "You cannot apply to adopt your own pet" }, { status: 400 })
    }

    // Check if user has already applied for this pet
    const existingApplication = await query("SELECT id FROM applications WHERE applicant_id = $1 AND pet_id = $2", [
      user.id,
      pet_id,
    ])

    if (existingApplication.rows.length > 0) {
      return NextResponse.json({ error: "You have already submitted an application for this pet" }, { status: 400 })
    }

    // Insert the application
    const result = await query(
      `INSERT INTO applications (applicant_id, pet_id, description, status, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
      [user.id, pet_id, description.trim(), "pending"],
    )

    const applicationId = result.rows[0].id

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        applicationId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
