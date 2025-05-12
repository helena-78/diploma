"use client"

import { useState } from "react"

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<"ENG" | "UKR">("ENG")

  return (
    <div className="flex gap-2 text-sm">
      <button className={language === "ENG" ? "font-medium" : "text-gray-500"} onClick={() => setLanguage("ENG")}>
        ENG
      </button>
      <span className="text-gray-300">|</span>
      <button className={language === "UKR" ? "font-medium" : "text-gray-500"} onClick={() => setLanguage("UKR")}>
        UKR
      </button>
    </div>
  )
}
