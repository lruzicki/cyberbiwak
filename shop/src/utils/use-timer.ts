import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { roundData } from "@/products/round-data" // Import round data
import { handleBuy } from "@/utils/shop-actions"

interface UseTimerOptions {
  initialTargetTime: number
  timerActive: boolean
  totalRounds: number // Total number of rounds
  onTimerEnd?: () => void
  updateTargetTime: (newTargetTime: number) => void // Callback to update targetTime in local storage
}

export const useTimer = ({ initialTargetTime, timerActive, totalRounds, onTimerEnd, updateTargetTime }: UseTimerOptions) => {
  const [isLoaded, setIsLoaded] = useState(false) // Add a loading state
  const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 70 * 60 * 1000)
  const [currentRound, setCurrentRound] = useLocalStorage("shop-current-round", 0)
  const [timeRemaining, setTimeRemaining] = useLocalStorage("shop-time-remaining", Math.max(0, Math.ceil((initialTargetTime - Date.now()) / 1000))) // Time left in seconds
  const [balance, setBalance] = useLocalStorage("shop-balance", 10000)
  const [orderedItems, setOrderedItems] = useLocalStorage<Record<string, number>>("shop-ordered-items", {})
  const [inventory, setInventory] = useLocalStorage<Record<string, number>>("shop-inventory", {})
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
    const totalTime = 70 * 60 // Total time in seconds (70 minutes)
    const roundDuration = totalTime / totalRounds // Duration of each round in seconds
    const elapsedTime = totalTime - timeRemaining // Time elapsed in seconds
    return Math.min(totalRounds, Math.max(Math.ceil(elapsedTime / roundDuration), 0)) // Calculate the current round
  }

  const getRemainingQuantity = (itemId: string) => {
    const maxPurchases = roundData[currentRound]?.maxPurchases?.[itemId] || 0
    const alreadyPurchased = purchasedInRound[currentRound]?.[itemId] || 0
    return Math.max(0, maxPurchases - alreadyPurchased)
  }

  const getCurrentPrice = (itemId: string) => {
    const currentRoundData = roundData[currentRound]
    if (!currentRoundData) return 0
    return currentRoundData.prices[itemId] || 0
  }

  const purchaseOrderedProducts = (newRound: number) => {
    Object.entries(orderedItems).forEach(([itemId, quantity]) => {
      handleBuy(
        itemId,
        itemId, // Use itemId as the name if no name is available
        getCurrentPrice(itemId),
        "unknown", // Replace with the actual category if available
        newRound,
        balance,
        setBalance,
        inventory,
        setInventory,
        purchasedInRound,
        setPurchasedInRound,
        purchaseHistory,
        setPurchaseHistory,
        getRemainingQuantity(itemId),
        quantity
      )
    })

    toast.success("All ordered products purchased for the new round!")
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(calculateTimeLeft())
        const newRound = calculateCurrentRound()
        if (newRound !== currentRound) {
          console.log(`Round ${newRound}!`)
          setCurrentRound(newRound)
          if (newRound > 1) {
            purchaseOrderedProducts(newRound)
            setOrderedItems({})
            setTimeout(() => {
              toast.info("Round updated!", {
                description: `You are now in round ${newRound + 1}.`,
              });
              window.location.reload();
            }, 3000);
          }
        }
      }, 1000)
    } else if (timerActive && timeRemaining === 0) {
      if (onTimerEnd) onTimerEnd()
      toast.error("Game Over!", {
        description: "The countdown has ended.",
      })
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