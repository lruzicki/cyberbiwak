import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface UseTimerOptions {
  initialTargetTime: number
  timerActive: boolean
  totalRounds: number // Total number of rounds
  onTimerEnd?: () => void
  updateTargetTime: (newTargetTime: number) => void // Callback to update targetTime in local storage
}

export const useTimer = ({ initialTargetTime, timerActive, totalRounds, onTimerEnd, updateTargetTime }: UseTimerOptions) => {
    const [targetTime, setTargetTime] = useLocalStorage("shop-target-time", Date.now() + 70 * 60 * 1000) // Use targetTime from local storage
    const [currentRound, setCurrentRound] = useLocalStorage("shop-current-round", 1)
    const [timeRemaining, setTimeRemaining] = useState(() => Math.max(0, Math.ceil((initialTargetTime - Date.now()) / 1000)))
    
    const calculateTimeLeft = () => { 
    const now = Date.now()
    return Math.max(0, Math.ceil((targetTime - now) / 1000)) // Time left in seconds
  }

  const calculateCurrentRound = () => {
    const totalTime = 70 * 60 // Total time in seconds (70 minutes)
    const roundDuration = totalTime / totalRounds // Duration of each round in seconds
    const elapsedTime = totalTime - timeRemaining // Time elapsed in seconds
    return Math.min(totalRounds, Math.max(Math.ceil(elapsedTime / roundDuration), 1)) // Calculate the current round
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(calculateTimeLeft())
        setCurrentRound(calculateCurrentRound()) // Update the round dynamically
        console.log("Current Round:", calculateCurrentRound()) // Log the current round
      }, 1000)
    } else if (timerActive && timeRemaining === 0) {
      if (onTimerEnd) onTimerEnd()
      toast.error("Game Over!", {
        description: "The countdown has ended.",
      })
    } else if (!timerActive) {
        interval = setInterval(() => {
            setTargetTime((prevTargetTime) => prevTargetTime + 1000) // Increment targetTime by 1 second
            setCurrentRound(calculateCurrentRound())
        }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timeRemaining, targetTime, onTimerEnd])

  const updateTimeRemaining = (newTimeRemaining: number) => {
    const newTargetTime = Date.now() + newTimeRemaining * 1000
    setTimeRemaining(newTimeRemaining)
    setTargetTime(newTargetTime) // Update targetTime in state
    updateTargetTime(newTargetTime) // Update targetTime in local storage
  }

  return { timeRemaining, setTimeRemaining: updateTimeRemaining, setTargetTime, currentRound }
}