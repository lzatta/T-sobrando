import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { deleteMeta, listMetas, trocarPrioridade } from './goalsService'
import type { Meta } from './types'

export function useGoals() {
  const { session } = useSession()
  const [metas, setMetas] = useState<Meta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const dados = await listMetas(session.user.id)
      setMetas(dados)
      setError(null)
    } catch (err) {
      console.error('[useGoals] falha ao carregar metas:', err)
      setError('Não foi possível carregar as metas.')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useFocusEffect(
    useCallback(() => {
      carregar()
    }, [carregar])
  )

  async function remover(id: string) {
    await deleteMeta(id)
    await carregar()
  }

  async function moverPrioridade(index: number, direcao: 'cima' | 'baixo') {
    const outroIndex = direcao === 'cima' ? index - 1 : index + 1
    if (outroIndex < 0 || outroIndex >= metas.length) return
    await trocarPrioridade(metas[index], metas[outroIndex])
    await carregar()
  }

  return { metas, isLoading, error, remover, moverPrioridade, recarregar: carregar }
}
