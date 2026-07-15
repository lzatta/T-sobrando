import { useCallback, useEffect, useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { createConta, deleteConta, listContas } from './accountsService'
import type { Conta, ContaInput } from './types'

export function useAccounts() {
  const { session } = useSession()
  const [contas, setContas] = useState<Conta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const data = await listContas(session.user.id)
      setContas(data)
      setError(null)
    } catch (err) {
      console.error('[useAccounts] falha ao carregar contas:', err)
      setError('Não foi possível carregar as contas.')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function adicionar(input: ContaInput) {
    if (!session) return
    await createConta(session.user.id, input)
    await carregar()
  }

  async function remover(id: string) {
    try {
      await deleteConta(id)
      await carregar()
      setError(null)
    } catch (err) {
      console.error('[useAccounts] falha ao excluir conta:', err)
      const codigo = (err as { code?: string }).code
      setError(
        codigo === '23503'
          ? 'Essa conta tem transações vinculadas. Mova ou exclua as transações antes de remover a conta.'
          : 'Não foi possível excluir a conta.'
      )
    }
  }

  return { contas, isLoading, error, adicionar, remover }
}
