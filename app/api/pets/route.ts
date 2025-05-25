import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function GET(request: NextRequest) {
  try {
    // Get filter parameters from the URL
    const searchParams = request.nextUrl.searchParams
    const species = searchParams.get("species") || "Any"
    const breed = searchParams.get("breed") || "Any"
    const age = searchParams.get("age") || "Any"
    const size = searchParams.get("size") || "Any"
    const gender = searchParams.get("gender") || "Any"
    const city = searchParams.get("city") || "Any"
    const coatLength = searchParams.get("coatLength") || "Any"
    const goodWithKids = searchParams.get("goodWithKids") || "Any"
    const adoptionType = searchParams.get("adoptionType") || "Any"
    const daysOnPlatform = searchParams.get("daysOnPlatform") || "Any"
    const searchQuery = searchParams.get("search") || ""

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

export async function POST(request: NextRequest) {
  try {
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

    // Parse form data
    const formData = await request.formData()

    // Extract form fields
    const name = formData.get("name") as string
    const species = formData.get("species") as string
    const breed = formData.get("breed") as string
    const age = formData.get("age") as string
    const ageCategory = formData.get("ageCategory") as string
    const gender = formData.get("gender") as string
    const size = formData.get("size") as string
    const coatLength = formData.get("coatLength") as string
    const goodWithKids = formData.get("goodWithKids") as string
    const location = formData.get("location") as string
    const city = formData.get("city") as string
    const adoptionType = formData.get("adoptionType") as string
    const description = formData.get("description") as string
    const imageFile = formData.get("image") as File

    // Validate required fields
    if (
      !name ||
      !species ||
      !breed ||
      !age ||
      !ageCategory ||
      !gender ||
      !size ||
      !coatLength ||
      !goodWithKids ||
      !location ||
      !city ||
      !adoptionType
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let imageUrl = "/placeholder.svg?height=400&width=600&query=cute pet"

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      try {
        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 8)
        const fileExtension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg"
        const fileName = `pet-${timestamp}-${randomString}.${fileExtension}`

        // Convert file to buffer
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Ensure uploads directory exists
        const uploadDir = join(process.cwd(), "public", "uploads")

        // Create directory if it doesn't exist
        try {
          await import("fs").then((fs) => fs.promises.mkdir(uploadDir, { recursive: true }))
        } catch (mkdirError) {
          console.log("Upload directory already exists or created")
        }

        // Save file to uploads directory
        const filePath = join(uploadDir, fileName)
        await writeFile(filePath, buffer)

        // Set the image URL path (this will be stored in the database)
        imageUrl = `/uploads/${fileName}`

        console.log(`Image saved successfully: ${imageUrl}`)
      } catch (imageError) {
        console.error("Error processing image:", imageError)
        // Continue with placeholder image if image processing fails
        console.log("Continuing with placeholder image due to upload error")
      }
    }

    let passportPath = null

    // Handle PDF passport upload if provided
    const passportFile = formData.get("passport") as File
    if (passportFile && passportFile.size > 0) {
      try {
        // Generate unique filename for PDF
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 8)
        const fileName = `passport-${timestamp}-${randomString}.pdf`

        // Convert file to buffer
        const bytes = await passportFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Ensure documents directory exists
        const documentsDir = join(process.cwd(), "public", "documents")

        // Create directory if it doesn't exist
        try {
          await import("fs").then((fs) => fs.promises.mkdir(documentsDir, { recursive: true }))
        } catch (mkdirError) {
          console.log("Documents directory already exists or created")
        }

        // Save file to documents directory
        const filePath = join(documentsDir, fileName)
        await writeFile(filePath, buffer)

        // Set the passport path (this will be stored in the database)
        passportPath = `/documents/${fileName}`

        console.log(`PDF passport saved successfully: ${passportPath}`)
      } catch (pdfError) {
        console.error("Error processing PDF passport:", pdfError)
        // Continue without passport if PDF processing fails
        console.log("Continuing without passport due to upload error")
      }
    }

    // Insert the new pet into the database
    const result = await query(
      `INSERT INTO pets (
    name, species, breed, age, age_category, gender, size, coat_length, 
    good_with_kids, location, city, adoption_type, description, image_url, 
    passport_path, owner_id, created_at, days_on_platform
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), 0)
  RETURNING id`,
      [
        name,
        species,
        breed,
        age,
        ageCategory,
        gender,
        size,
        coatLength,
        goodWithKids,
        location,
        city,
        adoptionType,
        description || "",
        imageUrl,
        passportPath, // Add passport path here
        user.id,
      ],
    )

    const petId = result.rows[0].id

    return NextResponse.json({
      success: true,
      petId,
      imageUrl,
      passportPath,
      message: "Pet listing created successfully",
    })
  } catch (error) {
    console.error("Error creating pet listing:", error)
    return NextResponse.json({ error: "Failed to create pet listing" }, { status: 500 })
  }
}
