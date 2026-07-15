import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { deleteTransacao, listTransacoes } from './transactionsService'
import type { Transacao } from './types'

export function useTransactions() {
  const { session } = useSession()
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const data = await listTransacoes(session.user.id)
      setTransacoes(data)
      setError(null)
    } catch (err) {
      console.error('[useTransactions] falha ao carregar transações:', err)
      setError('Não foi possível carregar as transações.')
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
    await deleteTransacao(id)
    await carregar()
  }

  return { transacoes, isLoading, error, remover }
}
