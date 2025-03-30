"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Play, Pause } from "lucide-react"
import { useState } from "react"

interface AdminModeProps {
  balance: number
  setBalance: (balance: number) => void
  timeRemaining: number
  setTimeRemaining: (time: number) => void
  timerActive: boolean
  setTimerActive: (active: boolean) => void
  inventory: Record<string, number>
  setInventory: (inventory: Record<string, number>) => void
  allItems: Array<{ id: string; name: string }>
  setIsAdminMode: (isAdmin: boolean) => void
  setOrderedItems: (cart: Record<string, number>) => void
  setPurchaseHistory: (history: Array<any>) => void
  setCurrentRound: (round: number) => void
  setPurchasedInRound: (purchases: Record<number, Record<string, number>>) => void
  targetTime: number
  setTargetTime: (time: number) => void
}

export const AdminMode: React.FC<AdminModeProps> = ({
  balance,
  setBalance,
  timeRemaining,
  setTimeRemaining,
  timerActive,
  setTimerActive,
  inventory,
  setInventory,
  allItems,
  setIsAdminMode,
  setOrderedItems,
  setPurchaseHistory,
  setCurrentRound,
  setPurchasedInRound,
  targetTime,
  setTargetTime,
}) => {
  return (
    <div className="p-4 border rounded-md bg-gray-100 mb-8">
      <h3 className="text-lg font-semibold mb-4">Admin Mode</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Edit Balance */}
        <div>
          <label className="block text-sm font-medium mb-1">Balance</label>
          <Input
            type="number"
            value={balance}
            onChange={(e) => setBalance(parseFloat(Number(e.target.value).toFixed(2)))}
          />
        </div>

        {/* Edit Time */}
        <div>
          <label className="block text-sm font-medium mb-1">Time Remaining (seconds)</label>
          <Input
            type="number"
            value={timeRemaining}
            onChange={(e) => {
              setTimeRemaining(Number(e.target.value))
              setTargetTime(Date.now() + Number(e.target.value) * 1000)
            }}
          />
        </div>

        {/* Edit Inventory */}
        <div>
          <label className="block text-sm font-medium mb-1">Inventory</label>
          <select
            onChange={(e) => {
              const itemId = e.target.value
              const newQuantity = prompt(`Enter new quantity for ${itemId}:`, String(inventory[itemId] || 0))
              if (newQuantity !== null) {
                setInventory({
                  ...inventory,
                  [itemId]: Number(newQuantity),
                })
              }
            }}
          >
            <option value="">Select Item</option>
            {allItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({inventory[item.id] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="mt-4 flex items-center justify-between gap-4">
        {/* Start/Pause Button */}
        {!timerActive ? (
          <Button
            onClick={() => {
              setTimerActive(true)
              toast.success("Game Started", {
                description: "The timer has been started.",
              })
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" /> Start
          </Button>
        ) : (
          <Button
            onClick={() => {
              setTimerActive(false)
              toast.info("Game Paused", {
                description: "The timer has been paused.",
              })
            }}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <Pause className="h-4 w-4 mr-2" /> Pause
          </Button>
        )}

        {/* Clear Local Storage Button */}
        <Button
          variant="destructive"
          onClick={() => {
            if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
              setTimerActive(false)
              localStorage.clear()
              setBalance(10000) // Reset balance
              setInventory({}) // Reset inventory
              setOrderedItems({}) // Reset cart
              setPurchaseHistory([]) // Reset purchase history
              setTimeRemaining(70 * 60) // Reset timer
              setCurrentRound(0) // Reset round
              setPurchasedInRound({}) // Reset purchased items
              setTargetTime(Date.now() + 70 * 60 * 1000) // Reset target time
              toast.success("All data has been cleared.")
            }
          }}
        >
          Clear All Data
        </Button>

        {/* Exit Admin Mode Button */}
        <Button
          variant="outline"
          onClick={() => {
            setIsAdminMode(false)
            toast.info("Admin Mode Disabled")
          }}
          className="ml-auto"
        >
          Exit Admin Mode
        </Button>
      </div>
    </div>
  )
}