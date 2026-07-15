import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { listContas } from '../accounts/accountsService'
import type { Conta } from '../accounts/types'
import { listCategorias } from '../categories/categoriesService'
import type { Categoria } from '../categories/types'
import { useSession } from '../../stores/AuthContext'
import { createTransacao } from './transactionsService'
import { transacaoSchema } from './types'

export function useNovaTransacao() {
  const router = useRouter()
  const { session } = useSession()
  const [contas, setContas] = useState<Conta[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoadingOpcoes, setIsLoadingOpcoes] = useState(true)

  const [tipo, setTipoState] = useState<'receita' | 'despesa'>('despesa')
  const [valor, setValor] = useState('')
  const [accountId, setAccountId] = useState<string | undefined>()
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [descricao, setDescricao] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useFocusEffect(
    useCallback(() => {
      if (!session) return
      async function carregarOpcoes() {
        try {
          const [dadosContas, dadosCategorias] = await Promise.all([
            listContas(session!.user.id),
            listCategorias(session!.user.id),
          ])
          setContas(dadosContas)
          setCategorias(dadosCategorias)
        } catch (error) {
          console.error('[useNovaTransacao] falha ao carregar contas/categorias:', error)
        } finally {
          setIsLoadingOpcoes(false)
        }
      }
      carregarOpcoes()
    }, [session])
  )

  function alterarTipo(novoTipo: 'receita' | 'despesa') {
    setTipoState(novoTipo)
    setCategoryId(undefined)
  }

  const categoriasFiltradas = categorias.filter((categoria) => categoria.tipo === tipo)

  async function salvar() {
    const resultado = transacaoSchema.safeParse({
      tipo,
      valor,
      account_id: accountId,
      category_id: categoryId,
      descricao,
    })
    if (!resultado.success) {
      setFormError(resultado.error.issues[0].message)
      return
    }

    if (!session) return

    setFormError(null)
    setIsSaving(true)
    try {
      await createTransacao(session.user.id, resultado.data)
      router.back()
    } catch (error) {
      console.error('[useNovaTransacao] falha ao salvar transação:', error)
      setFormError('Não foi possível salvar a transação.')
      setIsSaving(false)
    }
  }

  return {
    contas,
    categoriasFiltradas,
    isLoadingOpcoes,
    tipo,
    alterarTipo,
    valor,
    setValor,
    accountId,
    setAccountId,
    categoryId,
    setCategoryId,
    descricao,
    setDescricao,
    formError,
    isSaving,
    salvar,
  }
}
