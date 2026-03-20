"use client"

import { useState } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSignOut = async () => {
    setIsPending(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login")
        },
        onError: () => {
          setIsPending(false)
        },
      },
    })
  }

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      disabled={isPending}
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  )
}