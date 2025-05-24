import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import CreatePetForm from "./create-pet-form"

export default async function CreatePetPage() {
  // Check if user is authenticated
  const cookieStore = await cookies()
  const userDataCookie = cookieStore.get("user-data")

  if (!userDataCookie) {
    redirect("/auth/signin")
  }

  let user
  try {
    user = JSON.parse(userDataCookie.value)
  } catch (error) {
    console.error("Error parsing user data:", error)
    redirect("/auth/signin")
  }

  try {
    // Fetch existing species from database
    const speciesResult = await query("SELECT DISTINCT species FROM pets WHERE species IS NOT NULL ORDER BY species")
    const existingSpecies = speciesResult.rows.map((row) => row.species)

    // Define default species options
    const defaultSpecies = ["Dog", "Cat", "Bird", "Small&Furry", "Reptile", "Other"]

    // Combine and deduplicate species options
    const allSpeciesSet = new Set([...defaultSpecies, ...existingSpecies])
    const allSpecies = Array.from(allSpeciesSet).sort()

    // Fetch breeds for reference (optional)
    const breedsResult = await query("SELECT DISTINCT breed FROM pets WHERE breed IS NOT NULL ORDER BY breed")
    const breeds = breedsResult.rows.map((row) => row.breed)

    // Fetch cities for reference (optional)
    const citiesResult = await query("SELECT DISTINCT city FROM pets WHERE city IS NOT NULL ORDER BY city")
    const cities = citiesResult.rows.map((row) => row.city)

    return <CreatePetForm user={user} species={allSpecies} breeds={breeds} cities={cities} />
  } catch (error) {
    console.error("Error fetching form data:", error)

    // Fallback to default options if database query fails
    const defaultSpecies = ["Dog", "Cat", "Bird", "Small&Furry", "Reptile", "Other"]
    const defaultBreeds: string[] = []
    const defaultCities: string[] = []

    return <CreatePetForm user={user} species={defaultSpecies} breeds={defaultBreeds} cities={defaultCities} />
  }
}
