import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get species parameter from the URL
    const searchParams = request.nextUrl.searchParams
    const species = searchParams.get("species") || "Any"

    // Query the database for breeds based on species
    const result = await query("SELECT * FROM get_breeds_by_species($1)", [species])

    return NextResponse.json({ breeds: result.rows })
  } catch (error) {
    console.error("Error fetching breeds:", error)
    return NextResponse.json({ error: "Failed to fetch breeds" }, { status: 500 })
  }
}
