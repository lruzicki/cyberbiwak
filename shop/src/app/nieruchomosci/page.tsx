"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Filter, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { MainNavBar } from "@/components/main-nav-bar"
import { useTimer } from "@/utils/use-timer"
import { categories } from "@/products/products" // Import categories from products.ts
import { getCurrentPrice, getRemainingQuantity, getInventoryCount } from "@/utils/products-actions" // Import reusable functions
import { handleBuy, handleOrder } from "@/utils/shop-actions" // Import buy and order handlers

export default function Nieruchomosci() {
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
  const [propertyType, setPropertyType] = useState("Kupię")
  const [propertyCategory, setPropertyCategory] = useState("Działka")
  const [location, setLocation] = useState("Gołubie")
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 70 * 60 * 1000)
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)

  const { timeRemaining, setTimeRemaining, currentRound } = useTimer({
    initialTargetTime: targetTime,
    timerActive,
    totalRounds: 7,
    onTimerEnd: () => setTimerActive(false),
    updateTargetTime: setTargetTime,
  })

  // Use the "ground" category from the categories object
  const filteredProperties = categories.ground.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFavorite = (itemId: string) => {
    console.log("Toggle favorite for:", itemId)
  }

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
      />

      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/nieruchomosci" className="flex items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-sm"></div>
                <div className="ml-2 font-semibold text-gray-800">nieruchomosci-online.pl</div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="flex items-center text-gray-700">
                <Heart className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">Ulubione</span>
              </Button>
              <Button variant="ghost" className="flex items-center text-gray-700">
                <span className="hidden md:inline">Dodaj ogłoszenie</span>
              </Button>
              <Button variant="ghost" className="flex items-center text-gray-700">
                <User className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">Zaloguj</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-4 gap-2">
            <div className="flex-1 flex">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="rounded-r-none border-r-0 w-32">
                  <SelectValue placeholder="Kupię" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kupię">Kupię</SelectItem>
                  <SelectItem value="Wynajmę">Wynajmę</SelectItem>
                </SelectContent>
              </Select>
              <Select value={propertyCategory} onValueChange={setPropertyCategory}>
                <SelectTrigger className="rounded-none border-r-0 w-32">
                  <SelectValue placeholder="Działka" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Działka">Działka</SelectItem>
                  <SelectItem value="Dom">Dom</SelectItem>
                  <SelectItem value="Mieszkanie">Mieszkanie</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Lokalizacja"
                  className="pl-10 rounded-l-none w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">×</button>
              </div>
            </div>
            <div className="flex">
              <Input type="text" placeholder="+0 km" className="w-24 rounded-r-none" />
              <Button variant="outline" className="rounded-l-none border-l-0">
                <Filter className="h-4 w-4 mr-2" />
                Filtry
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Działki na sprzedaż Gołubie</h1>
            <p className="text-sm text-gray-500">{filteredProperties.length} ogłoszeń</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const currentPrice = getCurrentPrice(property.id, currentRound)
            const remainingQuantity = getRemainingQuantity(property.id, currentRound, purchasedInRound)

            return (
              <div key={property.id} className="bg-white rounded-md overflow-hidden shadow-sm">
                <div className="relative">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 rounded-full h-8 w-8"
                    onClick={() => toggleFavorite(property.id)}
                  >
                    <Heart className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-1">{property.category}</div>
                  <h3 className="font-medium mb-2">{property.name}</h3>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="font-bold text-lg">Cena: {currentPrice.toFixed(2)} PLN</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentRound === 1 && (
                      <Button
                        onClick={() =>
                          handleBuy(
                            property.id,
                            property.name,
                            currentPrice,
                            "ground",
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
                        variant="outline"
                        className="flex-1"
                        disabled={remainingQuantity <= 0 || currentPrice > balance || !timerActive}
                      >
                        Kup
                      </Button>
                    )}
                    <Button
                      onClick={() =>
                        handleOrder(property.id, property.name, orderedItems, setOrderedItems)
                      }
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      Zamów {orderedItems[property.id] ? `(${orderedItems[property.id]})` : ""}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

