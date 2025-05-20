"use client"

import { useEffect, useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export type FilterValues = {
  species: string
  breed: string
  age: string
  size: string
  gender: string
  city: string
  coatLength: string
  goodWithKids: string
  adoptionType: string
  daysOnPlatform: string
}

type FilterOption = {
  label: string
  value: string
}

type FilterCategory = {
  name: string
  options: FilterOption[]
}

interface FilterSidebarProps {
  onFiltersChange: (filters: FilterValues) => void
  initialFilters?: FilterValues
}

export default function FilterSidebar({ onFiltersChange, initialFilters }: FilterSidebarProps) {
  const defaultFilters = {
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
  }

  const [filters, setFilters] = useState<FilterValues>(initialFilters || defaultFilters)
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [breedOptions, setBreedOptions] = useState<FilterOption[]>([{ label: "Any", value: "Any" }])
  const [cityOptions, setCityOptions] = useState<FilterOption[]>([{ label: "Any", value: "Any" }])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch breeds when species changes
  useEffect(() => {
    async function fetchBreeds() {
      try {
        const response = await fetch(`/api/breeds?species=${filters.species}`)
        const data = await response.json()

        if (data.breeds) {
          const options = [
            { label: "Any", value: "Any" },
            ...data.breeds.map((breed: { breed: string }) => ({
              label: breed.breed,
              value: breed.breed,
            })),
          ]
          setBreedOptions(options)
        }
      } catch (error) {
        console.error("Error fetching breeds:", error)
      }
    }

    fetchBreeds()
  }, [filters.species])

  // Fetch cities on component mount
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/cities")
        const data = await response.json()

        if (data.cities) {
          const options = [
            { label: "Any", value: "Any" },
            ...data.cities.map((city: { city: string }) => ({
              label: city.city,
              value: city.city,
            })),
          ]
          setCityOptions(options)
        }
      } catch (error) {
        console.error("Error fetching cities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
  }, [])

  // Count active filters
  useEffect(() => {
    const count = Object.entries(filters).filter(([_, value]) => value !== "Any").length
    setActiveFilterCount(count)

    // Notify parent component about filter changes
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

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
      options: cityOptions,
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
    // If changing species, reset breed to "Any"
    if (category === "species") {
      setFilters({
        ...filters,
        [category]: value,
        breed: "Any", // Reset breed when species changes
      })
    } else {
      setFilters({
        ...filters,
        [category]: value,
      })
    }
  }

  const clearAllFilters = () => {
    setFilters(defaultFilters)
  }

  if (isLoading) {
    return (
      <aside className="w-64 p-4 bg-white border-r border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded mb-2 w-20 mx-auto"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 p-4 bg-white border-r border-gray-200">
      <div className="flex justify-between items-center mb-4">
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">Active filters: {activeFilterCount}</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value !== "Any") {
                return (
                  <div key={key} className="bg-gray-100 text-xs rounded-full px-3 py-1 flex items-center">
                    {value}
                    <button
                      onClick={() => handleFilterChange(key, "Any")}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      )}

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
