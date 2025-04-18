import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { handleBuy } from "@/utils/shop-actions"
import { getRemainingQuantity, getCurrentPrice, getItemInfo } from "@/utils/products-actions" // Import reusable functions

interface UseTimerOptions {
  initialTargetTime: number
  timerActive: boolean
  totalRounds: number // Total number of rounds
  onTimerEnd?: () => void
  updateTargetTime: (newTargetTime: number) => void // Callback to update targetTime in local storage
}

export const useTimer = ({ initialTargetTime, timerActive, totalRounds, onTimerEnd, updateTargetTime }: UseTimerOptions) => {
  const [isLoaded, setIsLoaded] = useState(false) // Add a loading state
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 75 * 60 * 1000)
  const [currentRound, setCurrentRound] = useLocalStorage("shop-current-round", 0)
  const [timeRemaining, setTimeRemaining] = useLocalStorage("shop-time-remaining", Math.max(0, Math.ceil((initialTargetTime - Date.now()) / 1000))) // Time left in seconds
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [orderedItems, setOrderedItems] = useLocalStorage<Record<string, number>>("shop-ordered-items", {})
  const [inventory, setInventory] = useLocalStorage<Record<string, number>>("shop-inventory", { "buk": 3 })
  const [purchasedInRound, setPurchasedInRound] = useLocalStorage<Record<number, Record<string, number>>>("purchased-in-round", {})
  const [purchaseHistory, setPurchaseHistory] = useLocalStorage<{ id: number; itemId: string; itemName: string; price: number; quantity: number; date: string; category: string; round: number; }[]>("shop-purchase-history", [])

  useEffect(() => {
    // Wait for local storage values to load before rendering
    if (currentRound !== 0) {
      setIsLoaded(true)
    }
  }, [targetTime, currentRound, balance])

  const calculateTimeLeft = () => {
    const now = Date.now()
    return Math.max(0, Math.ceil((targetTime - now) / 1000)) // Time left in seconds
  }

  const calculateCurrentRound = () => {
    const totalTime = 75 * 60 // Total time in seconds (75 minutes)
    const roundDuration = 10 * 60 // Duration of each round in seconds
    const elapsedTime = totalTime - timeRemaining // Time elapsed in seconds
    if (timeRemaining <= 5 * 60) {
      return 8 // If time is up, return the last round
    }
    return Math.min(totalRounds, Math.max(Math.ceil(elapsedTime / roundDuration), 0)) // Calculate the current round
  }

  const purchaseOrderedProducts = (newRound: number) => {
    let inventoryCopy = { ...inventory }
    let balanceCopy = balance
    let purchasedInRoundCopy = { ...purchasedInRound }
    let purchaseHistoryCopy = [...purchaseHistory]
    Object.entries(orderedItems).forEach(([itemId, quantity]) => {
      const itemInfo = getItemInfo(itemId) // Assuming getItemInfo returns an object with item details
      if (!itemInfo) {
        console.error(`Item info not found for itemId: ${itemId}`)
        return
      }
      const { name, category } = itemInfo
      const {       
        updatedInventory,
        updatedBalance,
        updatedPurchasedInRound,
        updatedPurchaseHistory } = handleBuy(
        itemId,
        name, // Use the name from itemInfo
        getCurrentPrice(itemId, newRound), // Use getCurrentPrice from products-actions.ts
        category, // Use the category from itemInfo
        newRound,
        balanceCopy,
        setBalance,
        inventoryCopy,
        setInventory, // Merge new inventory with existing inventory
        purchasedInRoundCopy,
        setPurchasedInRound,
        purchaseHistoryCopy,
        setPurchaseHistory,
        getRemainingQuantity(itemId, newRound, purchasedInRoundCopy), // Use getRemainingQuantity from products-actions.ts
        quantity,
        true
      )
      inventoryCopy = updatedInventory // Update inventoryCopy with the new inventory
      balanceCopy = updatedBalance
      purchasedInRoundCopy = updatedPurchasedInRound
      purchaseHistoryCopy = updatedPurchaseHistory
    })
    setInventory(inventoryCopy)
    setBalance(balanceCopy)
    setPurchasedInRound(purchasedInRoundCopy)
    setPurchaseHistory(purchaseHistoryCopy)
    toast.success("All ordered products purchased for the new round!")
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(calculateTimeLeft())
        const newRound = calculateCurrentRound()
        if (newRound !== currentRound) {
          setCurrentRound(newRound)
          if (newRound > 1) {
            purchaseOrderedProducts(newRound)
            setTimeout(() => {
              toast.info("Round updated!", {
                description: `You are now in round ${newRound}.`,
              })
              setOrderedItems({})
              window.location.reload()
            }, 3000)
          }
        }
      }, 1000)
    } else if (timerActive && timeRemaining === 0) {
      if (onTimerEnd) onTimerEnd()
      toast.error("Game Over!", {
        description: "The countdown has ended.",
      })
      const downloadData = () => {
        const formattedInventory = Object.entries(inventory).reduce((acc, [key, value]) => {
          acc.push(`${key}: ${value}`)
          return acc
        }, [] as string[]).join("\n")

        const data = `Inventory:\n${formattedInventory}\n\nBalance: ${balance}`
        const blob = new Blob([data], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "inventory_balance.txt"
        a.click()
        URL.revokeObjectURL(url)

      }

      downloadData()
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/"
        }
      }, 3000)
    } else if (!timerActive) {
      interval = setInterval(() => {
        setTargetTime((prevTargetTime) => prevTargetTime + 1000)
        setCurrentRound(calculateCurrentRound())
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timeRemaining, targetTime, currentRound, onTimerEnd])

  const updateTimeRemaining = (newTimeRemaining: number) => {
    const newTargetTime = Date.now() + newTimeRemaining * 1000
    setTimeRemaining(newTimeRemaining)
    setTargetTime(newTargetTime)
    updateTargetTime(newTargetTime)
  }

  return { isLoaded, timeRemaining, setTimeRemaining: updateTimeRemaining, setTargetTime, currentRound }
}