"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export const AllegroRedirectMessage: React.FC = () => {
  return (
    <div className="bg-blue-100 border border-blue-300 rounded-lg p-8 text-center shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800">🔗 Visit Allegro!</h2>
      <p className="text-blue-700 mt-4 text-lg">
        JEDNORAZOWA OFERTA - KUP TERAZ W SUPER NISKICH CENACH NA <strong>Allegro</strong>!
      </p>
      <Link href="/alegro" target="_blank">
        <Button className="mt-6 px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white">
          Go to Allegro
        </Button>
      </Link>
    </div>
  )
}