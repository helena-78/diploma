import { NextResponse } from "next/server"
import { Pool } from "pg"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
    const { email, password } = data

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Get user from database
    const client = await pool.connect()
    try {
      const result = await client.query(
        "SELECT id, first_name, last_name, email, password FROM users WHERE email = $1",
        [email],
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
      }

      const user = result.rows[0]

      // Compare password with hashed password in database
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
      }

      // Create JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        process.env.JWT_SECRET || "your-secret-key", // Use environment variable in production
        { expiresIn: "7d" },
      )

      // Return user data and token
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        token,
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}
