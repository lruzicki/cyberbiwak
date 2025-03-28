"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface AdminPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => void
}

export function AdminPasswordModal({ isOpen, onClose, onConfirm }: AdminPasswordModalProps) {
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (!isOpen) {
      setPassword("") // Clear the password when the modal is closed
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission behavior
    onConfirm(password)
    setPassword("") // Clear the password after confirmation
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Admin Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              id="admin-password"
              type="password"
              placeholder="Password"
              className="col-span-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="ml-2">
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}