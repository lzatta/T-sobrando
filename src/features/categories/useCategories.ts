import { useCallback, useEffect, useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { createCategoria, deleteCategoria, listCategorias } from './categoriesService'
import type { Categoria, CategoriaInput } from './types'

export function useCategories() {
  const { session } = useSession()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const data = await listCategorias(session.user.id)
      setCategorias(data)
      setError(null)
    } catch (err) {
      console.error('[useCategories] falha ao carregar categorias:', err)
      setError('Não foi possível carregar as categorias.')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function adicionar(input: CategoriaInput) {
    if (!session) return
    await createCategoria(session.user.id, input)
    await carregar()
  }

  async function remover(id: string) {
    await deleteCategoria(id)
    await carregar()
  }

  return { categorias, isLoading, error, adicionar, remover }
}
