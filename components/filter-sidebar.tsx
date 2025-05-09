"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

type FilterOption = {
  label: string
  value: string
}

type FilterCategory = {
  name: string
  options: FilterOption[]
}

export default function FilterSidebar() {
  const [filters, setFilters] = useState({
    species: "Any",
    breed: "Any",
    age: "Any",
    size: "Any",
    gender: "Any",
    city: "Any",
    coatLength: "Any",
    goodWithKids: "Any",
    adoptionType: "Any",
    daysOnPlatform: "Any",
  })
  const dogBreeds: FilterOption[] = [
    { label: "Any", value: "Any" },
    { label: "Labrador", value: "Labrador" },
    { label: "German Shepherd", value: "German Shepherd" },
    { label: "Golden Retriever", value: "Golden Retriever" },
    { label: "Bulldog", value: "Bulldog" },
    { label: "Beagle", value: "Beagle" },
    { label: "Poodle", value: "Poodle" },
    { label: "Boxer", value: "Boxer" },
    { label: "Siberian Husky", value: "Siberian Husky" },
    { label: "Dachshund", value: "Dachshund" },
  ]

  const catBreeds: FilterOption[] = [
    { label: "Any", value: "Any" },
    { label: "Maine Coon", value: "Maine Coon" },
    { label: "Ragdoll", value: "Ragdoll" },
    { label: "Siamese", value: "Siamese" },
    { label: "British Shorthair", value: "British Shorthair" },
    { label: "Bengal", value: "Bengal" },
    { label: "Persian", value: "Persian" },
  ]

  const birdBreeds: FilterOption[] = [
    { label: "Any", value: "Any" },
    { label: "Budgerigar", value: "Budgerigar" },
    { label: "Cockatiel", value: "Cockatiel" },
    { label: "African Grey Parrot", value: "African Grey Parrot" },
    { label: "Canary", value: "Canary" },
    { label: "Parakeet", value: "Parakeet" },
  ]

  const smallAndFurryBreeds: FilterOption[] = [
    { label: "Any", value: "Any" },
    { label: "Hamster", value: "Hamster" },
    { label: "Rat", value: "Rat" },
    { label: "Rabbit", value: "Rabbit" },
    { label: "Pig", value: "Pig" },
    { label: "Chinchilla", value: "Chinchilla" },
  ]

  const reptileBreeds: FilterOption[] = [
    { label: "Any", value: "Any" },
    { label: "Iguana", value: "Iguana" },
    { label: "Chameleon", value: "Chameleon" },
    { label: "Tortoise", value: "Tortoise" },
  ]

  const otherBreeds: FilterOption[] = [{ label: "Any", value: "Any" }]

  const anyBreeds: FilterOption[] = [
    { label: "Any", value: "Any" },
    ...dogBreeds.slice(1),
    ...catBreeds.slice(1),
    ...birdBreeds.slice(1),
    ...smallAndFurryBreeds.slice(1),
    ...reptileBreeds.slice(1),
  ]
  // State to track current breed options
  const [breedOptions, setBreedOptions] = useState<FilterOption[]>(anyBreeds)

  useEffect(() => {
    let newBreedOptions: FilterOption[]

    switch (filters.species) {
      case "Dog":
        newBreedOptions = dogBreeds
        break
      case "Cat":
        newBreedOptions = catBreeds
        break
      case "Bird":
        newBreedOptions = birdBreeds
        break
      case "Small & Furry":
        newBreedOptions = smallAndFurryBreeds
        break
      case "Reptile":
        newBreedOptions = reptileBreeds
        break
      default:
        newBreedOptions = anyBreeds
    }

    setBreedOptions(newBreedOptions)

    // Reset breed to "Any" if current selection isn't in the new options
    if (!newBreedOptions.some((breed) => breed.value === filters.breed)) {
      setFilters((prev) => ({ ...prev, breed: "Any" }))
    }
  }, [filters.species])

  const filterCategories: FilterCategory[] = [
    {
      name: "SPECIES",
      options: [
        { label: "Any", value: "Any" },
        { label: "Dog", value: "Dog" },
        { label: "Cat", value: "Cat" },
        { label: "Bird", value: "Bird" },
        { label: "Small & Furry", value: "Small & Furry" },
        { label: "Reptile", value: "Reptile" },
        { label: "Other", value: "Other" },
      ],
    },
    {
      name: "BREED",
      options: breedOptions,
    },
    {
      name: "CITY",
      options: [
        { label: "Any", value: "Any" },
        { label: "New York, NY", value: "New York, NY" },
        { label: "Los Angeles, CA", value: "Los Angeles, CA" },
        { label: "Chicago, IL", value: "Chicago, IL" },
        { label: "Houston, TX", value: "Houston, TX" },
        { label: "Phoenix, AZ", value: "Phoenix, AZ" },
        { label: "Philadelphia, PA", value: "Philadelphia, PA" },
        { label: "San Antonio, TX", value: "San Antonio, TX" },
        { label: "San Diego, CA", value: "San Diego, CA" },
        { label: "Dallas, TX", value: "Dallas, TX" },
      ],
    },
    {
      name: "AGE",
      options: [
        { label: "Any", value: "Any" },
        { label: "Puppy", value: "Puppy" },
        { label: "Young", value: "Young" },
        { label: "Adult", value: "Adult" },
        { label: "Senior", value: "Senior" },
      ],
    },
    {
      name: "SIZE",
      options: [
        { label: "Any", value: "Any" },
        { label: "Small", value: "Small" },
        { label: "Medium", value: "Medium" },
        { label: "Large", value: "Large" },
        { label: "Extra Large", value: "Extra Large" },
      ],
    },
    {
      name: "GENDER",
      options: [
        { label: "Any", value: "Any" },
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
      ],
    },
    {
      name: "COAT LENGTH",
      options: [
        { label: "Any", value: "Any" },
        { label: "Short", value: "Short" },
        { label: "Medium", value: "Medium" },
        { label: "Long", value: "Long" },
        { label: "Hairless", value: "Hairless" },
      ],
    },
    {
      name: "GOOD WITH KIDS",
      options: [
        { label: "Any", value: "Any" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "ADOPTION TYPE",
      options: [
        { label: "Any", value: "Any" },
        { label: "Temporary", value: "Temporary" },
        { label: "Permanent", value: "Permanent" },
      ],
    },
    {
      name: "DAYS ON PLATFORM",
      options: [
        { label: "Any", value: "Any" },
        { label: "1-7 days", value: "1-7" },
        { label: "8-30 days", value: "8-30" },
        { label: "31-90 days", value: "31-90" },
        { label: "91+ days", value: "91+" },
      ],
    },
  ]

  const handleFilterChange = (category: string, value: string) => {
    setFilters({
      ...filters,
      [category]: value,
    })
  }

  return (
    <aside className="w-64 p-4 bg-white border-r border-gray-200">
      <div className="space-y-6">
        {filterCategories.map((category) => (
          <div key={category.name} className="space-y-2">
            <h3 className="text-xs font-medium text-center">{category.name}</h3>
            <div className="relative">
              <select
                className="w-full appearance-none rounded border border-gray-300 bg-white py-2 px-3 pr-8 text-sm"
                value={filters[category.name.toLowerCase().replace(/\s+/g, "") as keyof typeof filters]}
                onChange={(e) => handleFilterChange(category.name.toLowerCase().replace(/\s+/g, ""), e.target.value)}
              >
                {category.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
