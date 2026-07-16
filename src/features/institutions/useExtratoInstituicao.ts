import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { getExtratoPorInstituicao } from './institutionsService'
import type { ItemExtratoInstituicao } from './types'

export function useExtratoInstituicao() {
  const { session } = useSession()
  const [itens, setItens] = useState<ItemExtratoInstituicao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      if (!session) return
      let cancelado = false

      async function carregar() {
        setIsLoading(true)
        try {
          const dados = await getExtratoPorInstituicao(session!.user.id)
          if (!cancelado) {
            setItens(dados)
            setError(null)
          }
        } catch (err) {
          console.error('[useExtratoInstituicao] falha ao carregar extrato:', err)
          if (!cancelado) setError('Não foi possível carregar o extrato.')
        } finally {
          if (!cancelado) setIsLoading(false)
        }
      }

      carregar()
      return () => {
        cancelado = true
      }
    }, [session])
  )

  return { itens, isLoading, error }
}
