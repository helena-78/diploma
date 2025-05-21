import { type NextRequest, NextResponse } from "next/server"
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
