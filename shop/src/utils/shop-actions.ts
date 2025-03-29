import { toast } from "sonner"

export const handleBuy = (
  itemId: string,
  itemName: string,
  price: number,
  category: string,
  currentRound: number,
  balance: number,
  setBalance: (value: number) => void,
  inventory: Record<string, number>,
  setInventory: (value: Record<string, number>) => void,
  purchasedInRound: Record<number, Record<string, number>>,
  setPurchasedInRound: (value: Record<number, Record<string, number>>) => void,
  purchaseHistory: Array<{
    id: number
    itemId: string
    itemName: string
    price: number
    quantity: number
    date: string
    category: string
    round: number
  }>,
  setPurchaseHistory: (value: typeof purchaseHistory) => void,
  remainingQuantity: number,
  quantity: number
) => {
  if (isNaN(quantity) || quantity <= 0) {
    toast.error("Invalid quantity. Please enter a positive number.")
    return
  }

  const maxAffordableQuantity = Math.floor(balance / price)
  const purchasableQuantity = Math.min(quantity, remainingQuantity, maxAffordableQuantity)

  if (purchasableQuantity > 0) {
    setBalance(parseFloat((balance - price * purchasableQuantity).toFixed(2)))
    setInventory({
      ...inventory,
      [itemId]: (inventory[itemId] || 0) + purchasableQuantity,
    })
    setPurchasedInRound({
      ...purchasedInRound,
      [currentRound]: {
        ...purchasedInRound[currentRound],
        [itemId]: (purchasedInRound[currentRound]?.[itemId] || 0) + purchasableQuantity,
      },
    })
    setPurchaseHistory([
      ...purchaseHistory,
      {
        id: Date.now(),
        itemId,
        itemName,
        price,
        quantity: purchasableQuantity,
        date: new Date().toISOString(),
        category,
        round: currentRound,
      },
    ])
    toast.success(`You bought ${purchasableQuantity} ${itemName}(s) for ${price * purchasableQuantity} PLN.`)
  } else {
    toast.error("You don't have enough balance or the item is out of stock.")
  }
}

export const handleOrder = (
  itemId: string,
  itemName: string,
  price: number,
  orderedItems: Record<string, number>,
  setOrderedItems: (value: Record<string, number>) => void
) => {
  const quantity = parseInt(prompt(`How many ${itemName} would you like to order?`, "1") || "0", 10)

  if (isNaN(quantity) || quantity <= 0) {
    toast.error("Invalid quantity. Please enter a positive number.")
    return
  }

  setOrderedItems({
    ...orderedItems,
    [itemId]: (orderedItems[itemId] || 0) + quantity,
  })

  toast.success(`You ordered ${quantity} ${itemName}(s) for ${price * quantity} PLN.`)
}