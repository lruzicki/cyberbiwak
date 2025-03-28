"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Truck, Building, Store, Info, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { MainNavBar } from "@/components/main-nav-bar"

export default function Makro() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [cartItems, setCartItems] = useLocalStorage<Record<string, number>>("shop-cart", {})
  const [searchQuery, setSearchQuery] = useState("")

  // Catalogs/Flyers
  const catalogs = [
    {
      id: "catalog1",
      title: "Oferta dla gastronomii",
      dateRange: "18.03.2025 - 31.03.2025",
      image: "/placeholder.svg?height=300&width=250",
      price: 0, // Free catalog
      quantity: 100,
      type: "flyer",
    },
    {
      id: "catalog2",
      title: "Kupujesz więcej płacisz mniej",
      dateRange: "18.03.2025 - 14.04.2025",
      image: "/placeholder.svg?height=300&width=250",
      price: 0,
      quantity: 100,
      type: "flyer",
    },
    {
      id: "catalog3",
      title: "Ulotka udo z kurczaka",
      dateRange: "01.03.2025 - 31.03.2025",
      image: "/placeholder.svg?height=300&width=250",
      price: 0,
      quantity: 100,
      type: "flyer",
    },
    {
      id: "catalog4",
      title: "Meble i grille - katalog produktów dla profesjonalnej Gastronomii 2025",
      dateRange: "01.01.2025 - 31.01.2026",
      image: "/placeholder.svg?height=300&width=250",
      price: 0,
      quantity: 100,
      type: "catalog",
    },
    {
      id: "catalog5",
      title: "Targ MAKRO - oferta świeża w super cenach!",
      dateRange: "Aktualna oferta",
      image: "/placeholder.svg?height=300&width=250",
      price: 0,
      quantity: 100,
      type: "flyer",
    },
    {
      id: "catalog6",
      title: "Katalog produktów dla profesjonalnej Gastronomii 2025",
      dateRange: "Ważne do 31.01.2026",
      image: "/placeholder.svg?height=300&width=250",
      price: 0,
      quantity: 100,
      type: "catalog",
    },
    {
      id: "catalog7",
      title: "Katalog Smart Chef",
      dateRange: "Aktualna oferta",
      image: "/placeholder.svg?height=300&width=250",
      price: 0,
      quantity: 100,
      type: "catalog",
    },
    {
      id: "catalog8",
      title: "Katalog produktów marek własnych dla profesjonalnej Gastronomii 2025",
      dateRange: "Ważne do 28.02.2026",
      image: "/placeholder.svg?height=300&width=250",
      price: 0,
      quantity: 100,
      type: "catalog",
    },
  ]

  // Products
  const products = [
    {
      id: "product1",
      name: "Pomidory w puszce San Marzano",
      price: 14.99,
      image: "/placeholder.svg?height=200&width=200",
      quantity: Math.floor(Math.random() * 46) + 5,
      category: "gastronomy",
    },
    {
      id: "product2",
      name: "Olej rzepakowy 5L",
      price: 58.99,
      image: "/placeholder.svg?height=200&width=200",
      quantity: Math.floor(Math.random() * 46) + 5,
      category: "gastronomy",
    },
    {
      id: "product3",
      name: "Mąka pszenna typ 500 25kg",
      price: 89.99,
      image: "/placeholder.svg?height=200&width=200",
      quantity: Math.floor(Math.random() * 46) + 5,
      category: "gastronomy",
    },
    {
      id: "product4",
      name: "Udo z kurczaka 5kg",
      price: 65.99,
      image: "/placeholder.svg?height=200&width=200",
      quantity: Math.floor(Math.random() * 46) + 5,
      category: "gastronomy",
    },
    {
      id: "product5",
      name: "Schab wieprzowy b/k 1kg",
      price: 18.99,
      image: "/placeholder.svg?height=200&width=200",
      quantity: Math.floor(Math.random() * 46) + 5,
      category: "gastronomy",
    },
    {
      id: "product6",
      name: "Filet z kurczaka 1kg",
      price: 12.99,
      image: "/placeholder.svg?height=200&width=200",
      quantity: Math.floor(Math.random() * 46) + 5,
      category: "gastronomy",
    },
    {
      id: "product7",
      name: "Wołowina antrykot 1kg",
      price: 36.99,
      image: "/placeholder.svg?height=200&width=200",
      quantity: Math.floor(Math.random() * 46) + 5,
      category: "gastronomy",
    },
    {
      id: "product8",
      name: "Filet z indyka 1kg",
      price: 42.99,
      image: "/placeholder.svg?height=200&width=200",
      quantity: Math.floor(Math.random() * 46) + 5,
      category: "gastronomy",
    },
  ]

  const filteredCatalogs = catalogs.filter((catalog) => catalog.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const addToCart = (itemId: string) => {
    setCartItems({
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1,
    })
  }

  const buyItem = (itemId: string, price: number) => {
    const item = [...products, ...catalogs].find((item) => item.id === itemId)
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

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 py-3 text-sm">
            <Link href="#" className="flex items-center text-blue-900 font-medium">
              <Truck className="h-4 w-4 mr-1" />
              <span>Zamów z dostawą</span>
            </Link>
            <Link href="#" className="flex items-center text-blue-900 font-medium">
              <FileText className="h-4 w-4 mr-1" />
              <span>Gazetki i promocje</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Link href="#" className="text-blue-900 text-sm hover:underline">
            Gazetki i promocje
          </Link>
        </div>

        {/* Main content */}
        <div className="bg-white p-6 rounded-md shadow-sm mb-8">
          <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">GAZETKI I PROMOCJE DLA GASTRONOMII</h1>

          <Tabs defaultValue="halls">
            <TabsList className="mb-6 border-b w-full justify-start rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="halls"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-900 data-[state=active]:bg-transparent text-gray-700 data-[state=active]:text-blue-900 pb-2 px-4"
              >
                W halach (10)
              </TabsTrigger>
              <TabsTrigger
                value="delivery"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-900 data-[state=active]:bg-transparent text-gray-700 data-[state=active]:text-blue-900 pb-2 px-4"
              >
                W dostawie (7)
              </TabsTrigger>
              <TabsTrigger
                value="flyers"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-900 data-[state=active]:bg-transparent text-gray-700 data-[state=active]:text-blue-900 pb-2 px-4"
              >
                Ulotki (10)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="halls" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCatalogs.map((catalog) => (
                  <Card key={catalog.id} className="overflow-hidden border-none shadow-md">
                    <div className="relative">
                      <Image
                        src={catalog.image || "/placeholder.svg"}
                        alt={catalog.title}
                        width={250}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-medium">{catalog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-sm text-gray-500">{catalog.dateRange}</p>
                      <p className="text-sm mt-2">Dostępna ilość: {catalog.quantity}</p>
                    </CardContent>
                    <CardFooter className="p-4 flex gap-2">
                      <Button
                        onClick={() => addToCart(catalog.id)}
                        variant="outline"
                        className="flex-1 border-blue-900 text-blue-900 hover:bg-blue-50"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Dodaj do koszyka
                      </Button>
                      <Button
                        onClick={() => buyItem(catalog.id, catalog.price)}
                        className="flex-1 bg-blue-900 hover:bg-blue-800"
                      >
                        Pobierz
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCatalogs
                  .filter((c) => c.type === "flyer")
                  .map((catalog) => (
                    <Card key={catalog.id} className="overflow-hidden border-none shadow-md">
                      <div className="relative">
                        <Image
                          src={catalog.image || "/placeholder.svg"}
                          alt={catalog.title}
                          width={250}
                          height={300}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base font-medium">{catalog.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 pb-2">
                        <p className="text-sm text-gray-500">{catalog.dateRange}</p>
                        <p className="text-sm mt-2">Dostępna ilość: {catalog.quantity}</p>
                      </CardContent>
                      <CardFooter className="p-4 flex gap-2">
                        <Button
                          onClick={() => addToCart(catalog.id)}
                          variant="outline"
                          className="flex-1 border-blue-900 text-blue-900 hover:bg-blue-50"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Dodaj do koszyka
                        </Button>
                        <Button
                          onClick={() => buyItem(catalog.id, catalog.price)}
                          className="flex-1 bg-blue-900 hover:bg-blue-800"
                        >
                          Pobierz
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="flyers" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCatalogs
                  .filter((c) => c.type === "flyer")
                  .map((catalog) => (
                    <Card key={catalog.id} className="overflow-hidden border-none shadow-md">
                      <div className="relative">
                        <Image
                          src={catalog.image || "/placeholder.svg"}
                          alt={catalog.title}
                          width={250}
                          height={300}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base font-medium">{catalog.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 pb-2">
                        <p className="text-sm text-gray-500">{catalog.dateRange}</p>
                        <p className="text-sm mt-2">Dostępna ilość: {catalog.quantity}</p>
                      </CardContent>
                      <CardFooter className="p-4 flex gap-2">
                        <Button
                          onClick={() => addToCart(catalog.id)}
                          variant="outline"
                          className="flex-1 border-blue-900 text-blue-900 hover:bg-blue-50"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Dodaj do koszyka
                        </Button>
                        <Button
                          onClick={() => buyItem(catalog.id, catalog.price)}
                          className="flex-1 bg-blue-900 hover:bg-blue-800"
                        >
                          Pobierz
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Products section */}
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-bold text-blue-900 mb-6">Produkty dla gastronomii</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border-none shadow-md">
                <div className="p-4">
                  <div className="aspect-square relative mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mb-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-baseline mt-1">
                      <span className="text-xl font-bold text-red-600">{product.price.toFixed(2)}</span>
                      <span className="text-xs ml-1">PLN</span>
                    </div>
                  </div>
                  <div className="text-sm mb-4">Dostępna ilość: {product.quantity}</div>
                </div>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    onClick={() => addToCart(product.id)}
                    variant="outline"
                    className="flex-1 border-blue-900 text-blue-900 hover:bg-blue-50"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Dodaj do koszyka
                  </Button>
                  <Button
                    onClick={() => buyItem(product.id, product.price)}
                    className="flex-1 bg-blue-900 hover:bg-blue-800"
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

