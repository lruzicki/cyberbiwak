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
  remainingQuantity: number
) => {
  if (currentRound !== 1) {
    toast.error("You can only buy products in the first round.")
    return
  }

  if (balance >= price && remainingQuantity > 0) {
    setBalance(parseFloat((balance - price).toFixed(2)))
    setInventory({
      ...inventory,
      [itemId]: (inventory[itemId] || 0) + 1,
    })
    setPurchasedInRound({
      ...purchasedInRound,
      [currentRound]: {
        ...purchasedInRound[currentRound],
        [itemId]: (purchasedInRound[currentRound]?.[itemId] || 0) + 1,
      },
    })
    setPurchaseHistory([
      ...purchaseHistory,
      {
        id: Date.now(),
        itemId,
        itemName,
        price,
        quantity: 1,
        date: new Date().toISOString(),
        category,
        round: currentRound,
      },
    ])
    toast.success(`You bought 1 ${itemName} for ${price} PLN.`)
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