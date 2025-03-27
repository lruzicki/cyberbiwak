"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Axe, Wheat, TreesIcon as Tree, Map } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { MainNavBar } from "@/components/main-nav-bar"

// Define the item type
interface Item {
  id: string
  name: string
  price: number
  sellPrice: number
  image: string
  category: string
}

export default function Shop() {
  const router = useRouter()
  const [balance, setBalance] = useLocalStorage("shop-balance", 5000)
  const [inventory, setInventory] = useLocalStorage("shop-inventory", {})
  const [cartItems, setCartItems] = useLocalStorage("shop-cart", {})
  const [purchaseHistory, setPurchaseHistory] = useLocalStorage("purchase-history", [])

  // Item categories with their products
  const categories = {
    wood: [
      {
        id: "sosna",
        name: "Sosna",
        price: 50,
        sellPrice: 40,
        image: "/placeholder.svg?height=100&width=100",
        category: "wood",
      },
      {
        id: "swierk",
        name: "Świerk",
        price: 45,
        sellPrice: 36,
        image: "/placeholder.svg?height=100&width=100",
        category: "wood",
      },
      {
        id: "buk",
        name: "Buk",
        price: 70,
        sellPrice: 56,
        image: "/placeholder.svg?height=100&width=100",
        category: "wood",
      },
      {
        id: "dab",
        name: "Dąb",
        price: 85,
        sellPrice: 68,
        image: "/placeholder.svg?height=100&width=100",
        category: "wood",
      },
    ],
    ground: [
      {
        id: "05ha",
        name: "Działka 0,5 ha",
        price: 200000,
        sellPrice: 180000,
        image: "/placeholder.svg?height=100&width=100",
        category: "ground",
      },
      {
        id: "07ha",
        name: "Działka 0,7 ha",
        price: 280000,
        sellPrice: 252000,
        image: "/placeholder.svg?height=100&width=100",
        category: "ground",
      },
      {
        id: "1ha",
        name: "Działka 1 ha",
        price: 400000,
        sellPrice: 360000,
        image: "/placeholder.svg?height=100&width=100",
        category: "ground",
      },
      {
        id: "14ha",
        name: "Działka 1,4 ha",
        price: 560000,
        sellPrice: 504000,
        image: "/placeholder.svg?height=100&width=100",
        category: "ground",
      },
    ],
    food: [
      {
        id: "woda",
        name: "Woda",
        price: 2,
        sellPrice: 1,
        image: "/placeholder.svg?height=100&width=100",
        category: "food",
      },
      {
        id: "chleb",
        name: "Chleb",
        price: 5,
        sellPrice: 3,
        image: "/placeholder.svg?height=100&width=100",
        category: "food",
      },
      {
        id: "truskawki",
        name: "Truskawki",
        price: 15,
        sellPrice: 10,
        image: "/placeholder.svg?height=100&width=100",
        category: "food",
      },
      {
        id: "jagody",
        name: "Jagody",
        price: 20,
        sellPrice: 15,
        image: "/placeholder.svg?height=100&width=100",
        category: "food",
      },
      {
        id: "wieprzowina",
        name: "Wieprzowina",
        price: 30,
        sellPrice: 24,
        image: "/placeholder.svg?height=100&width=100",
        category: "food",
      },
      {
        id: "ryby",
        name: "Ryby",
        price: 40,
        sellPrice: 32,
        image: "/placeholder.svg?height=100&width=100",
        category: "food",
      },
      {
        id: "kurczaki",
        name: "Kurczaki",
        price: 25,
        sellPrice: 20,
        image: "/placeholder.svg?height=100&width=100",
        category: "food",
      },
    ],
    tools: [
      {
        id: "narzedzia",
        name: "Narzędzia",
        price: 100,
        sellPrice: 80,
        image: "/placeholder.svg?height=100&width=100",
        category: "tools",
      },
    ],
  }

  // Flatten all items for easier access
  const allItems = Object.values(categories).flat()

  const buyItem = (itemId: string, price: number) => {
    if (balance >= price) {
      // Find the item
      const item = allItems.find((item) => item.id === itemId)
      if (!item) return

      // Update balance
      setBalance(balance - price)

      // Update inventory
      setInventory({
        ...inventory,
        [itemId]: (inventory[itemId] || 0) + 1,
      })

      // Add to purchase history
      setPurchaseHistory([
        ...purchaseHistory,
        {
          id: Date.now(),
          itemId,
          itemName: item.name,
          price,
          quantity: 1,
          date: new Date().toISOString(),
          category: item.category,
        },
      ])
    }
  }

  const sellItem = (itemId: string, price: number) => {
    if (inventory[itemId] && inventory[itemId] > 0) {
      setBalance(balance + price)
      setInventory({
        ...inventory,
        [itemId]: inventory[itemId] - 1,
      })
    }
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

  // Calculate total spent by category
  const calculateTotalsByCategory = () => {
    const totals = {
      wood: 0,
      ground: 0,
      food: 0,
      tools: 0,
    }

    purchaseHistory.forEach((purchase) => {
      if (purchase.category) {
        totals[purchase.category] += purchase.price
      }
    })

    return totals
  }

  // Get summary of purchased items
  const getPurchaseSummary = () => {
    const summary = {}

    purchaseHistory.forEach((purchase) => {
      if (!summary[purchase.itemId]) {
        summary[purchase.itemId] = {
          name: purchase.itemName,
          quantity: 0,
          totalSpent: 0,
          category: purchase.category,
        }
      }

      summary[purchase.itemId].quantity += purchase.quantity
      summary[purchase.itemId].totalSpent += purchase.price
    })

    return Object.values(summary)
  }

  const categoryTotals = calculateTotalsByCategory()
  const purchaseSummary = getPurchaseSummary()
  const totalSpent = purchaseHistory.reduce((total, purchase) => total + purchase.price, 0)

  return (
    <div>
      <MainNavBar
        balance={balance}
        cartItemsCount={Object.values(cartItems).reduce((a: number, b: number) => a + (b as number), 0)}
      />

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Trading Post</h1>
          <Card className="w-full md:w-auto">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Your Balance:</span>
                <Badge variant="outline" className="ml-2 text-lg">
                  {balance} PLN
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Status Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
            <CardDescription>Overview of your purchases and inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Tree className="h-4 w-4 mr-2" />
                      <span>Wood</span>
                    </div>
                    <span>{categoryTotals.wood} PLN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Map className="h-4 w-4 mr-2" />
                      <span>Ground</span>
                    </div>
                    <span>{categoryTotals.ground} PLN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Wheat className="h-4 w-4 mr-2" />
                      <span>Food</span>
                    </div>
                    <span>{categoryTotals.food} PLN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Axe className="h-4 w-4 mr-2" />
                      <span>Tools</span>
                    </div>
                    <span>{categoryTotals.tools} PLN</span>
                  </div>
                  <div className="flex justify-between items-center font-bold pt-2 border-t">
                    <span>Total Spent</span>
                    <span>{totalSpent} PLN</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Items Purchased</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {purchaseSummary.length > 0 ? (
                    purchaseSummary.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getCategoryIcon(item.category)}
                          <span className="ml-2">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div>{item.quantity} units</div>
                          <div className="text-sm text-gray-500">{item.totalSpent} PLN</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No purchases yet</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getCategoryIcon(category)} {item.name}
                      </CardTitle>
                      <CardDescription>
                        Buy: {item.price} PLN | Sell: {item.sellPrice} PLN
                      </CardDescription>
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
                    </CardContent>
                    <CardFooter className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center w-full">
                        <span>In inventory: {getInventoryCount(item.id)}</span>
                      </div>
                      <div className="flex gap-2 w-full">
                        <Button
                          onClick={() => buyItem(item.id, item.price)}
                          className="flex-1"
                          disabled={balance < item.price}
                        >
                          Buy
                        </Button>
                        <Button
                          onClick={() => sellItem(item.id, item.sellPrice)}
                          variant="outline"
                          className="flex-1"
                          disabled={getInventoryCount(item.id) <= 0}
                        >
                          Sell
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

