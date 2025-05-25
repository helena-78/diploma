import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = params.id
    console.log(`Processing PATCH request for application: ${applicationId}`)

    // Parse request body
    let requestBody
    try {
      requestBody = await request.json()
      console.log("Request body:", requestBody)
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { status } = requestBody

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Get user from cookies
    const cookieStore = await cookies()
    const userDataCookie = cookieStore.get("user-data")

    if (!userDataCookie) {
      console.log("No user cookie found")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    let user
    try {
      user = JSON.parse(userDataCookie.value)
      console.log("User from cookie:", { id: user.id, email: user.email })
    } catch (error) {
      console.error("Error parsing user data:", error)
      return NextResponse.json({ error: "Invalid user data" }, { status: 401 })
    }

    // If status is "withdrawn", delete the application instead of updating
    if (status === "withdrawn") {
      console.log("Processing withdrawal request")

      // Verify the application belongs to the user (using applicant_id)
      const applicationResult = await query(`SELECT * FROM applications WHERE id = $1 AND applicant_id = $2`, [
        applicationId,
        user.id,
      ])

      if (applicationResult.rows.length === 0) {
        console.log("Application not found or unauthorized for withdrawal")
        return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 404 })
      }

      // Delete the application from the database
      await query(`DELETE FROM applications WHERE id = $1`, [applicationId])
      console.log("Application deleted successfully")

      return NextResponse.json({
        success: true,
        message: "Application withdrawn and deleted successfully",
      })
    } else {
      console.log(`Processing status change to '${status}'`)

      // For other status updates (approve/reject), verify pet ownership
      const applicationResult = await query(`SELECT * FROM applications WHERE id = $1`, [applicationId])

      if (applicationResult.rows.length === 0) {
        console.log("Application not found")
        return NextResponse.json({ error: "Application not found" }, { status: 404 })
      }

      const application = applicationResult.rows[0]
      console.log("Found application:", {
        id: application.id,
        pet_id: application.pet_id,
        current_status: application.status,
      })

      // Check if user owns the pet (for approve/reject actions)
      const petResult = await query(`SELECT owner_id FROM pets WHERE id = $1`, [application.pet_id])

      if (petResult.rows.length === 0) {
        console.log("Pet not found")
        return NextResponse.json({ error: "Pet not found" }, { status: 404 })
      }

      const pet = petResult.rows[0]
      console.log("Pet owner check:", { pet_owner: pet.owner_id, current_user: user.id })

      if (pet.owner_id !== user.id) {
        console.log("User does not own the pet")
        return NextResponse.json({ error: "You can only manage applications for your own pets" }, { status: 403 })
      }

      // Validate status values
      if (!["approved", "rejected"].includes(status)) {
        console.log("Invalid status value:", status)
        return NextResponse.json({ error: "Invalid status. Must be 'approved' or 'rejected'" }, { status: 400 })
      }

      console.log(`Updating application ${applicationId} status to '${status}'`)

      // Update the application status
      const updateResult = await query(
        `UPDATE applications 
         SET status = $1, updated_at = NOW() 
         WHERE id = $2
         RETURNING id, status, updated_at`,
        [status, applicationId],
      )

      if (updateResult.rows.length === 0) {
        console.log("No rows updated")
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
      }

      console.log(`Application updated successfully:`, updateResult.rows[0])

      return NextResponse.json({
        success: true,
        message: `Application ${status} successfully`,
        application: updateResult.rows[0],
      })
    }
  } catch (error) {
    const err = error as Error
    console.error("Error in PATCH /api/applications/[id]:", err)
    console.error("Error stack:", err.stack)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: err.message,
      },
      { status: 500 },
    )
  }
}
