"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Axe, Wheat, TreesIcon as Tree, Map, Play, Pause, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { MainNavBar } from "@/components/main-nav-bar"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { categories } from "@/products/categories"
import { roundData, Round } from "@/products/roundData"

// Use the imported data
export default function Shop() {
  const router = useRouter()
  const [balance, setBalance] = useLocalStorage("shop-balance", 5000)
  const [inventory, setInventory] = useLocalStorage<Record<string, number>>("shop-inventory", {})
  const [cartItems, setCartItems] = useLocalStorage<Record<string, number>>("shop-cart", {})
  const [purchaseHistory, setPurchaseHistory] = useLocalStorage<Array<{
    id: number
    itemId: string
    itemName: string
    price: number
    quantity: number
    date: string
    category: string
    round: number
  }>>("purchase-history", [])

  // Timer state
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)
  const [timeRemaining, setTimeRemaining] = useLocalStorage("shop-time-remaining", 70 * 60) // Default to 70 minutes
  const [currentRound, setCurrentRound] = useLocalStorage("shop-current-round", 1)
  const [rounds, setRounds] = useState<Round[]>([])

  // Add a password state and modal state for reset protection
  const [resetPassword, setResetPassword] = useState("")
  const [showResetModal, setShowResetModal] = useState(false)

  // Admin mode state
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [showAdminModal, setShowAdminModal] = useState(false)

  // Flatten all items for easier access
  const allItems = Object.values(categories).flat()

  // Track purchased quantities per round
  const [purchasedInRound, setPurchasedInRound] = useLocalStorage<Record<number, Record<string, number>>>("purchased-in-round", {})

  // Reset purchased quantities when starting a new game
  const startTimer = () => {
    if (!timerActive) {
      setTimerActive(true)
      if (timeRemaining === 70 * 60) {
        setTimeRemaining(70 * 60) // Reset to 70 minutes only if not already started
        setCurrentRound(1)
        setPurchaseHistory([])
        setPurchasedInRound({})
      }

      toast.success("Game Started!", {
        description: "The 70-minute countdown has begun. Good luck!",
      })
    }
  }

  // Update the resetTimer function to require a password
  const resetTimer = () => {
    setShowResetModal(true)
  }

  // Add a confirmReset function that checks the password
  const confirmReset = () => {
    if (resetPassword === "admin123") {
      setTimerActive(false)
      setTimeRemaining(70 * 60)
      setCurrentRound(1)
      toast.success("Game Reset", {
        description: "The timer has been reset to 70 minutes.",
      })
      setShowResetModal(false)
      setResetPassword("")
    } else {
      toast.error("Invalid Password", {
        description: "The password you entered is incorrect.",
      })
    }
  }

  // Initialize rounds state with the data
  useEffect(() => {
    setRounds(roundData)
  }, [])

  // Timer functions
  const pauseTimer = () => {
    setTimerActive(false)
    toast.info("Game Paused", {
      description: "The timer has been paused.",
    })
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Calculate round based on time remaining
  const calculateRound = (seconds: number) => {
    const totalMinutes = 70
    const minutesElapsed = totalMinutes - Math.ceil(seconds / 60)

    // 7 rounds over 70 minutes, approximately 10 minutes per round
    if (minutesElapsed < 10) return 1
    if (minutesElapsed < 20) return 2
    if (minutesElapsed < 30) return 3
    if (minutesElapsed < 40) return 4
    if (minutesElapsed < 50) return 5
    if (minutesElapsed < 60) return 6
    return 7
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1

          // Check if we need to update the round
          const newRound = calculateRound(newTime)
          if (newRound !== currentRound) {
            setCurrentRound(newRound)
            toast.info(`Round ${newRound} Started!`, {
              description: "Resource limits and prices have been updated.",
            })
          }

          return newTime
        })
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
  }, [timerActive, timeRemaining, currentRound])

  // Update the buyItem and sellItem functions to use the same price from the current round
  const buyItem = (itemId: string, price: number) => {
    if (!timerActive) {
      toast.error("Game not started", {
        description: "Please start the game first.",
      })
      return
    }

    // Get current round data
    const currentRoundData = rounds.find((r) => r.number === currentRound)
    if (!currentRoundData) return

    // Check if item is available in this round
    const maxPurchases = currentRoundData.maxPurchases[itemId] || 0
    const alreadyPurchased = purchasedInRound[currentRound]?.[itemId] || 0

    if (alreadyPurchased >= maxPurchases) {
      toast.error("Purchase limit reached", {
        description: `You've reached the maximum purchases for this item in round ${currentRound}.`,
      })
      return
    }

    if (balance >= price) {
      // Find the item
      const item = allItems.find((item) => item.id === itemId)
      if (!item) return

      // Update balance
      setBalance(balance - price)

      // Update inventory
      setInventory({
        ...inventory,
        [itemId]: (inventory[itemId] || 0) + 1,
      })

      // Update purchased in round
      const roundPurchases = purchasedInRound[currentRound] || {}
      setPurchasedInRound({
        ...purchasedInRound,
        [currentRound]: {
          ...roundPurchases,
          [itemId]: (roundPurchases[itemId] || 0) + 1,
        },
      })

      // Add to purchase history
      setPurchaseHistory([
        ...purchaseHistory,
        {
          id: Date.now(),
          itemId,
          itemName: item.name,
          price,
          quantity: 1,
          date: new Date().toISOString(),
          category: item.category,
          round: currentRound,
        },
      ])
    } else {
      toast.error("Insufficient funds", {
        description: "You don't have enough money for this purchase.",
      })
    }
  }

  const sellItem = (itemId: string) => {
    // Get the current price from the round data
    const currentPrice = getCurrentPrice(itemId)

    if (inventory[itemId] && inventory[itemId] > 0) {
      setBalance(balance + currentPrice)
      setInventory({
        ...inventory,
        [itemId]: inventory[itemId] - 1,
      })
    }
  }

  const getInventoryCount = (itemId: string) => {
    return inventory[itemId] || 0
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "wood":
        return <Tree className="h-4 w-4" />
      case "ground":
        return <Map className="h-4 w-4" />
      case "food":
        return <Wheat className="h-4 w-4" />
      case "tools":
        return <Axe className="h-4 w-4" />
      default:
        return null
    }
  }

  // Calculate total spent by category
  const calculateTotalsByCategory = () => {
    const totals = {
      wood: 0,
      ground: 0,
      food: 0,
      tools: 0,
    }

    purchaseHistory.forEach((purchase) => {
      if (purchase.category) {
        if (purchase.category in totals) {
          totals[purchase.category as keyof typeof totals] += purchase.price
        }
      }
    })

    return totals
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
  
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1
  
          // Check if we need to update the round
          const newRound = calculateRound(newTime)
          if (newRound !== currentRound) {
            setCurrentRound(newRound)
            toast.info(`Round ${newRound} Started!`, {
              description: "Resource limits and prices have been updated.",
            })
          }
  
          return newTime
        })
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
  }, [timerActive, timeRemaining, currentRound])

  // Get summary of purchased items
  const getPurchaseSummary = () => {
    const summary: Record<string, { name: string; quantity: number; totalSpent: number; category: string }> = {}

    purchaseHistory.forEach((purchase) => {
      if (!summary[purchase.itemId]) {
        summary[purchase.itemId] = {
          name: purchase.itemName,
          quantity: 0,
          totalSpent: 0,
          category: purchase.category,
        }
      }

      summary[purchase.itemId].quantity += purchase.quantity
      summary[purchase.itemId].totalSpent += purchase.price
    })

    return Object.values(summary)
  }

  // Get the current price for an item based on the round
  const getCurrentPrice = (itemId: string) => {
    const currentRoundData = rounds.find((r) => r.number === currentRound)
    if (!currentRoundData) return 0

    return currentRoundData.prices[itemId] || 0
  }

  // Get the remaining quantity available for an item in the current round
  const getRemainingQuantity = (itemId: string) => {
    const currentRoundData = rounds.find((r) => r.number === currentRound)
    if (!currentRoundData) return 0

    const maxPurchases = currentRoundData.maxPurchases[itemId] || 0
    const alreadyPurchased = purchasedInRound[currentRound]?.[itemId] || 0

    return Math.max(0, maxPurchases - alreadyPurchased)
  }

  const categoryTotals = calculateTotalsByCategory()
  const purchaseSummary = getPurchaseSummary()
  const totalSpent = purchaseHistory.reduce((total, purchase) => total + purchase.price, 0)

  // Calculate progress percentage for the timer
  const timerProgress = ((70 * 60 - timeRemaining) / (70 * 60)) * 100

  return (
    <div>
      <MainNavBar
        balance={balance}
        cartItemsCount={Object.values(cartItems).reduce((a: number, b: number) => a + (b as number), 0)}
      />

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
            <div className="flex justify-between gap-2">
              {!timerActive ? (
                <Button onClick={startTimer} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" /> Start
                </Button>
              ) : (
                <Button onClick={pauseTimer} className="flex-1 bg-amber-500 hover:bg-amber-600">
                  <Pause className="h-4 w-4 mr-2" /> Pause
                </Button>
              )}
              <Button onClick={resetTimer} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAdminModal(true)}
                className="ml-4"
              >
                Admin Mode
              </Button>
            </div>
          </CardContent>
        </Card>

        {isAdminMode && (
          <div className="p-4 border rounded-md bg-gray-100 mb-8">
            <h3 className="text-lg font-semibold mb-4">Admin Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Edit Balance */}
              <div>
                <label className="block text-sm font-medium mb-1">Balance</label>
                <Input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                />
              </div>

              {/* Edit Time */}
              <div>
                <label className="block text-sm font-medium mb-1">Time Remaining (seconds)</label>
                <Input
                  type="number"
                  value={timeRemaining}
                  onChange={(e) => setTimeRemaining(Number(e.target.value))}
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

            {/* Clear Local Storage Button */}
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
                  localStorage.clear()
                  setBalance(5000) // Reset balance
                  setInventory({}) // Reset inventory
                  setCartItems({}) // Reset cart
                  setPurchaseHistory([]) // Reset purchase history
                  setTimeRemaining(70 * 60) // Reset timer
                  setCurrentRound(1) // Reset round
                  setPurchasedInRound({}) // Reset purchased items
                  toast.success("All data has been cleared.")
                }
              }}
              className="mt-4"
            >
              Clear All Data
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setIsAdminMode(false)
                toast.info("Admin Mode Disabled")
              }}
              className="mt-4"
            >
              Exit Admin Mode
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Trading Post</h1>
          <Card className="w-full md:w-auto">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Your Balance:</span>
                <Badge variant="outline" className="ml-2 text-lg">
                  {balance} PLN
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Status Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
            <CardDescription>Overview of your purchases and inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Tree className="h-4 w-4 mr-2" />
                      <span>Wood</span>
                    </div>
                    <span>{categoryTotals.wood} PLN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Map className="h-4 w-4 mr-2" />
                      <span>Ground</span>
                    </div>
                    <span>{categoryTotals.ground} PLN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Wheat className="h-4 w-4 mr-2" />
                      <span>Food</span>
                    </div>
                    <span>{categoryTotals.food} PLN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Axe className="h-4 w-4 mr-2" />
                      <span>Tools</span>
                    </div>
                    <span>{categoryTotals.tools} PLN</span>
                  </div>
                  <div className="flex justify-between items-center font-bold pt-2 border-t">
                    <span>Total Spent</span>
                    <span>{totalSpent} PLN</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Items Purchased</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {purchaseSummary.length > 0 ? (
                    purchaseSummary.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getCategoryIcon(item.category)}
                          <span className="ml-2">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div>{item.quantity} units</div>
                          <div className="text-sm text-gray-500">{item.totalSpent} PLN</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No purchases yet</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="wood" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="wood" className="flex items-center gap-2">
              <Tree className="h-4 w-4" /> Wood
            </TabsTrigger>
            <TabsTrigger value="ground" className="flex items-center gap-2">
              <Map className="h-4 w-4" /> Ground
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-2">
              <Wheat className="h-4 w-4" /> Food
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Axe className="h-4 w-4" /> Tools
            </TabsTrigger>
          </TabsList>

          {Object.entries(categories).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const currentPrice = getCurrentPrice(item.id)
                  const remainingQuantity = getRemainingQuantity(item.id)

                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryIcon(category)} {item.name}
                        </CardTitle>
                        <CardDescription>Price: {currentPrice} PLN</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 pb-2">
                        <div className="flex justify-center">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                          />
                        </div>
                        {timerActive && (
                          <div className="mt-2 text-sm">
                            <div className="flex justify-between">
                              <span>Available in round {currentRound}:</span>
                              <span className={remainingQuantity === 0 ? "text-red-500 font-bold" : ""}>
                                {remainingQuantity} units
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center w-full">
                          <span>In inventory: {getInventoryCount(item.id)}</span>
                        </div>
                        <div className="flex gap-2 w-full">
                          <Button
                            onClick={() => buyItem(item.id, currentPrice)}
                            className="flex-1"
                            disabled={balance < currentPrice || !timerActive || remainingQuantity <= 0}
                          >
                            Buy
                          </Button>
                          <Button
                            onClick={() => sellItem(item.id)}
                            variant="outline"
                            className="flex-1"
                            disabled={getInventoryCount(item.id) <= 0 || !timerActive}
                          >
                            Sell
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {/* Secret Code Input */}
      <div className="fixed bottom-4 right-4 z-40">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.secretCode.value

            // Process the ASCII code
            try {
              // Split by dash
              const parts = input.split("-")

              // Convert all parts except the last one from ASCII to characters
              let resourceName = ""
              for (let i = 0; i < parts.length - 1; i++) {
                resourceName += String.fromCharCode(Number.parseInt(parts[i]))
              }

              // Convert the last part from hex to decimal
              const quantity = Number.parseInt(parts[parts.length - 1], 16)

              // Convert to lowercase for comparison
              resourceName = resourceName.toLowerCase()

              // Check if the resource exists
              let resourceFound = false

              // Search through all categories and items
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
          }}
        >
          <Input
            name="secretCode"
            placeholder="Enter secret code..."
            className="w-64 bg-yellow-300 border-yellow-500 placeholder:text-yellow-800 text-yellow-900"
          />
        </form>
      </div>
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Timer</DialogTitle>
            <DialogDescription>Enter the admin password to reset the timer.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="col-span-4"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={confirmReset} className="ml-2">
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Admin Password</DialogTitle>
            <DialogDescription>Access admin mode to edit inventory, money, and time.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="admin-password"
              type="password"
              placeholder="Password"
              className="col-span-4"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={() => setShowAdminModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                if (adminPassword === "admin123") {
                  setIsAdminMode(true)
                  setShowAdminModal(false)
                  setAdminPassword("")
                  toast.success("Admin Mode Enabled")
                } else {
                  toast.error("Invalid Password")
                }
              }}
              className="ml-2"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

