import {
  Graph,
  Heart,
  House,
  Images,
  Package,
  Plus,
  Receipt,
  ShoppingCart,
  SignOut,
  SquaresFour,
  Storefront,
  Tag,
  User,
  Users,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'

export type IconName =
  | 'home'
  | 'shop'
  | 'grid'
  | 'tag'
  | 'user'
  | 'users'
  | 'images'
  | 'nodes'
  | 'package'
  | 'bag'
  | 'heart'
  | 'receipt'
  | 'plus'
  | 'logout'

const icons: Record<IconName, PhosphorIcon> = {
  home: House,
  shop: Storefront,
  grid: SquaresFour,
  tag: Tag,
  user: User,
  users: Users,
  images: Images,
  nodes: Graph,
  package: Package,
  bag: ShoppingCart,
  heart: Heart,
  receipt: Receipt,
  plus: Plus,
  logout: SignOut,
}

type IconProps = {
  name: IconName
  size?: number
}

export function Icon({ name, size = 20 }: IconProps) {
  const Glyph = icons[name]

  return <Glyph size={size} weight="regular" aria-hidden />
}
