import { NextResponse } from "next/server"
import { Pool } from "pg"
import bcrypt from "bcrypt"

const pool = new Pool({
  user: "postgres", 
  host: "localhost", 
  database: "diploma", 
  password: "postgres", 
  port: 5432, 
})

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(data.password, saltRounds)

    // Create user in database
    const client = await pool.connect()

    try {
      // Begin transaction
      await client.query("BEGIN")

      // Insert basic user information
      const userResult = await client.query(
        `INSERT INTO users (
          first_name, 
          last_name, 
          email, 
          password, 
          city, 
          gender, 
          birth_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          data.firstName,
          data.lastName,
          data.email,
          hashedPassword,
          data.city,
          data.gender,
          `${data.birthYear}-${data.birthMonth}-${data.birthDate}`, // Format as YYYY-MM-DD
        ],
      )

      const userId = userResult.rows[0].id

      // Insert pet preferences
      await client.query(
        `INSERT INTO user_preferences (
          user_id,
          has_pet_experience,
          has_allergies,
          living_space,
          pet_spending,
          time_commitment
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          userId,
          data.hasPetExperience === "yes",
          data.hasAllergies === "yes",
          data.livingSpace,
          data.petSpending,
          data.timeCommitment,
        ],
      )

      // Commit transaction
      await client.query("COMMIT")

      return NextResponse.json({ success: true, userId })
    } catch (error) {
      // Rollback in case of error
      await client.query("ROLLBACK")
      console.error("Database error:", error)
      return NextResponse.json({ success: false, message: "Database error occurred" }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 })
  }
}
