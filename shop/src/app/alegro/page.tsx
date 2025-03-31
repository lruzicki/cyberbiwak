"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, MessageSquare, Bell, ChevronDown, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { MainNavBar } from "@/components/main-nav-bar"
import { categories } from "@/products/products" // Use categories from products.ts
import { useTimer } from "@/utils/use-timer"
import { getCurrentPrice, getRemainingQuantity } from "@/utils/products-actions"
import { handleBuy, handleOrder } from "@/utils/shop-actions"
import { toast } from "sonner";

export default function Alegro() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [orderedItems, setOrderedItems] = useLocalStorage<Record<string, number>>("shop-ordered-items", {})
  const [purchasedInRound, setPurchasedInRound] = useLocalStorage<Record<number, Record<string, number>>>(
    "purchased-in-round",
    {}
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all") // Track selected category
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 70 * 60 * 1000)
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)

  const { timeRemaining, currentRound } = useTimer({
    initialTargetTime: targetTime,
    timerActive,
    totalRounds: 7,
    onTimerEnd: () => setTimerActive(false),
    updateTargetTime: setTargetTime,
  })

  // Filter products based on the selected category and search query
  const filteredProducts = Object.entries(categories)
    .filter(([categoryKey]) => selectedCategory === "all" || categoryKey === selectedCategory)
    .flatMap(([, items]) =>
      items.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

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

      {/* Custom Allegro Navbar */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/allegro" className="flex items-center">
              <div className="text-2xl font-bold text-orange-500">allegro</div>
              <div className="text-xs ml-1 mt-1 text-orange-500">
                <span className="font-bold">85</span>
                <span className="ml-0.5">LAT</span>
              </div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-3xl mx-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="czego szukasz?"
                  className="w-full border-gray-300 rounded-md pl-4 pr-20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-0 top-0 h-full">
                  <div className="h-full flex items-center">
                    <Button className="h-full rounded-l-none bg-orange-500 hover:bg-orange-600">SZUKAJ</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-gray-700">
                <Truck className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-700">
                <Heart className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-700">
                <MessageSquare className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-700">
                <Bell className="h-5 w-5" />
              </Link>
              <Link href="#" className="relative text-gray-700">
                <ShoppingCart className="h-5 w-5" />
                {Object.values(orderedItems).reduce((a: number, b: number) => a + (b as number), 0) > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white">
                    {Object.values(orderedItems).reduce((a: number, b: number) => a + (b as number), 0)}
                  </Badge>
                )}
              </Link>
              <div className="flex items-center text-gray-700">
                <span className="mr-1">Moje Allegro</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-4 px-4">
        {/* Banner */}
        <div className="bg-blue-900 text-white rounded-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
        <div className="p-4 md:w-1/2">
          <div className="bg-white text-blue-900 p-2 inline-block mb-2">
            <h2 className="text-lg font-bold">
          Jak firmowe zakupy,
          <br />
          to Allegro Business
            </h2>
          </div>
          <div className="bg-orange-500 text-white p-1 inline-block">
            <p className="text-sm">Produkty codzienne i profesjonalne w jednym miejscu</p>
          </div>
        </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Categories Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div
            className={`flex flex-col items-center text-center cursor-pointer ${
              selectedCategory === "all" ? "text-orange-500 font-bold" : "text-gray-700"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm mb-2 w-full">
              <Image src="/placeholder.svg" alt="All Categories" width={80} height={80} className="mx-auto" />
            </div>
            <span className="text-xs font-bold">Wszystkie</span>
          </div>
          {Object.entries(categories).map(([categoryKey]) => (
            <div
              key={categoryKey}
              className={`flex flex-col items-center text-center cursor-pointer ${
                selectedCategory === categoryKey ? "text-orange-500 font-bold" : "text-gray-700"
              }`}
              onClick={() => setSelectedCategory(categoryKey)}
            >
              <div className="bg-white p-4 rounded-lg shadow-sm mb-2 w-full">
                <Image src="/placeholder.svg" alt={categoryKey} width={80} height={80} className="mx-auto" />
              </div>
              <span className="text-xs font-bold">{categoryKey}</span>
            </div>
          ))}
        </div>

        {/* Products Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const currentPrice = getCurrentPrice(product.id, currentRound)
            const discount = Math.min(Math.floor(30 + (product.id.charCodeAt(0) % 10) * 5), 90)
            const remainingQuantity = product.id
              .split("")
              .reduce((sum, char) => sum + (char.charCodeAt(0) - 68), 0)

            return (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>
                      Price: {(currentPrice * discount / 100).toFixed(2)} PLN{" "}
                      <span className="text-red-500 font-bold">(-{discount}%)</span>{" "}
                      <span className="line-through text-gray-500">
                      {(currentPrice).toFixed(2)} PLN
                      </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 pb-2">
                  <div className="aspect-square relative mb-2">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-xs mb-2">Dostępna ilość: {remainingQuantity}</div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      const quantity = parseInt(prompt(`Enter quantity for ${product.name}:`) || "0", 10)
                      if (isNaN(quantity) || quantity <= 0) {
                        toast.error("Invalid quantity entered.")
                        return
                      }

                      const totalCost = currentPrice * discount / 100 * quantity

                      setBalance(balance - totalCost)
                      toast.success(
                        `You bought ${quantity} ${product.name}(s) for ${totalCost} PLN.`
                      )
                    }}
                    variant="outline"
                    className="w-full text-xs"
                  >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                    Kup
                  </Button>
                  <Button
                    onClick={() => {}}
                    variant="outline"
                    className="w-full text-xs"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Zamów {orderedItems[product.id] ? `(${orderedItems[product.id]})` : ""}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

