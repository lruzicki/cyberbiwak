import { Round } from "@/products/round-data"

export const getCurrentPrice = (itemId: string, currentRound: number, rounds: Round[]): number => {
  const currentRoundData = rounds.find((r) => r.number === currentRound)
  if (!currentRoundData) return 0
  return currentRoundData.prices[itemId] || 0
}

export const getRemainingQuantity = (
  itemId: string,
  currentRound: number,
  rounds: Round[],
  purchasedInRound: Record<number, Record<string, number>>
): number => {
  const currentRoundData = rounds.find((r) => r.number === currentRound)
  if (!currentRoundData) return 0
  const maxPurchases = currentRoundData.maxPurchases[itemId] || 0
  const alreadyPurchased = purchasedInRound[currentRound]?.[itemId] || 0
  return Math.max(0, maxPurchases - alreadyPurchased)
}

export const getInventoryCount = (itemId: string, inventory: Record<string, number>): number => {
  return inventory[itemId] || 0
}