import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Query the database for all cities
    const result = await query("SELECT * FROM get_all_cities()")

    return NextResponse.json({ cities: result.rows })
  } catch (error) {
    console.error("Error fetching cities:", error)
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }
}
