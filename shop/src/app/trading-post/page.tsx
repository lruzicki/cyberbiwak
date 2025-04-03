"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Axe, Wheat, TreesIcon as Tree, Map } from "lucide-react"
import Image from "next/image"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useEffect, useState } from "react"
import { categories } from "@/products/products"
import { roundData, Round } from "@/products/round-data"
import { MainNavBar } from "@/components/main-nav-bar"
import { useTimer } from "@/utils/use-timer"
import { getCurrentPrice, getRemainingQuantity, getInventoryCount } from "@/utils/products-actions" // Import the reusable functions
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js"
import zoomPlugin from "chartjs-plugin-zoom"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, zoomPlugin)

export default function TradingPost() {
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [inventory, setInventory] = useLocalStorage<Record<string, number>>("shop-inventory", { "buk": 3 })
  const [orderedItems, setOrderedItems] = useLocalStorage<Record<string, number>>("shop-ordered-items", {})
  const [timerActive, setTimerActive] = useLocalStorage("shop-timer-active", false)
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() +75 * 60 * 1000)
  const [rounds, setRounds] = useState<Round[]>([])
  const [purchasedInRound, setPurchasedInRound] = useLocalStorage<Record<number, Record<string, number>>>("purchased-in-round", {})
  const [showAdminModal, setShowAdminModal] = useState(false)

  const allItems = Object.values(categories).flat()

  const { isLoaded, timeRemaining, setTimeRemaining, currentRound } = useTimer({
    initialTargetTime: targetTime,
    timerActive,
    totalRounds: 7,
    onTimerEnd: () => setTimerActive(false),
    updateTargetTime: setTargetTime,
  })

  useEffect(() => {
    setRounds(roundData)
  }, [])

  const getPriceHistory = (itemId: string) => {
    // Mock price history for demonstration purposes
    return Array.from({ length: currentRound }, (_, i) => getCurrentPrice(itemId, i + 1))
  }

  const renderGraphs = (itemId: string) => {
    const priceHistory = getPriceHistory(itemId);
    const quantityHistory = Array.from({ length: currentRound }, (_, i) =>
      getRemainingQuantity(itemId, i + 1, purchasedInRound)
    );

    const priceData = {
      labels: priceHistory.map((_, index) => `${index + 1}`),
      datasets: [
        {
          label: "Price",
          data: priceHistory,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    };

    const quantityData = {
      labels: quantityHistory.map((_, index) => `${index + 1}`),
      datasets: [
        {
          label: "Quantity",
          data: quantityHistory,
          borderColor: "rgba(192, 75, 75, 1)",
          backgroundColor: "rgba(192, 75, 75, 0.2)",
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            display: true, // Show x-axis ticks (rounds)
          },
          grid: {
            drawTicks: true, // Draw gridlines for x-axis
          },
        },
        y: {
          ticks: {
            display: true, // Show y-axis ticks (values)
          },
          grid: {
            drawTicks: true, // Draw gridlines for y-axis
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Hide legend
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x" as const, // Allow panning on the x-axis
          },
          zoom: {
            wheel: {
              enabled: true, // Enable zooming with the mouse wheel
            },
            pinch: {
              enabled: true, // Enable zooming with pinch gestures
            },
            mode: "x" as const, // Allow zooming on the x-axis
          },
        },
      },
    };

    return (
      <div className="flex gap-8 h-20 px-30">
        {/* Price Graph */}
        <div className="w-32 h-20 group transition-all duration-100 hover:z-40 px-20">
          <div className="z-40 group-hover:w-100 group-hover:h-75 w-32 h-20 transition-all duration-100 bg-white rounded-md shadow-md p-2">
            <Line data={priceData} options={options} />
          </div>
        </div>

        {/* Quantity Graph */}
        <div className="w-32 h-20 group transition-all duration-100 hover:z-40 px-20">
          <div className="z-40 group-hover:w-100 group-hover:h-75 w-32 h-20 transition-all duration-100 bg-white rounded-md shadow-md p-2">
            <Line data={quantityData} options={options} />
          </div>
        </div>
      </div>
    );
  };

  const renderItemList = (items: typeof allItems) => (
    <div>
      {/* Headers for Price and Quantity */}
      <div className="flex justify-between items-center mb-4 justify-end px-30">
        <div className="flex gap-8">
          <h4 className="text-sm font-bold text-center">Price</h4>
          <h4 className="text-sm font-bold text-center px-30">Quantity</h4>
        </div>
      </div>

      {/* List of Items */}
      <ul className="divide-y divide-gray-200">
        {items.map((item) => {
          const currentPrice = getCurrentPrice(item.id, currentRound);
          const remainingQuantity = getRemainingQuantity(item.id, currentRound, purchasedInRound);

          return (
            <li key={item.id} className="flex justify-between items-center py-4">
              {/* Image and Details */}
              <div className="flex items-center gap-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">Price: {currentPrice} PLN</p>
                  <p className="text-sm">
                    Base stock:{" "}
                    {(() => {
                      const currentRoundData = roundData.find((r) => r.number === currentRound);
                      if (!currentRoundData) return 0;
                      return currentRoundData.maxPurchases[item.id] || 0;
                    })()}{" "}
                    units
                  </p>
                </div>
              </div>

              {/* Graphs */}
              <div className="flex items-center gap-4">
                {renderGraphs(item.id)}
                <p className="text-sm">In inventory: {getInventoryCount(item.id, inventory)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <MainNavBar
        balance={balance}
        setBalance={setBalance}
        orderedItemsCount={Object.values(orderedItems).reduce((a: number, b: number) => a + (b as number), 0)}
        currentRound={currentRound}
        timeRemaining={timeRemaining}
        onAdminClick={() => setShowAdminModal(true)}
        timerActive={timerActive}
      />

      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2 cursor-pointer">
              All
            </TabsTrigger>
            <TabsTrigger value="wood" className="flex items-center gap-2 cursor-pointer">
              <Tree className="h-4 w-4" /> Wood
            </TabsTrigger>
            <TabsTrigger value="ground" className="flex items-center gap-2 cursor-pointer">
              <Map className="h-4 w-4" /> Ground
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-2 cursor-pointer">
              <Wheat className="h-4 w-4" /> Food
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2 cursor-pointer">
              <Axe className="h-4 w-4" /> Tools
            </TabsTrigger>
          </TabsList>

          {/* All Items */}
          <TabsContent value="all" className="mt-0">
            <h2 className="text-xl font-bold mb-4">All Items</h2>
            {renderItemList(allItems)}
          </TabsContent>

          {/* Category-Specific Items */}
          {Object.entries(categories).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <h2 className="text-xl font-bold mb-4">{category.charAt(0).toUpperCase() + category.slice(1)} Items</h2>
              {renderItemList(items)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}