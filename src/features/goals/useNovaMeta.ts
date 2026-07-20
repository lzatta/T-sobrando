import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { paraDataISO } from '../../utils/data'
import { createMeta } from './goalsService'
import { metaSchema } from './types'

function prazoPadrao() {
  const data = new Date()
  data.setMonth(data.getMonth() + 1)
  return data
}

export function useNovaMeta() {
  const router = useRouter()
  const { session } = useSession()

  const [nome, setNome] = useState('')
  const [categoria, setCategoriaState] = useState('')
  const [categoriaOutro, setCategoriaOutro] = useState('')
  const [valorAlvo, setValorAlvo] = useState('')
  const [prazo, setPrazo] = useState(prazoPadrao)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function alterarCategoria(novaCategoria: string) {
    setCategoriaState(novaCategoria)
    if (novaCategoria !== 'outro') setCategoriaOutro('')
  }

  async function salvar() {
    const resultado = metaSchema.safeParse({
      nome,
      categoria,
      categoria_outro: categoriaOutro,
      valor_alvo: valorAlvo,
      prazo: paraDataISO(prazo),
    })
    if (!resultado.success) {
      setFormError(resultado.error.issues[0].message)
      return
    }

    if (!session) return

    setFormError(null)
    setIsSaving(true)
    try {
      await createMeta(session.user.id, resultado.data)
      router.back()
    } catch (error) {
      console.error('[useNovaMeta] falha ao criar meta:', error)
      setFormError('Não foi possível salvar a meta.')
      setIsSaving(false)
    }
  }

  return {
    nome,
    setNome,
    categoria,
    alterarCategoria,
    categoriaOutro,
    setCategoriaOutro,
    valorAlvo,
    setValorAlvo,
    prazo,
    setPrazo,
    formError,
    isSaving,
    salvar,
  }
}
