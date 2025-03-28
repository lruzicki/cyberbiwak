"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MainNavBar } from "@/components/main-nav-bar"
import { AdminMode } from "@/components/admin-mode"
import { AdminPasswordModal } from "@/components/admin-password-modal"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { categories } from "@/products/categories"

export default function Shop() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)
  const [timeRemaining, setTimeRemaining] = useLocalStorage("shop-time-remaining", 70 * 60)
  const [currentRound, setCurrentRound] = useLocalStorage("shop-current-round", 1)
  const [inventory, setInventory] = useLocalStorage<Record<string, number>>("shop-inventory", {})
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const allItems = Object.values(categories).flat()

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const timerProgress = ((70 * 60 - timeRemaining) / (70 * 60)) * 100

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timerActive && timeRemaining === 0) {
      setTimerActive(false)
      toast.error("Game Over!", {
        description: "The 70-minute countdown has ended.",
      })
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timeRemaining])

  const handleAdminConfirm = (password: string) => {
    if (password === "buk3") {
      setIsAdminMode(true)
      setShowAdminModal(false)
      toast.success("Admin Mode Enabled")
    } else {
      toast.error("Invalid Password")
    }
  }

  return (
    <div>
      {/* Navbar */}
      <MainNavBar
        balance={parseFloat(balance.toFixed(2))} // Ensure balance is rounded to 2 decimals
        cartItemsCount={Object.values(inventory).reduce((a, b) => a + b, 0)}
        onAdminClick={() => setShowAdminModal(true)}
      />

      {/* Admin Mode */}
      {isAdminMode && (
        <AdminMode
          balance={balance}
          setBalance={(newBalance) => setBalance(parseFloat(newBalance.toFixed(2)))} // Round balance when updating
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
          timerActive={timerActive}
          setTimerActive={setTimerActive}
          inventory={inventory}
          setInventory={setInventory}
          allItems={allItems}
          setIsAdminMode={setIsAdminMode}
          setCartItems={() => {}} // No cart logic
          setPurchaseHistory={() => {}} // No purchase history logic
          setCurrentRound={setCurrentRound}
          setPurchasedInRound={() => {}} // No purchased items logic
        />
      )}

      <div className="container mx-auto py-8 px-4">
        {/* Timer Section */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Game Timer</span>
              <div className="text-2xl font-mono">{formatTime(timeRemaining)}</div>
            </CardTitle>
            <CardDescription>Current Round: {currentRound} of 7</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Progress value={timerProgress} className="h-2 mb-4" />
          </CardContent>
        </Card>

        {/* Inventory, Ordered Items, and Balance Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Inventory Section */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Your current items</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(inventory).length > 0 ? (
                <ul className="space-y-2">
                  {Object.entries(inventory).map(([itemId, quantity]) => {
                    const product = allItems.find((item) => item.id === itemId) // Find the product by ID
                    return (
                      <li key={itemId} className="flex justify-between">
                        <span>{product ? product.name : itemId}</span> {/* Use product name if found */}
                        <Badge>{quantity}</Badge>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-gray-500">Your inventory is empty.</p>
              )}
            </CardContent>
          </Card>

          {/* Ordered Items Section */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Ordered Items</CardTitle> {/* Updated title */}
              <CardDescription>Your ordered items</CardDescription> {/* Updated description */}
            </CardHeader>
            <CardContent>
              {Object.keys(inventory).length > 0 && Object.values(inventory).some((quantity) => quantity > 0) ? (
                <ul className="space-y-2">
                  {Object.entries(inventory)
                    .filter(([_, quantity]) => quantity > 0) // Only show items with quantity > 0
                    .map(([itemId, quantity]) => {
                      const product = allItems.find((item) => item.id === itemId) // Find the product by ID
                      return (
                        <li key={itemId} className="flex justify-between">
                          <span>{product ? product.name : itemId}</span> {/* Use product name if found */}
                          <Badge>{quantity}</Badge>
                        </li>
                      )
                    })}
                </ul>
              ) : (
                <p className="text-gray-500">You have no ordered items.</p>
              )}
            </CardContent>
          </Card>

          {/* Balance Section */}
          <Card className="flex-1 max-w-md">
            <CardHeader>
              <CardTitle>Your Balance</CardTitle>
              <CardDescription>Manage your balance here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-2xl font-bold">{balance.toFixed(2)} PLN</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Password Modal */}
      <AdminPasswordModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onConfirm={handleAdminConfirm}
      />
    </div>
  )
}

