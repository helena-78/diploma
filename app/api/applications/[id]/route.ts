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

    // If status is "withdrawn", delete the application instead of updating
    if (status === "withdrawn") {
      // Verify the application belongs to the user (using applicant_id)
      const applicationResult = await query(`SELECT * FROM applications WHERE id = $1 AND applicant_id = $2`, [
        applicationId,
        user.id,
      ])

      if (applicationResult.rows.length === 0) {
        return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 404 })
      }

      // Delete the application from the database
      await query(`DELETE FROM applications WHERE id = $1`, [applicationId])

      return NextResponse.json({
        success: true,
        message: "Application withdrawn and deleted successfully",
      })
    } else {
      // For other status updates (approve/reject), verify pet ownership
      const applicationResult = await query(`SELECT * FROM applications WHERE id = $1`, [applicationId])

      if (applicationResult.rows.length === 0) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 })
      }

      const application = applicationResult.rows[0]
      console.log(`Processing status change to '${status}' for application ${applicationId}`)

      // Check if user owns the pet (for approve/reject actions)
      const petResult = await query(`SELECT owner_id FROM pets WHERE id = $1`, [application.pet_id])

      if (petResult.rows.length === 0) {
        return NextResponse.json({ error: "Pet not found" }, { status: 404 })
      }

      if (petResult.rows[0].owner_id !== user.id) {
        return NextResponse.json({ error: "You can only manage applications for your own pets" }, { status: 403 })
      }

      // Validate status values
      if (!["approved", "rejected"].includes(status)) {
        return NextResponse.json({ error: "Invalid status. Must be 'approved' or 'rejected'" }, { status: 400 })
      }

      console.log(`Updating application ${applicationId} status to '${status}'`)

      // Update the application status
      const updateResult = await query(
        `UPDATE applications 
         SET status = $1, updated_at = NOW() 
         WHERE id = $2
         RETURNING id, status`,
        [status, applicationId],
      )

      console.log(`Application updated successfully:`, updateResult.rows[0])

      return NextResponse.json({
        success: true,
        message: `Application ${status} successfully`,
        application: updateResult.rows[0],
      })
    }
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
