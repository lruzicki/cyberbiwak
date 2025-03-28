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
import { categories } from "@/products/products"
import { roundData, Round } from "@/products/round-data"
import { MainNavBar } from "@/components/main-nav-bar" // Import the MainNavBar component
import { handleBuy, handleOrder } from "@/utils/shop-actions" // Import the utility functions

export default function TradingPost() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [inventory, setInventory] = useLocalStorage<Record<string, number>>("shop-inventory", {})
  const [orderedItems, setOrderedItems] = useLocalStorage<Record<string, number>>("shop-ordered-items", {})
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
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 70 * 60 * 1000)
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
        orderedItemsCount={Object.values(orderedItems).reduce((a: number, b: number) => a + (b as number), 0)}
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
                            {currentRound === 1 && (
                              <Button
                                onClick={() => handleBuy(
                                  item.id,
                                  item.name,
                                  currentPrice,
                                  category,
                                  currentRound,
                                  balance,
                                  setBalance,
                                  inventory,
                                  setInventory,
                                  purchasedInRound,
                                  setPurchasedInRound,
                                  purchaseHistory,
                                  setPurchaseHistory,
                                  getRemainingQuantity(item.id) // Pass the remaining quantity
                                )}
                                className="flex-1"
                                disabled={getRemainingQuantity(item.id) <= 0 || currentPrice > balance || !timerActive}
                              >
                                Buy
                              </Button>
                            )}
                          <Button
                            onClick={() => handleOrder(item.id, item.name, currentPrice, { [item.id]: orderedItems[item.id] || 0 }, setOrderedItems)}
                            variant="secondary"
                            className="flex-1"
                          >
                            Order {orderedItems[item.id] ? `(${orderedItems[item.id]})` : ""}
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