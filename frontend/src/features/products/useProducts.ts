import { useCallback, useEffect, useState } from 'react'
import { createProduct, getProducts } from '../../api/products'
import type { CreateProductInput, Product } from '../../types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setProducts(await getProducts())
    } catch {
      setProducts([])
      setError('Não foi possível carregar os produtos. Confira se a API está no ar.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  const addProduct = useCallback(async (payload: CreateProductInput) => {
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const product = await createProduct(payload)
      setProducts((current) => [...current, product])
      setMessage(`${product.name} foi cadastrado.`)
      return true
    } catch {
      setError('Não foi possível cadastrar o produto. Confira se a API está no ar.')
      return false
    } finally {
      setSaving(false)
    }
  }, [])

  return { products, loading, saving, error, message, addProduct }
}
