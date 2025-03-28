"use client"

import { Toaster as SonnerToaster } from "sonner"

export function SonnerProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(255, 255, 255, 0.8)", // Solid black background with slight transparency
          color: "#000000", 
          border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle white border
          borderRadius: "8px", // Optional: Rounded corners
          padding: "12px", // Optional: Add padding for better spacing
        },
      }}
    />
  )
}

