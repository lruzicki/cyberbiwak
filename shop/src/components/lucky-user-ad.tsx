"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface LuckyUserAdProps {
  balance: number
  setBalance: (newBalance: number) => void
  setShowLuckyAd: (show: boolean) => void // Function to hide the ad
}

export const LuckyUserAd: React.FC<LuckyUserAdProps> = ({ balance, setBalance, setShowLuckyAd }) => {
  const [isClicked, setIsClicked] = useState(false)

  const handleDoubleMoney = () => {
    if (balance < 400) {
      toast.error("You don't have enough money to participate!")
      return
    }

    setBalance(balance - 400) // Deduct 400 from the balance
    setIsClicked(true)
    toast.success("Thank you for participating! Better luck next time!")
  }

  return (
    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center shadow-md">
      <h2 className="text-lg font-bold text-yellow-800">🎉 Congratulations! 🎉</h2>
      <p className="text-yellow-700 mt-2">
        You are a lucky user! You have a chance to <strong>double your money!</strong>
      </p>
      <p className="text-yellow-700 mt-2">
        Just pay <strong>400 PLN</strong>, and you will get <strong>800 PLN</strong>!
      </p>
      <Button
        onClick={handleDoubleMoney}
        disabled={isClicked}
        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
      >
        {isClicked ? "Thank You!" : "Double Your Money"}
      </Button>
    <Button
      onClick={() => setShowLuckyAd(false)}
      className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-700 opacity-80 hover:opacity-100 text-xs px-2 py-1 rounded"
    >
      ✕
    </Button>
    </div>
  )
}