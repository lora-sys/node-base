import * as React from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CARD_CLASSES, CARD_HEADER_CLASSES, CARD_TITLE_CLASSES, CARD_DESCRIPTION_CLASSES, LOGO_SIZE } from "../constants"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
  showLogo?: boolean
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  showLogo = true,
}: AuthCardProps) {
  return (
    <Card className={CARD_CLASSES}>
      <CardHeader className={CARD_HEADER_CLASSES}>
        {showLogo && (
          <div className="mx-auto">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className="mx-auto"
              priority
            />
          </div>
        )}
        <CardTitle className={CARD_TITLE_CLASSES}>{title}</CardTitle>
        <CardDescription className={CARD_DESCRIPTION_CLASSES}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col gap-4">{footer}</CardFooter>
    </Card>
  )
}