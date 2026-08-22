import { products as photos } from '../../data/products'

export type CartItem = {
  id: number
  name: string
  description: string
  image: { src: string; alt: string }
  price: number
  originalPrice?: number
  quantity: number
}

export const initialCart: CartItem[] = [
  {
    id: 1,
    name: 'Oliveira em vaso sage',
    description: 'Folhagem densa, irrigação espaçada. Peça quieta para mesa ou janela.',
    image: photos[0],
    price: 248,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Vaso de cerâmica artesanal',
    description: 'Silhueta irregular, esmalte fosco em tom sage.',
    image: photos[1],
    price: 186,
    originalPrice: 220,
    quantity: 1,
  },
  {
    id: 3,
    name: 'Kit de cuidados',
    description: 'Frasco âmbar, pano de linho e folhas para o ritual da semana.',
    image: photos[2],
    price: 92,
    quantity: 2,
  },
]
