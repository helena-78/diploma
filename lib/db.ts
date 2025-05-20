import { Pool } from "pg"

// Create a connection pool using the provided credentials
const pool = new Pool({
  user: "postgres", 
  host: "localhost", 
  database: "diploma", 
  password: "postgres", 
  port: 5432, 
 
})

// Helper function to query the database
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}

// Function to test the database connection
export async function testConnection() {
  try {
    const res = await query("SELECT NOW()")
    console.log("Database connection successful:", res.rows[0])
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
