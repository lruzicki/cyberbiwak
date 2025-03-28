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

export default function Nieruchomosci() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [orderedItems, setOrderedItems] = useLocalStorage<Record<string, number>>("shop-cart", {})
  const [searchQuery, setSearchQuery] = useState("")
  const [propertyType, setPropertyType] = useState("Kupię")
  const [propertyCategory, setPropertyCategory] = useState("Działka")
  const [location, setLocation] = useState("Gołubie")

  // Real estate listings
  const properties = [
    {
      id: "plot1",
      title: "Działka rolna przy lesie Gołubie",
      price: 99999,
      location: "Gołubie warmińsko-mazurskie",
      size: "3 545 m²",
      image: "/placeholder.svg?height=300&width=400",
      quantity: Math.floor(Math.random() * 3) + 1, // Limited availability for land
      favorite: false,
    },
    {
      id: "plot2",
      title: "Działka budowlana uzbrojona Gołubie",
      price: 342300,
      location: "Gołubie pomorskie",
      size: "2 282 m²",
      image: "/placeholder.svg?height=300&width=400",
      quantity: Math.floor(Math.random() * 3) + 1,
      favorite: false,
    },
    {
      id: "plot3",
      title: "Działka rolna przy lesie Gołubie",
      price: 115000,
      location: "Gołubie warmińsko-mazurskie",
      size: "3 687 m²",
      image: "/placeholder.svg?height=300&width=400",
      quantity: Math.floor(Math.random() * 3) + 1,
      favorite: false,
    },
    {
      id: "plot4",
      title: "Działka Gołubie",
      price: 149000,
      location: "Gołubie pomorskie",
      size: "1 003 m²",
      image: "/placeholder.svg?height=300&width=400",
      quantity: Math.floor(Math.random() * 3) + 1,
      favorite: false,
    },
    {
      id: "plot5",
      title: "Działka Gołubie",
      price: 85000,
      location: "Gołubie warmińsko-mazurskie",
      size: "3 003 m²",
      image: "/placeholder.svg?height=300&width=400",
      quantity: Math.floor(Math.random() * 3) + 1,
      favorite: false,
    },
    {
      id: "plot6",
      title: "Działka rekreacyjna ogrodzona Gołubie",
      price: 215000,
      location: "Gołubie warmińsko-mazurskie",
      size: "1 964 m²",
      image: "/placeholder.svg?height=300&width=400",
      quantity: Math.floor(Math.random() * 3) + 1,
      favorite: false,
    },
    {
      id: "plot7",
      title: "Działka Gołubie",
      price: 149000,
      location: "Gołubie pomorskie",
      size: "1 147 m²",
      image: "/placeholder.svg?height=300&width=400",
      quantity: Math.floor(Math.random() * 3) + 1,
      favorite: false,
    },
    {
      id: "plot8",
      title: "Działka Gołubie",
      price: 400400,
      location: "Gołubie warmińsko-mazurskie",
      size: "40 040 m²",
      image: "/placeholder.svg?height=300&width=400",
      quantity: Math.floor(Math.random() * 3) + 1,
      favorite: false,
    },
    {
      id: "plot9",
      title: "Działka budowlana uzbrojona Gołubie",
      price: 123760,
      location: "Gołubie pomorskie",
      size: "728 m²",
      image: "/placeholder.svg?height=300&width=400",
      quantity: Math.floor(Math.random() * 3) + 1,
      favorite: false,
    },
  ]

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const addToCart = (itemId: string) => {
    setOrderedItems({
      ...orderedItems,
      [itemId]: (orderedItems[itemId] || 0) + 1,
    })
  }

  const buyItem = (itemId: string, price: number) => {
    const item = properties.find((item) => item.id === itemId)
    if (item && balance >= price) {
      setBalance(parseFloat((balance - price).toFixed(2)))
    }
  }

  const toggleFavorite = (itemId: string) => {
    // This doesn't modify state that would trigger the infinite loop
    console.log("Toggle favorite for:", itemId)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MainNavBar
        balance={balance}
        orderedItemsCount={Object.values(orderedItems).reduce((a: number, b: number) => a + (b as number), 0)}
        onAdminClick={() => {
          console.log("Admin button clicked");
        }}
      />

      {/* Nieruchomosci-online header */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/nieruchomosci" className="flex items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-sm"></div>
                <div className="ml-2 font-semibold text-gray-800">nieruchomosci-online.pl</div>
              </Link>
            </div>

            {/* Right side buttons */}
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

          {/* Search filters */}
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
        {/* Listings header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Działki na sprzedaż Gołubie</h1>
            <p className="text-sm text-gray-500">{filteredProperties.length} ogłoszeń</p>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <Button variant="ghost" className="text-sm flex items-center">
              <span>Pokaż na mapie</span>
            </Button>
            <Select defaultValue="najnowszych">
              <SelectTrigger className="w-40 text-sm">
                <SelectValue placeholder="Od najnowszych" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="najnowszych">Od najnowszych</SelectItem>
                <SelectItem value="najtanszych">Od najtańszych</SelectItem>
                <SelectItem value="najdrozszych">Od najdroższych</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Property listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-md overflow-hidden shadow-sm">
              <div className="relative">
                <Image
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
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
                  <Heart className={`h-5 w-5 ${property.favorite ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                </Button>
              </div>

              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">{property.location}</div>
                <h3 className="font-medium mb-2">{property.title}</h3>

                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="font-bold text-lg">{property.price.toLocaleString()} PLN</div>
                    <div className="text-sm">{property.size}</div>
                  </div>
                  <div className="text-sm text-gray-500">Dostępne: {property.quantity} szt.</div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => addToCart(property.id)} variant="outline" className="flex-1">
                    Dodaj do koszyka
                  </Button>
                  <Button
                    onClick={() => buyItem(property.id, property.price)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    disabled={balance < property.price}
                  >
                    Kup teraz
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

