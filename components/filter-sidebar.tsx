"use client"

import { useState } from "react"
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
    type: "Any",
    breed: "Any",
    age: "Any",
    size: "Any",
    gender: "Any",
    coatLength: "Any",
    goodWithKids: "Any",
    adoptionType: "Any",
    daysOnPlatform: "Any",
  })

  const filterCategories: FilterCategory[] = [
    {
      name: "BREED",
      options: [
        { label: "Any", value: "Any" },
        { label: "Labrador", value: "Labrador" },
        { label: "German Shepherd", value: "German Shepherd" },
        { label: "Golden Retriever", value: "Golden Retriever" },
        { label: "Bulldog", value: "Bulldog" },
        { label: "Beagle", value: "Beagle" },
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
