import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { getResumoFinanceiro } from '../dashboard/dashboardService'
import type { ItemTopCategoria } from '../dashboard/types'
import { useSession } from '../../stores/AuthContext'
import { calcularPerfil, getPerfilCalculado } from './habitosService'
import type { PerfilCalculado } from './types'

export function useHabitos() {
  const { session } = useSession()
  const [perfil, setPerfil] = useState<PerfilCalculado | null>(null)
  const [perfilCalculadoEm, setPerfilCalculadoEm] = useState<string | null>(null)
  const [topCategoria, setTopCategoria] = useState<ItemTopCategoria | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCalculando, setIsCalculando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!session) return
    setIsLoading(true)
    try {
      const [perfilData, resumo] = await Promise.all([
        getPerfilCalculado(session.user.id),
        getResumoFinanceiro(session.user.id),
      ])
      setPerfil(perfilData.perfilCalculado)
      setPerfilCalculadoEm(perfilData.perfilCalculadoEm)
      setTopCategoria(resumo.topCategorias[0] ?? null)
      setError(null)
    } catch (err) {
      console.error('[useHabitos] falha ao carregar hábitos:', err)
      setError('Não foi possível carregar seus hábitos.')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useFocusEffect(
    useCallback(() => {
      carregar()
    }, [carregar])
  )

  async function calcular() {
    setIsCalculando(true)
    setError(null)
    try {
      const resultado = await calcularPerfil()
      setPerfil(resultado.perfilCalculado)
      setPerfilCalculadoEm(resultado.perfilCalculadoEm)
    } catch (err) {
      console.error('[useHabitos] falha ao calcular perfil:', err)
      setError('Não foi possível calcular seu perfil agora. Tente novamente em instantes.')
    } finally {
      setIsCalculando(false)
    }
  }

  return { perfil, perfilCalculadoEm, topCategoria, isLoading, isCalculando, error, calcular }
}
