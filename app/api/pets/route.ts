import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get filter parameters from the URL
    const searchParams = request.nextUrl.searchParams
    const species = searchParams.get("species")
    const breed = searchParams.get("breed")
    const age = searchParams.get("age")
    const size = searchParams.get("size")
    const gender = searchParams.get("gender")
    const city = searchParams.get("city")
    const coatLength = searchParams.get("coatLength")
    const goodWithKids = searchParams.get("goodWithKids")
    const adoptionType = searchParams.get("adoptionType")
    const daysOnPlatform = searchParams.get("daysOnPlatform")
    const searchQuery = searchParams.get("search")

    // Build the SQL query with filters
    let sql = `
      SELECT 
        id, name, breed, species, age, age_category as "ageCategory", 
        gender, size, coat_length as "coatLength", 
        good_with_kids as "goodWithKids", location, city,
        days_on_platform as "daysOnPlatform", adoption_type as "adoptionType",
        image_url as "imageUrl"
      FROM pets
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    // Add filters to the query if they exist
    if (species && species !== "Any") {
      sql += ` AND species = $${paramIndex++}`
      params.push(species)
    }

    if (breed && breed !== "Any") {
      sql += ` AND breed = $${paramIndex++}`
      params.push(breed)
    }

    if (age && age !== "Any") {
      sql += ` AND age_category = $${paramIndex++}`
      params.push(age)
    }

    if (size && size !== "Any") {
      sql += ` AND size = $${paramIndex++}`
      params.push(size)
    }

    if (gender && gender !== "Any") {
      sql += ` AND gender = $${paramIndex++}`
      params.push(gender)
    }

    if (city && city !== "Any") {
      sql += ` AND city = $${paramIndex++}`
      params.push(city)
    }

    if (coatLength && coatLength !== "Any") {
      sql += ` AND coat_length = $${paramIndex++}`
      params.push(coatLength)
    }

    if (goodWithKids && goodWithKids !== "Any") {
      sql += ` AND good_with_kids = $${paramIndex++}`
      params.push(goodWithKids)
    }

    if (adoptionType && adoptionType !== "Any") {
      sql += ` AND adoption_type = $${paramIndex++}`
      params.push(adoptionType)
    }

    // Handle days on platform ranges
    if (daysOnPlatform && daysOnPlatform !== "Any") {
      if (daysOnPlatform === "1-7") {
        sql += ` AND days_on_platform BETWEEN 1 AND 7`
      } else if (daysOnPlatform === "8-30") {
        sql += ` AND days_on_platform BETWEEN 8 AND 30`
      } else if (daysOnPlatform === "31-90") {
        sql += ` AND days_on_platform BETWEEN 31 AND 90`
      } else if (daysOnPlatform === "91+") {
        sql += ` AND days_on_platform >= 91`
      }
    }

    // Add search query if it exists
    if (searchQuery) {
      sql += ` AND (
        LOWER(name) LIKE $${paramIndex} OR 
        LOWER(breed) LIKE $${paramIndex} OR 
        LOWER(species) LIKE $${paramIndex}
      )`
      params.push(`%${searchQuery.toLowerCase()}%`)
    }

    // Execute the query
    const result = await query(sql, params)

    return NextResponse.json({ pets: result.rows })
  } catch (error) {
    console.error("Error fetching pets:", error)
    return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 })
  }
}
