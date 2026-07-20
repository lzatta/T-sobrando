import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { listCategorias } from '../categories/categoriesService'
import type { Categoria } from '../categories/types'
import { useSession } from '../../stores/AuthContext'
import { paraDataISO } from '../../utils/data'
import { createTransacao } from './transactionsService'
import { transacaoSchema } from './types'

export function useNovaTransacao() {
  const router = useRouter()
  const { session } = useSession()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoadingOpcoes, setIsLoadingOpcoes] = useState(true)

  const [tipo, setTipoState] = useState<'receita' | 'despesa'>('despesa')
  const [valor, setValor] = useState('')
  const [instituicao, setInstituicaoState] = useState<string | undefined>()
  const [instituicaoOutro, setInstituicaoOutro] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState(() => new Date())
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useFocusEffect(
    useCallback(() => {
      if (!session) return
      async function carregarOpcoes() {
        try {
          const dadosCategorias = await listCategorias(session!.user.id)
          setCategorias(dadosCategorias)
        } catch (error) {
          console.error('[useNovaTransacao] falha ao carregar categorias:', error)
        } finally {
          setIsLoadingOpcoes(false)
        }
      }
      carregarOpcoes()
    }, [session])
  )

  function alterarTipo(novoTipo: 'receita' | 'despesa') {
    setTipoState(novoTipo)
    setCategoryId('')
  }

  function alterarInstituicao(novaInstituicao: string) {
    setInstituicaoState(novaInstituicao)
    if (novaInstituicao !== 'outro') setInstituicaoOutro('')
  }

  const categoriasFiltradas = categorias.filter((categoria) => categoria.tipo === tipo)

  async function salvar() {
    const resultado = transacaoSchema.safeParse({
      tipo,
      valor,
      instituicao,
      instituicao_outro: instituicaoOutro,
      category_id: categoryId,
      descricao,
      data: paraDataISO(data),
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
    categoriasFiltradas,
    isLoadingOpcoes,
    tipo,
    alterarTipo,
    valor,
    setValor,
    instituicao,
    alterarInstituicao,
    instituicaoOutro,
    setInstituicaoOutro,
    categoryId,
    setCategoryId,
    descricao,
    setDescricao,
    data,
    setData,
    formError,
    isSaving,
    salvar,
  }
}
