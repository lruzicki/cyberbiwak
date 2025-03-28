"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, MessageSquare, Bell, ChevronDown, Truck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardFooter } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { MainNavBar } from "@/components/main-nav-bar"
import { allegroProducts, allegroCategories } from "@/products/allegro-products"
import { useTimer } from "@/utils/use-timer" // Adjust the path based on your project structure

export default function Allegro() {
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

  const filteredProducts = allegroProducts.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const addToCart = (itemId: string) => {
    setOrderedItems({
      ...orderedItems,
      [itemId]: (orderedItems[itemId] || 0) + 1,
    })
  }

  const buyItem = (itemId: string, price: number) => {
    const item = allegroProducts.find((item) => item.id === itemId)
    if (item && balance >= price) {
      setBalance(parseFloat((balance - price).toFixed(2)))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MainNavBar
        balance={balance}
        orderedItemsCount={Object.values(orderedItems as Record<string, number>).reduce((a, b) => a + b, 0)}
        currentRound={currentRound} // Pass the current round to the MainNavBar
        onAdminClick={() => {
          console.log("Admin button clicked");
        }}
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

          {/* Categories */}
          <div className="flex items-center space-x-6 py-2 text-sm">
            <div className="flex items-center font-medium">
              <span>Kategorie</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
            <Link href="#" className="flex items-center text-gray-700">
              <span>Strefa Okazji</span>
            </Link>
            <Link href="#" className="flex items-center text-gray-700">
              <Shield className="h-4 w-4 mr-1" />
              <span>Allegro Protect</span>
            </Link>
            <Link href="#" className="flex items-center text-gray-700">
              <span>Gwarancja najniższej ceny</span>
            </Link>
            <Link href="#" className="flex items-center text-gray-700">
              <span>Sprzedawaj na Allegro</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        {/* Banner */}
        <div className="bg-blue-900 text-white rounded-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="p-8 md:w-1/2">
              <div className="bg-white text-blue-900 p-4 inline-block mb-4">
                <h2 className="text-xl font-bold">
                  Jak firmowe zakupy,
                  <br />
                  to Allegro Business
                </h2>
              </div>
              <div className="bg-orange-500 text-white p-2 inline-block">
                <p>Produkty codzienne i profesjonalne w jednym miejscu</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/placeholder.svg?height=300&width=500"
                alt="Allegro Business"
                width={500}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {allegroCategories.map((category) => (
            <Link href="#" key={category.id} className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-2 w-full">
                <Image
                  src={category.icon || "/placeholder.svg"}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="mx-auto"
                />
              </div>
              <span className="text-xs">{category.name}</span>
            </Link>
          ))}
        </div>

        {/* Spring deals section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Jak niskie ceny, to czas na wiosenne zakupy</h2>
            <Link href="#" className="text-blue-500 text-sm">
              Zobacz więcej
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="aspect-square relative mb-2">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mb-2">
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold">{product.price.toFixed(2)}</span>
                      <span className="text-xs ml-1">PLN</span>
                    </div>
                    <div className="text-xs text-green-600">{product.guarantee}</div>
                  </div>
                  <div className="h-12 overflow-hidden mb-2">
                    <h3 className="text-sm leading-tight">{product.name}</h3>
                  </div>
                  <div className="flex items-center mb-2">
                    {product.smart && <Badge className="bg-blue-900 text-white text-xs">SMART</Badge>}
                  </div>
                  <div className="text-xs mb-2">Dostępna ilość: {product.quantity}</div>
                  <div className="text-xs text-gray-500 mb-2">{product.delivery}</div>
                </div>
                <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                  <Button onClick={() => addToCart(product.id)} variant="outline" className="w-full text-xs">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Dodaj do koszyka
                  </Button>
                  <Button
                    onClick={() => buyItem(product.id, product.price)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-xs"
                    disabled={balance < product.price}
                  >
                    Kup teraz
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

