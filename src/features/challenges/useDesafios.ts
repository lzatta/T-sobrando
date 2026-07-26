import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { getHabitoPares } from '../habitos/habitosService'
import { useSession } from '../../stores/AuthContext'
import { concluirDesafio, descartarDesafio, gerarDesafio, getDesafioAtivo, getHistoricoConcluidos } from './challengesService'
import type { Desafio } from './types'

export function useDesafios() {
  const { session } = useSession()
  const [desafioAtivo, setDesafioAtivo] = useState<Desafio | null>(null)
  const [historico, setHistorico] = useState<Desafio[]>([])
  const [temParesDisponiveis, setTemParesDisponiveis] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGerando, setIsGerando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const [ativo, concluidos, pares] = await Promise.all([
        getDesafioAtivo(session.user.id),
        getHistoricoConcluidos(session.user.id),
        getHabitoPares(session.user.id),
      ])
      setDesafioAtivo(ativo)
      setHistorico(concluidos)
      setTemParesDisponiveis(pares.length > 0)
      setError(null)
    } catch (err) {
      console.error('[useDesafios] falha ao carregar desafios:', err)
      setError('Não foi possível carregar seus desafios.')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useFocusEffect(
    useCallback(() => {
      carregar()
    }, [carregar])
  )

  async function gerar() {
    if (!session) return
    setIsGerando(true)
    setError(null)
    try {
      const desafio = await gerarDesafio(session.user.id)
      setDesafioAtivo(desafio)
    } catch (err) {
      console.error('[useDesafios] falha ao gerar desafio:', err)
      setError('Não foi possível gerar um desafio agora.')
    } finally {
      setIsGerando(false)
    }
  }

  async function concluir() {
    if (!desafioAtivo) return
    await concluirDesafio(desafioAtivo.id)
    await carregar()
  }

  async function descartar() {
    if (!desafioAtivo) return
    await descartarDesafio(desafioAtivo.id)
    await carregar()
  }

  return { desafioAtivo, historico, temParesDisponiveis, isLoading, isGerando, error, gerar, concluir, descartar }
}
