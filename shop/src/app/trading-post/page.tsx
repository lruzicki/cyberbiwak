"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Axe, Wheat, TreesIcon as Tree, Map } from "lucide-react"
import Image from "next/image"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { categories } from "@/products/categories"
import { roundData, Round } from "@/products/round-data"
import { MainNavBar } from "@/components/main-nav-bar" // Import the MainNavBar component

export default function TradingPost() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
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
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)
  const [timeRemaining, setTimeRemaining] = useLocalStorage("shop-time-remaining", 70 * 60)
  const [currentRound, setCurrentRound] = useLocalStorage("shop-current-round", 1)
  const [rounds, setRounds] = useState<Round[]>([])
  const [purchasedInRound, setPurchasedInRound] = useLocalStorage<Record<number, Record<string, number>>>("purchased-in-round", {})
  const [showAdminModal, setShowAdminModal] = useState(false)

  const allItems = Object.values(categories).flat()

  useEffect(() => {
    setRounds(roundData)
  }, [])

  const getCurrentPrice = (itemId: string) => {
    const currentRoundData = rounds.find((r) => r.number === currentRound)
    if (!currentRoundData) return 0
    return currentRoundData.prices[itemId] || 0
  }

  const getRemainingQuantity = (itemId: string) => {
    const currentRoundData = rounds.find((r) => r.number === currentRound)
    if (!currentRoundData) return 0
    const maxPurchases = currentRoundData.maxPurchases[itemId] || 0
    const alreadyPurchased = purchasedInRound[currentRound]?.[itemId] || 0
    return Math.max(0, maxPurchases - alreadyPurchased)
  }

  const getInventoryCount = (itemId: string) => {
    return inventory[itemId] || 0
  }

  const handleBuy = (itemId: string, itemName: string, price: number, category: string) => {
    const remainingQuantity = getRemainingQuantity(itemId)
    if (balance >= price && remainingQuantity > 0) {
      // Deduct balance
      setBalance(parseFloat((balance - price).toFixed(2)))

      // Update inventory
      setInventory({
        ...inventory,
        [itemId]: (inventory[itemId] || 0) + 1,
      })

      // Update purchasedInRound
      setPurchasedInRound({
        ...purchasedInRound,
        [currentRound]: {
          ...purchasedInRound[currentRound],
          [itemId]: (purchasedInRound[currentRound]?.[itemId] || 0) + 1,
        },
      })

      // Add to purchase history
      setPurchaseHistory([
        ...purchaseHistory,
        {
          id: Date.now(),
          itemId,
          itemName,
          price,
          quantity: 1,
          date: new Date().toISOString(),
          category,
          round: currentRound,
        },
      ])

      toast.success(`You bought 1 ${itemName} for ${price} PLN.`)
    } else {
      toast.error("You don't have enough balance or the item is out of stock.")
    }
  }

  const handleSell = (itemId: string, itemName: string, price: number) => {
    const inventoryCount = getInventoryCount(itemId)
    if (inventoryCount > 0) {
      // Add balance
      setBalance(parseFloat((balance + price).toFixed(2)))

      // Update inventory
      setInventory({
        ...inventory,
        [itemId]: inventory[itemId] - 1,
      })

      toast.success(`You sold 1 ${itemName} for ${price} PLN.`)
    } else {
      toast.error("You don't have this item in your inventory.")
    }
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

  return (
    <div>
      {/* Include the MainNavBar */}
      <MainNavBar
        balance={balance}
        cartItemsCount={Object.values(cartItems).reduce((a: number, b: number) => a + (b as number), 0)}
        onAdminClick={() => setShowAdminModal(true)} // Pass the callback
      />

      <div className="container mx-auto py-8 px-4">


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
                            onClick={() => handleBuy(item.id, item.name, currentPrice, category)}
                            className="flex-1"
                            disabled={balance < currentPrice || !timerActive || remainingQuantity <= 0}
                          >
                            Buy
                          </Button>
                          <Button
                            onClick={() => handleSell(item.id, item.name, currentPrice)}
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
    </div>
  )
}