"use client"

import Link from "next/link"
import { ShoppingCart, Home, Store, Package, Building, ShoppingBag, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminPasswordModal } from "@/components/admin-password-modal"
import { useEffect, useState } from "react"
import { isWebpackClientOnlyLayer } from "next/dist/build/utils"

interface MainNavBarProps {
  balance: number
  cartItemsCount: number
  onAdminClick: () => void
}

export function MainNavBar({ balance, cartItemsCount, onAdminClick }: MainNavBarProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div className="bg-gray-800 text-white sticky top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Navigation links */}
            <nav className="flex space-x-4">
              <Link href="/" className="flex items-center text-white hover:text-gray-300">
                <Home className="h-4 w-4 mr-1" />
                <span>Home</span>
              </Link>
              <Link href="/trading-post" className="flex items-center text-white hover:text-gray-300">
                <Home className="h-4 w-4 mr-1" />
                <span>Trading Post</span>
              </Link>
              <Link href="/marketplace" className="flex items-center text-white hover:text-gray-300">
                <Store className="h-4 w-4 mr-1" />
                <span>OLX</span>
              </Link>
              <Link href="/allegro" className="flex items-center text-white hover:text-gray-300">
                <Package className="h-4 w-4 mr-1" />
                <span>Allegro</span>
              </Link>
              <Link href="/nieruchomosci" className="flex items-center text-white hover:text-gray-300">
                <Building className="h-4 w-4 mr-1" />
                <span>Nieruchomości</span>
              </Link>
              <Link href="/makro" className="flex items-center text-white hover:text-gray-300">
                <ShoppingBag className="h-4 w-4 mr-1" />
                <span>Makro</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Balance */}
            <div className="hidden md:block">
              <Badge variant="outline" className="text-sm text-white border-white">
                Balance: {balance} PLN
              </Badge>
            </div>

            {/* Cart */}
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-white" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white">
                  {cartItemsCount}
                </Badge>
              )}
            </div>

            {/* User account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-gray-700">
                  <User className="h-5 w-5" />
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
                <DropdownMenuItem>
                  <Link href="/nieruchomosci" className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Nieruchomości
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/makro" className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Makro
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isClient && window.location.pathname === "/" && (
              <Button
              variant="outline"
              onClick={() => onAdminClick()}
              className="ml-4 text-gray-800 border-gray-800 hover:bg-gray-100"
              >
              Admin Mode
              </Button>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

function setIsClient(arg0: boolean) {
  throw new Error("Function not implemented.")
}

