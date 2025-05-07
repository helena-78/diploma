import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SignUpButton() {
  return (
    <Button variant="outline" asChild>
      <Link href="/signup">Sign Up</Link>
    </Button>
  )
}
