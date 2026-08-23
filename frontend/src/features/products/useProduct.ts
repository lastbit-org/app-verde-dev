import { useCallback, useEffect, useState } from 'react'
import { deleteProduct, getProduct } from '../../api/products'
import { ApiError } from '../../api/client'
import type { Product } from '../../types/product'

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(id !== null)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === null) {
      setProduct(null)
      setLoading(false)
      setError(null)
      return
    }

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
          setError(
            'Não foi possível carregar o produto. Confira se a API está no ar.',
          )
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

  const remove = useCallback(async () => {
    if (id === null || !Number.isInteger(id) || id < 1) {
      return false
    }

    setRemoving(true)
    setError(null)

    try {
      await deleteProduct(id)
      setProduct(null)
      return true
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Entre para excluir esta peça.')
      } else if (err instanceof ApiError && err.status === 403) {
        setError('Só administradores e parceiros excluem peças.')
      } else if (err instanceof ApiError && err.status === 404) {
        setError('Esta peça já não está no catálogo.')
      } else {
        setError('Não foi possível excluir. Confira se a API está no ar.')
      }
      return false
    } finally {
      setRemoving(false)
    }
  }, [id])

  return { product, loading, removing, error, remove }
}
