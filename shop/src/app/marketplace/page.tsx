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

export default function Marketplace() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [cartItems, setCartItems] = useLocalStorage<Record<string, number>>("shop-cart", {})
  const [searchQuery, setSearchQuery] = useState("")

  // Marketplace listings
  const listings = [
    {
      id: "wood1",
      title: "Drewno Kominkowe Opałowe",
      price: 250,
      location: "Wołomin",
      date: "Odświeżono dnia 22 marca 2025",
      image: "/placeholder.svg?height=200&width=200",
      featured: true,
      quantity: Math.floor(Math.random() * 46) + 5, // Random between 5-50
    },
    {
      id: "wood2",
      title: "Drewno opałowe, kominkowe - wałki",
      price: 160,
      location: "Piła",
      date: "Odświeżono dnia 21 marca 2025",
      image: "/placeholder.svg?height=200&width=200",
      featured: true,
      quantity: Math.floor(Math.random() * 46) + 5,
    },
    {
      id: "wood3",
      title: "Drewno sezonowane kominkowe opałowe z dowozem",
      price: 185,
      location: "Ostrów Wielkopolski",
      date: "Odświeżono dnia 22 marca 2025",
      image: "/placeholder.svg?height=200&width=200",
      featured: true,
      quantity: Math.floor(Math.random() * 46) + 5,
    },
    {
      id: "wood4",
      title: "Okazja? Drewno - świerk, brzoza",
      price: 800,
      location: "Inwałd",
      date: "Dzisiaj o 07:56",
      image: "/placeholder.svg?height=200&width=200",
      featured: false,
      quantity: Math.floor(Math.random() * 46) + 5,
    },
    {
      id: "wood5",
      title: "Drewno orzech włoski",
      price: 650,
      location: "Marianka",
      date: "Dzisiaj o 12:52",
      image: "/placeholder.svg?height=200&width=200",
      featured: false,
      quantity: Math.floor(Math.random() * 46) + 5,
    },
    {
      id: "wood6",
      title: "Drewno bukowe premium",
      price: 320,
      location: "Kraków",
      date: "Odświeżono dnia 20 marca 2025",
      image: "/placeholder.svg?height=200&width=200",
      featured: false,
      quantity: Math.floor(Math.random() * 46) + 5,
    },
  ]

  const filteredListings = listings.filter((listing) => listing.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const addToCart = (itemId: string) => {
    setCartItems({
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1,
    })
  }

  const buyItem = (itemId: string, price: number) => {
    const item = listings.find((item) => item.id === itemId)
    if (item && balance >= price) {
      setBalance(balance - price)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MainNavBar
        balance={balance}
        cartItemsCount={Object.values(cartItems).reduce((a: number, b: number) => a + (b as number), 0)}
        onAdminClick={() => {
          console.log("Admin button clicked");
        }}
      />

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Znaleźliśmy ponad {listings.length} ogłoszeń</h1>
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

