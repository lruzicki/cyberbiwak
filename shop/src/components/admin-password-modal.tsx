"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AdminPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => void
}

export function AdminPasswordModal({ isOpen, onClose, onConfirm }: AdminPasswordModalProps) {
  const [password, setPassword] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Admin Password</DialogTitle>
        </DialogHeader>
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
          <Button
            type="submit"
            className="ml-2"
            onClick={() => {
              onConfirm(password)
              setPassword("") // Clear the password field after confirmation
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}