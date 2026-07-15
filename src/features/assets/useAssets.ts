import { useCallback, useEffect, useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { createAsset, deleteAsset, listAssets } from './assetsService'
import type { Asset, AssetInput } from './types'

export function useAssets() {
  const { session } = useSession()
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const data = await listAssets(session.user.id)
      setAssets(data)
      setError(null)
    } catch (err) {
      console.error('[useAssets] falha ao carregar patrimônio:', err)
      setError('Não foi possível carregar o patrimônio.')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function adicionar(input: AssetInput) {
    if (!session) return
    await createAsset(session.user.id, input)
    await carregar()
  }

  async function remover(id: string) {
    await deleteAsset(id)
    await carregar()
  }

  return { assets, isLoading, error, adicionar, remover }
}
