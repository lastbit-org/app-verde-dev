import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  addFavorite,
  getFavoriteIds,
  getFavorites,
  removeFavorite,
} from '../../api/favorites'
import type { Product } from '../../types/product'
import { useSession } from '../auth/SessionProvider'

type FavoritesValue = {
  ids: number[]
  products: Product[]
  loading: boolean
  toggling: number | null
  isFavorite: (productId: number) => boolean
  toggle: (productId: number) => Promise<boolean>
  reload: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useSession()
  const [ids, setIds] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState<number | null>(null)

  const reload = useCallback(async () => {
    if (!user) {
      setIds([])
      setProducts([])
      return
    }

    setLoading(true)
    try {
      const [nextIds, nextProducts] = await Promise.all([
        getFavoriteIds(),
        getFavorites(),
      ])
      setIds(nextIds)
      setProducts(nextProducts)
    } catch {
      setIds([])
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void reload()
  }, [reload])

  const isFavorite = useCallback(
    (productId: number) => ids.includes(productId),
    [ids],
  )

  const toggle = useCallback(
    async (productId: number) => {
      if (!user) {
        return false
      }

      setToggling(productId)
      try {
        if (ids.includes(productId)) {
          await removeFavorite(productId)
          setIds((current) => current.filter((id) => id !== productId))
          setProducts((current) =>
            current.filter((item) => item.id !== productId),
          )
        } else {
          const product = await addFavorite(productId)
          setIds((current) =>
            current.includes(product.id) ? current : [...current, product.id],
          )
          setProducts((current) =>
            current.some((item) => item.id === product.id)
              ? current
              : [...current, product],
          )
        }
        return true
      } catch {
        return false
      } finally {
        setToggling(null)
      }
    },
    [ids, user],
  )

  const value = useMemo(
    () => ({
      ids,
      products,
      loading,
      toggling,
      isFavorite,
      toggle,
      reload,
    }),
    [ids, products, loading, toggling, isFavorite, toggle, reload],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }

  return context
}
