"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MainNavBar } from "@/components/main-nav-bar"
import { AdminMode } from "@/components/admin-mode"
import { AdminPasswordModal } from "@/components/admin-password-modal"
import { SecretCodeInput } from "@/components/secret-code-input" // Import the SecretCodeInput component
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTimer } from "@/utils/use-timer" // Import the custom hook
import { useState } from "react"
import { toast } from "sonner"
import { categories } from "@/products/products"

export default function Shop() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 70 * 60 * 1000) // Use targetTime from local storage
  const [inventory, setInventory] = useLocalStorage<Record<string, number>>("shop-inventory", { "buk": 3 })
  const [orderedItems, setOrderedItems] = useLocalStorage<Record<string, number>>("shop-ordered-items", {})
  const [purchaseHistory, setPurchaseHistory] = useLocalStorage<
    { id: number; itemId: string; itemName: string; price: number; quantity: number; date: string; category: string; round: number }[]
  >("shop-purchase-history", [])
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const allItems = Object.values(categories).flat()

  const { timeRemaining, setTimeRemaining, currentRound } = useTimer({
    initialTargetTime: targetTime,
    timerActive,
    totalRounds: 7, // Define 7 rounds
    onTimerEnd: () => setTimerActive(false), // Stop the timer when it ends
    updateTargetTime: setTargetTime, // Update targetTime in local storage
  })

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const timerProgress = ((70 * 60 - timeRemaining) / (70 * 60)) * 100

  const handleAdminConfirm = (password: string) => {
    if (password === "n1gg4") {
      setIsAdminMode(true)
      setShowAdminModal(false)
      toast.success("Admin Mode Enabled")
    } else {
      toast.error("Invalid Password")
    }
  }

  const handleTimeUpdate = (newTime: number) => {
    setTimeRemaining(newTime) // Update timeRemaining and recalculate targetTime
  }

  return (
    <div>
      {/* Navbar */}
      <MainNavBar
        balance={parseFloat(balance.toFixed(2))} // Ensure balance is rounded to 2 decimals
        orderedItemsCount={Object.values(orderedItems).reduce((a, b) => a + b, 0)} // Updated to use orderedItems
        currentRound={currentRound} // Pass the current round to the MainNavBar
        onAdminClick={() => setShowAdminModal(true)}
      />

      {/* Admin Mode */}
      {isAdminMode && (
        <AdminMode
          balance={balance}
          setBalance={(newBalance) => setBalance(parseFloat(newBalance.toFixed(2)))} // Round balance when updating
          timeRemaining={timeRemaining}
          setTimeRemaining={handleTimeUpdate} // Allow manual updates to timeRemaining
          timerActive={timerActive}
          setTimerActive={setTimerActive}
          inventory={inventory}
          setInventory={setInventory}
          allItems={allItems}
          setIsAdminMode={setIsAdminMode}
          setOrderedItems={setOrderedItems} // Pass orderedItems setter
          setPurchaseHistory={setPurchaseHistory} // Pass purchase history setter
          setCurrentRound={() => {}} // No current round logic
          setPurchasedInRound={() => {}} // No purchased items logic
          setTargetTime={setTargetTime}
          targetTime={targetTime} // Pass targetTime
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

        {/* Inventory, Ordered Items, Balance, and Purchase History Section */}
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
              <CardTitle>Ordered Items</CardTitle>
              <CardDescription>Your ordered items</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(orderedItems).length > 0 ? (
                <ul className="space-y-2">
                  {Object.entries(orderedItems).map(([itemId, quantity]) => {
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

        {/* Purchase History Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>Review your past purchases</CardDescription>
          </CardHeader>
          <CardContent>
            {purchaseHistory.length > 0 ? (
              <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Item</th>
              <th className="border-b px-4 py-2">Quantity</th>
              <th className="border-b px-4 py-2">Price (PLN)</th>
              <th className="border-b px-4 py-2">Total (PLN)</th>
              <th className="border-b px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.slice().reverse().map((purchase) => (
                <tr key={purchase.id}>
                <td className="border-b px-4 py-2">{purchase.itemName}</td>
                <td className="border-b px-4 py-2">{purchase.quantity}</td>
                <td className="border-b px-4 py-2">{purchase.price.toFixed(2)}</td>
                <td className="border-b px-4 py-2">{(purchase.price * purchase.quantity).toFixed(2)}</td>
                <td className="border-b px-4 py-2 text-gray-500 text-sm">{new Date(purchase.date).toLocaleTimeString()}</td>
                </tr>
            ))}
          </tbody>
              </table>
            ) : (
              <p className="text-gray-500">You have no purchase history.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Password Modal */}
      <AdminPasswordModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onConfirm={handleAdminConfirm}
      />

      {/* Secret Code Input */}
      <SecretCodeInput
        inventory={inventory}
        setInventory={setInventory}
        purchaseHistory={purchaseHistory}
        setPurchaseHistory={setPurchaseHistory}
        currentRound={currentRound}
      />
    </div>
  )
}

