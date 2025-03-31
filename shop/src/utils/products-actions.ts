import { Round } from "@/products/round-data"
import { categories } from "@/products/products"
import { roundData } from "@/products/round-data"

export const getCurrentPrice = (itemId: string, currentRound: number): number => {
  const currentRoundData = roundData[currentRound - 1]
  if (!currentRoundData) return 0
  return currentRoundData.prices[itemId] || 0
}

export const getRemainingQuantity = (
  itemId: string,
  currentRound: number,
  purchasedInRound: Record<number, Record<string, number>>
): number => {
  const currentRoundData = roundData.find((r) => r.number === currentRound)
  if (!currentRoundData) return 0
  const maxPurchases = currentRoundData.maxPurchases[itemId] || 0
  const alreadyPurchased = purchasedInRound[currentRound]?.[itemId] || 0
  return Math.max(0, maxPurchases - alreadyPurchased)
}

export const getInventoryCount = (itemId: string, inventory: Record<string, number>): number => {
  return inventory[itemId] || 0
}


export const getItemInfo = (productId: string) => {
    for (const category of Object.values(categories)) {
        const product = category.find((item) => item.id === productId);
        if (product) {
            return product;
        }
    }
    return null;
};