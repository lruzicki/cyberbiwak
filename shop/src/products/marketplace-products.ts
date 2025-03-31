export interface MarketplaceProduct {
  id: string
  title: string
  price: number
  location: string
  date: string
  image: string
  featured: boolean
  quantity: number
}

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "wood1",
    title: "Drewno Kominkowe Opałowe",
    price: 250,
    location: "Wołomin",
    date: "Odświeżono dnia 22 marca 2025",
    image: "/placeholder.svg?height=200&width=200",
    featured: true,
    quantity: Math.floor(Math.random() * 46) + 5, // Random between 5-50
  },
  {
    id: "wood2",
    title: "Drewno opałowe, kominkowe - wałki",
    price: 160,
    location: "Piła",
    date: "Odświeżono dnia 21 marca 2025",
    image: "/placeholder.svg?height=200&width=200",
    featured: true,
    quantity: Math.floor(Math.random() * 46) + 5,
  },
  {
    id: "wood3",
    title: "Drewno sezonowane kominkowe opałowe z dowozem",
    price: 185,
    location: "Ostrów Wielkopolski",
    date: "Odświeżono dnia 22 marca 2025",
    image: "/placeholder.svg?height=200&width=200",
    featured: true,
    quantity: Math.floor(Math.random() * 46) + 5,
  },
  {
    id: "wood4",
    title: "Okazja? Drewno - świerk, brzoza",
    price: 800,
    location: "Inwałd",
    date: "Dzisiaj o 07:56",
    image: "/placeholder.svg?height=200&width=200",
    featured: false,
    quantity: Math.floor(Math.random() * 46) + 5,
  },
  {
    id: "wood5",
    title: "Drewno orzech włoski",
    price: 650,
    location: "Marianka",
    date: "Dzisiaj o 12:52",
    image: "/placeholder.svg?height=200&width=200",
    featured: false,
    quantity: Math.floor(Math.random() * 46) + 5,
  },
  {
    id: "wood6",
    title: "Drewno bukowe premium",
    price: 320,
    location: "Kraków",
    date: "Odświeżono dnia 20 marca 2025",
    image: "/placeholder.svg?height=200&width=200",
    featured: false,
    quantity: Math.floor(Math.random() * 46) + 5,
  },
]