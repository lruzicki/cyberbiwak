"use client"

import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { categories } from "@/products/products"
import { useState } from "react"

interface SecretCodeInputProps {
  inventory: Record<string, number>
  setInventory: (inventory: Record<string, number>) => void
  purchaseHistory: Array<{
    id: number
    itemId: string
    itemName: string
    price: number
    quantity: number
    date: string
    category: string
    round: number
  }>
  setPurchaseHistory: (history: Array<any>) => void
  currentRound: number
  savedCodes: string[] // List of already used codes
  setSavedCodes: (codes: string[]) => void // Function to update saved codes
}

export const SecretCodeInput: React.FC<SecretCodeInputProps> = ({
  inventory,
  setInventory,
  purchaseHistory,
  setPurchaseHistory,
  currentRound,
  savedCodes,
  setSavedCodes,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.secretCode.value

    try {
      // Check if the code has already been used
      if (savedCodes.includes(input)) {
        toast.error("Code Already Used", {
          description: "This code has already been redeemed.",
        })
        return
      }

      // Split by dash
      const parts = input.split(/[-\s]+/)

      // Convert all parts except the last one from ASCII to characters
      let resourceName = ""
      for (let i = 0; i < parts.length - 2; i++) {
        resourceName += String.fromCharCode(Number.parseInt(parts[i]))
      }

      // Convert the last part from hex to decimal
      const quantity = Number.parseInt(parts[parts.length - 2], 16)
      
      const checker = quantity * currentRound + quantity % currentRound

      if (Number.parseInt(parts[parts.length - 1]) !== checker) {
        toast.error("Invalid Code", {
          description: "Checksum mismatch. Please try again.",
        })
        return
      }
      
      // Convert to lowercase for comparison
      resourceName = resourceName.toLowerCase()

      // Check if the resource exists
      let resourceFound = false

      for (const category of Object.values(categories)) {
        for (const item of category) {
          if (item.id === resourceName) {
            // Add the quantity to inventory
            setInventory({
              ...inventory,
              [item.id]: (inventory[item.id] || 0) + quantity,
            })

            // Add to purchase history
            setPurchaseHistory([
              ...purchaseHistory,
              {
                id: Date.now(),
                itemId: item.id,
                itemName: item.name,
                price: 0, // Free because it's a code
                quantity: quantity,
                date: new Date().toISOString(),
                category: item.category,
                round: currentRound,
              },
            ])

            resourceFound = true

            // Mark the code as used
            const updatedCodes = [...savedCodes, input]
            setSavedCodes(updatedCodes)
            localStorage.setItem("used-secret-codes", JSON.stringify(updatedCodes))

            // Show success toast
            toast.success("Code Redeemed!", {
              description: `Added ${quantity} ${item.name} to your inventory.`,
            })

            // Clear the input
            e.currentTarget.reset()
            break
          }
        }
        if (resourceFound) break
      }

      if (!resourceFound) {
        toast.error("Invalid Code", {
          description: "The resource code you entered is not valid.",
        })
      }
    } catch (error) {
      toast.error("Invalid Format", {
        description: "Please enter a valid ASCII code format.",
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-4 right-4 z-40"
    >
      <Input
        name="secretCode"
        placeholder="Enter secret code..."
        className="w-64 bg-yellow-300 border-yellow-500 placeholder:text-yellow-800 text-yellow-900"
      />
    </form>
  )
}