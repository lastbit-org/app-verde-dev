export type OrderStatus = 'preparando' | 'em trânsito' | 'entregue'

export type Order = {
  id: string
  date: string
  items: { name: string; quantity: number }[]
  payment: string
  status: OrderStatus
  total: number
}

export const orders: Order[] = [
  {
    id: 'VER-1042',
    date: '2026-08-12',
    items: [
      { name: 'Oliveira em vaso sage', quantity: 1 },
      { name: 'Kit de cuidados', quantity: 2 },
    ],
    payment: 'Pix',
    status: 'entregue',
    total: 432,
  },
  {
    id: 'VER-1108',
    date: '2026-08-18',
    items: [{ name: 'Vaso de cerâmica artesanal', quantity: 1 }],
    payment: 'Cartão de crédito',
    status: 'em trânsito',
    total: 186,
  },
  {
    id: 'VER-1120',
    date: '2026-08-21',
    items: [{ name: 'Planta de interior', quantity: 1 }],
    payment: 'Boleto',
    status: 'preparando',
    total: 164,
  },
]
