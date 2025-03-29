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
import { marketplaceProducts } from "@/products/marketplace-products" // Import products

export default function Marketplace() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [orderedItems, setOrderedItems] = useLocalStorage<Record<string, number>>("shop-ordered-items", {})
  const [searchQuery, setSearchQuery] = useState("")
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 70 * 60 * 1000) // Use targetTime from local storage
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)

  const { timeRemaining, setTimeRemaining, currentRound } = useTimer({
    initialTargetTime: targetTime,
    timerActive,
    totalRounds: 7, // Define 7 rounds
    onTimerEnd: () => setTimerActive(false), // Stop the timer when it ends
    updateTargetTime: setTargetTime, // Update targetTime in local storage
  })

  // Filtered listings based on search query
  const filteredListings = marketplaceProducts.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToCart = (itemId: string) => {
    setOrderedItems({
      ...orderedItems,
      [itemId]: (orderedItems[itemId] || 0) + 1,
    })
  }

  const buyItem = (itemId: string, price: number) => {
    const item = marketplaceProducts.find((item) => item.id === itemId)
    if (item && balance >= price) {
      setBalance(parseFloat((balance - price).toFixed(2)))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MainNavBar
        balance={balance}
        orderedItemsCount={Object.values(orderedItems).reduce((a: number, b: number) => a + (b as number), 0)}
        currentRound={currentRound} // Pass the current round to the MainNavBar
        onAdminClick={() => {
          console.log("Admin button clicked")
        }}
      />

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Znaleźliśmy ponad {marketplaceProducts.length} ogłoszeń</h1>
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
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                {listing.featured && <Badge className="absolute top-2 left-2 bg-teal-500 text-white">WYRÓŻNIONE</Badge>}
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <CardDescription className="flex justify-between">
                  <span>{listing.location}</span>
                  <span className="font-semibold">{listing.price} PLN</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 pb-2">
                <p className="text-sm text-gray-500">{listing.date}</p>
                <p className="text-sm mt-2">Dostępna ilość: {listing.quantity}</p>
              </CardContent>
              <CardFooter className="p-4 flex gap-2">
                <Button onClick={() => addToCart(listing.id)} variant="outline" className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Dodaj do koszyka
                </Button>
                <Button
                  onClick={() => buyItem(listing.id, listing.price)}
                  className="flex-1"
                  disabled={balance < listing.price}
                >
                  Kup teraz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

