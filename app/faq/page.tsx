import type { Metadata } from "next"
import FAQClient from "./faq-client"

export const metadata: Metadata = {
  title: "FAQ - Pet Adoption Platform",
  description: "Frequently asked questions about pet adoption and our platform",
}

export default function FAQPage() {
  return <FAQClient />
}
