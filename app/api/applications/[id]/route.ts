import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = params.id
    const { status } = await request.json()

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

    // Verify the application belongs to the user
    const applicationResult = await query(`SELECT * FROM adoption_applications WHERE id = $1 AND user_id = $2`, [
      applicationId,
      user.id,
    ])

    if (applicationResult.rows.length === 0) {
      return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 404 })
    }

    // Update the application status
    await query(
      `UPDATE adoption_applications 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2`,
      [status, applicationId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
