"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { MainNavBar } from "@/components/main-nav-bar"
import { useTimer } from "@/utils/use-timer"
import { categories } from "@/products/products" // Import products from products.ts
import { getCurrentPrice, getRemainingQuantity } from "@/utils/products-actions"
import { handleBuy, handleOrder } from "@/utils/shop-actions"

export default function Marketplace() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [orderedItems, setOrderedItems] = useLocalStorage<Record<string, number>>("shop-ordered-items", {})
  const [searchQuery, setSearchQuery] = useState("")
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 70 * 60 * 1000)
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)
  const [purchasedInRound, setPurchasedInRound] = useLocalStorage<Record<number, Record<string, number>>>(
    "purchased-in-round",
    {}
  )
  const [purchaseHistory, setPurchaseHistory] = useLocalStorage<Array<{
    id: number
    itemId: string
    itemName: string
    price: number
    quantity: number
    date: string
    category: string
    round: number
  }>>("shop-purchase-history", [])

  const [inventory, setInventory] = useLocalStorage<Record<string, number>>("shop-inventory", { "buk": 3 })

  const { timeRemaining, currentRound } = useTimer({
    initialTargetTime: targetTime,
    timerActive,
    totalRounds: 7,
    onTimerEnd: () => setTimerActive(false),
    updateTargetTime: setTargetTime,
  })

  // Combine all products from all categories
  const allProducts = Object.entries(categories).flatMap(([categoryKey, items]) =>
    items.map((item) => ({ ...item, category: categoryKey }))
  )

  // Filter products based on the search query
  const filteredProducts = Object.entries(categories)
    .flatMap(([, items]) =>
      items.filter((product) => {
        if (product.category === "food" || product.category === "ground") {
          const seed = currentRound + product.id.charCodeAt(0) + product.id.charCodeAt(product.id.length - 1) + product.id.length;
          const randomFromSeed = Math.abs(Math.sin(seed)) % 1;
          const shouldDisplay = randomFromSeed > 0.5;
          if (!shouldDisplay) {
            return false;
          }
        }

        return (
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          getRemainingQuantity(product.id, currentRound, purchasedInRound) > 0
        );
      })
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <MainNavBar
        balance={balance}
        setBalance={setBalance}
        orderedItemsCount={Object.values(orderedItems).reduce((a: number, b: number) => a + (b as number), 0)}
        currentRound={currentRound}
        timeRemaining={timeRemaining}
        onAdminClick={() => {
          console.log("Admin button clicked")
        }}
        timerActive={timerActive}
      />

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Znaleźliśmy ponad {filteredProducts.length} ogłoszeń</h1>
            <Button className="bg-teal-500 hover:bg-teal-600">Dodaj ogłoszenie</Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Szukaj ogłoszeń..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const currentPrice = getCurrentPrice(product.id, currentRound)
            const remainingQuantity = getRemainingQuantity(product.id, currentRound, purchasedInRound)

            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="flex justify-between">
                    <span>{product.category}</span>
                    <span className="font-semibold">{currentPrice.toFixed(2)} PLN</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 pb-2">
                  <p className="text-sm text-gray-500">Dostępna ilość: {remainingQuantity}</p>
                </CardContent>
                <CardFooter className="p-4 flex gap-2">
                  <Button
                    onClick={() =>
                      handleOrder(product.id, product.name, orderedItems, setOrderedItems)
                    }
                    variant="outline"
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Zamów
                  </Button>
                    {currentRound === 1 && (
                    <Button
                      onClick={() =>
                      handleBuy(
                        product.id,
                        product.name,
                        currentPrice,
                        product.category,
                        currentRound,
                        balance,
                        setBalance,
                        inventory,
                        setInventory,
                        purchasedInRound,
                        setPurchasedInRound,
                        purchaseHistory,
                        setPurchaseHistory,
                        remainingQuantity,
                        -1
                      )
                      }
                      className="flex-1"
                      disabled={remainingQuantity <= 0 || currentPrice > balance || !timerActive}
                    >
                      Kup
                    </Button>
                    )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

