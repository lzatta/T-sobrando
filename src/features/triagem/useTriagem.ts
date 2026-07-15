import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { saveTriagemRespostas } from './triagemService'
import { PERGUNTAS, type TriagemRespostas } from './types'

type RespostasParciais = Partial<TriagemRespostas>

export function useTriagem() {
  const router = useRouter()
  const { session } = useSession()
  const [stepIndex, setStepIndex] = useState(0)
  const [respostas, setRespostas] = useState<RespostasParciais>({})
  const [isFinishing, setIsFinishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pergunta = PERGUNTAS[stepIndex]
  const isLastStep = stepIndex === PERGUNTAS.length - 1
  const podeAvancar = pergunta.tipo === 'texto' || Boolean(respostas[pergunta.id])

  function selecionarOpcao(value: string) {
    if (pergunta.tipo !== 'escolha') return
    setRespostas((atual) => ({ ...atual, [pergunta.id]: value }))
  }

  function atualizarTexto(value: string) {
    setRespostas((atual) => ({ ...atual, [pergunta.id]: value }))
  }

  function atualizarOutro(value: string) {
    setRespostas((atual) => ({ ...atual, atividade_prazer_outro: value }))
  }

  async function avancar() {
    if (!podeAvancar) return

    if (!isLastStep) {
      setStepIndex((atual) => atual + 1)
      return
    }

    if (!session) return

    setError(null)
    setIsFinishing(true)
    try {
      await saveTriagemRespostas(session.user.id, respostas as TriagemRespostas)
      router.replace('/(app)')
    } catch (err) {
      console.error('[useTriagem] falha ao salvar triagem:', err)
      setError('Não foi possível salvar suas respostas. Tente novamente.')
      setIsFinishing(false)
    }
  }

  return {
    pergunta,
    isLastStep,
    podeAvancar,
    respostas,
    isFinishing,
    error,
    selecionarOpcao,
    atualizarTexto,
    atualizarOutro,
    avancar,
  }
}
