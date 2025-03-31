"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Truck, Building, Store, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { MainNavBar } from "@/components/main-nav-bar"
import { useTimer } from "@/utils/use-timer"
import { categories } from "@/products/products" // Import products from products.ts
import { getCurrentPrice, getRemainingQuantity, getInventoryCount } from "@/utils/products-actions" // Import reusable functions
import { handleBuy, handleOrder } from "@/utils/shop-actions" // Import buy and order handlers

export default function Makro() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [inventory, setInventory] = useLocalStorage<Record<string, number>>("shop-inventory", { "buk": 3 })
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
  }>>("shop-purchase-history", [])
  const [purchasedInRound, setPurchasedInRound] = useLocalStorage<Record<number, Record<string, number>>>(
    "purchased-in-round",
    {}
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 70 * 60 * 1000)
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)

  const { isLoaded, timeRemaining, setTimeRemaining, currentRound } = useTimer({
    initialTargetTime: targetTime,
    timerActive,
    totalRounds: 7,
    onTimerEnd: () => setTimerActive(false),
    updateTargetTime: setTargetTime,
  })

  // Filter products from the "gastronomy" category
  const gastronomyProducts = categories.food.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MainNavBar
        balance={balance}
        orderedItemsCount={Object.values(orderedItems).reduce((a: number, b: number) => a + (b as number), 0)}
        currentRound={currentRound}
        onAdminClick={() => {
          console.log("Admin button clicked")
        }}
      />

      {/* Makro header */}
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/makro" className="flex items-center">
              <div className="text-3xl font-bold text-yellow-400">makro</div>
            </Link>

            {/* Customer segments */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" className="bg-blue-800 text-white border-blue-700 hover:bg-blue-700">
                <Truck className="h-4 w-4 mr-2" />
                Dla Gastronomii
              </Button>
              <Button variant="outline" className="bg-blue-800 text-white border-blue-700 hover:bg-blue-700">
                <Building className="h-4 w-4 mr-2" />
                Dla Biura
              </Button>
              <Button variant="outline" className="bg-blue-800 text-white border-blue-700 hover:bg-blue-700">
                <Store className="h-4 w-4 mr-2" />
                Dla Handlu
              </Button>
              <Button variant="outline" className="bg-blue-800 text-white border-blue-700 hover:bg-blue-700">
                <Info className="h-4 w-4 mr-2" />O nas
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Szukaj"
                className="w-full bg-white text-black pl-4 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-0 top-0 h-full">
                <div className="h-full flex items-center pr-3">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Products section */}
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-bold text-blue-900 mb-6">Produkty dla gastronomii</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gastronomyProducts.map((product) => {
              const currentPrice = getCurrentPrice(product.id, currentRound) // Get price from round-data
              const remainingQuantity = getRemainingQuantity(product.id, currentRound, purchasedInRound) // Get quantity from round-data

              return (
                <Card key={product.id} className="overflow-hidden border-none shadow-md">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>Price: {currentPrice.toFixed(2)} PLN</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    <div className="flex justify-center">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <span>Available:</span>
                        <span className={remainingQuantity === 0 ? "text-red-500 font-bold" : ""}>
                          {remainingQuantity} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>In inventory:</span>
                        <span>{getInventoryCount(product.id, inventory)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      {currentRound === 1 && (
                        <Button
                          onClick={() =>
                            handleBuy(
                              product.id,
                              product.name,
                              currentPrice,
                              "gastronomy",
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
                          Buy
                        </Button>
                      )}
                      <Button
                        onClick={() =>
                          handleOrder(product.id, product.name, orderedItems, setOrderedItems)
                        }
                        variant="secondary"
                        className="flex-1"
                      >
                        Order {orderedItems[product.id] ? `(${orderedItems[product.id]})` : ""}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

