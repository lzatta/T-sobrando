import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { getResumoFinanceiro } from './dashboardService'
import type { ResumoFinanceiro } from './types'

export function useDashboard() {
  const { session } = useSession()
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const dados = await getResumoFinanceiro(session.user.id)
      setResumo(dados)
      setError(null)
    } catch (err) {
      console.error('[useDashboard] falha ao carregar resumo financeiro:', err)
      setError('Não foi possível carregar o dashboard.')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useFocusEffect(
    useCallback(() => {
      carregar()
    }, [carregar])
  )

  return { resumo, isLoading, error }
}
