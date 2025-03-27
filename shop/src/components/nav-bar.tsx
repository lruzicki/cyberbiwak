"use client"
import Link from "next/link"
import { ShoppingCart, User, Home, Store, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NavBarProps {
  balance: number
  cartItemsCount: number
}

export function NavBar({ balance, cartItemsCount }: NavBarProps) {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Navigation links */}
            <nav className="flex space-x-4">
              <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
                <Home className="h-4 w-4 mr-1" />
                <span>Trading Post</span>
              </Link>
              <Link href="/marketplace" className="flex items-center text-gray-700 hover:text-gray-900">
                <Store className="h-4 w-4 mr-1" />
                <span>OLX</span>
              </Link>
              <Link href="/allegro" className="flex items-center text-gray-700 hover:text-gray-900">
                <Package className="h-4 w-4 mr-1" />
                <span>Allegro</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Balance */}
            <div className="hidden md:block">
              <Badge variant="outline" className="text-sm">
                Balance: ${balance}
              </Badge>
            </div>

            {/* Cart */}
            <Link href="#" className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>

            {/* User account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/" className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Trading Post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/marketplace" className="flex items-center">
                    <Store className="h-4 w-4 mr-2" />
                    OLX
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/allegro" className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Allegro
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

