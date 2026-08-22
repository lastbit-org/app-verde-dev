import { useEffect, useState } from 'react'
import { getProduct } from '../../api/products'
import type { Product } from '../../types/product'

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isInteger(id) || id < 1) {
      setProduct(null)
      setLoading(false)
      setError('Produto não encontrado.')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void getProduct(id)
      .then((next) => {
        if (!cancelled) {
          setProduct(next)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProduct(null)
          setError('Não foi possível carregar o produto. Confira se a API está no ar.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { product, loading, error }
}
