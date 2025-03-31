export interface Property {
  id: string
  title: string
  price: number
  location: string
  size: string
  image: string
  quantity: number
  favorite: boolean
}

export const nieruchomosciProducts: Property[] = [
  {
    id: "plot1",
    title: "Działka rolna przy lesie Gołubie",
    price: 99999,
    location: "Gołubie warmińsko-mazurskie",
    size: "3 545 m²",
    image: "/placeholder.svg?height=300&width=400",
    quantity: Math.floor(Math.random() * 3) + 1, // Limited availability for land
    favorite: false,
  },
  {
    id: "plot2",
    title: "Działka budowlana uzbrojona Gołubie",
    price: 342300,
    location: "Gołubie pomorskie",
    size: "2 282 m²",
    image: "/placeholder.svg?height=300&width=400",
    quantity: Math.floor(Math.random() * 3) + 1,
    favorite: false,
  },
  {
    id: "plot3",
    title: "Działka rolna przy lesie Gołubie",
    price: 115000,
    location: "Gołubie warmińsko-mazurskie",
    size: "3 687 m²",
    image: "/placeholder.svg?height=300&width=400",
    quantity: Math.floor(Math.random() * 3) + 1,
    favorite: false,
  },
  {
    id: "plot4",
    title: "Działka Gołubie",
    price: 149000,
    location: "Gołubie pomorskie",
    size: "1 003 m²",
    image: "/placeholder.svg?height=300&width=400",
    quantity: Math.floor(Math.random() * 3) + 1,
    favorite: false,
  },
  {
    id: "plot5",
    title: "Działka Gołubie",
    price: 85000,
    location: "Gołubie warmińsko-mazurskie",
    size: "3 003 m²",
    image: "/placeholder.svg?height=300&width=400",
    quantity: Math.floor(Math.random() * 3) + 1,
    favorite: false,
  },
  {
    id: "plot6",
    title: "Działka rekreacyjna ogrodzona Gołubie",
    price: 215000,
    location: "Gołubie warmińsko-mazurskie",
    size: "1 964 m²",
    image: "/placeholder.svg?height=300&width=400",
    quantity: Math.floor(Math.random() * 3) + 1,
    favorite: false,
  },
  {
    id: "plot7",
    title: "Działka Gołubie",
    price: 149000,
    location: "Gołubie pomorskie",
    size: "1 147 m²",
    image: "/placeholder.svg?height=300&width=400",
    quantity: Math.floor(Math.random() * 3) + 1,
    favorite: false,
  },
  {
    id: "plot8",
    title: "Działka Gołubie",
    price: 400400,
    location: "Gołubie warmińsko-mazurskie",
    size: "40 040 m²",
    image: "/placeholder.svg?height=300&width=400",
    quantity: Math.floor(Math.random() * 3) + 1,
    favorite: false,
  },
  {
    id: "plot9",
    title: "Działka budowlana uzbrojona Gołubie",
    price: 123760,
    location: "Gołubie pomorskie",
    size: "728 m²",
    image: "/placeholder.svg?height=300&width=400",
    quantity: Math.floor(Math.random() * 3) + 1,
    favorite: false,
  },
]