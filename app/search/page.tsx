import { cookies } from "next/headers"
import SearchPageClient from "./search-client"

export default async function SearchPage() {
  // Get user data from cookies
  const cookieStore = await cookies()
  const userDataCookie = cookieStore.get("user-data")

  let user = null
  if (userDataCookie) {
    try {
      user = JSON.parse(userDataCookie.value)
    } catch (error) {
      console.error("Error parsing user data:", error)
    }
  }

  return <SearchPageClient user={user} />
}
