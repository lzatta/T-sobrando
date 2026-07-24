import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { getResumoFinanceiro } from '../dashboard/dashboardService'
import type { ItemTopCategoria } from '../dashboard/types'
import { useSession } from '../../stores/AuthContext'
import { calcularPerfil, getPerfilCalculado } from './habitosService'
import type { PerfilCalculado } from './types'

const INTERVALO_POLLING_MS = 3000
const MAX_TENTATIVAS_POLLING = 10

export function useHabitos(aguardandoCalculoInicial = false) {
  const { session } = useSession()
  const [perfil, setPerfil] = useState<PerfilCalculado | null>(null)
  const [perfilCalculadoEm, setPerfilCalculadoEm] = useState<string | null>(null)
  const [topCategoria, setTopCategoria] = useState<ItemTopCategoria | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCalculando, setIsCalculando] = useState(false)
  const [aguardandoPrimeiroCalculo, setAguardandoPrimeiroCalculo] = useState(aguardandoCalculoInicial)
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

  // logo após a triagem, o cálculo do perfil já foi disparado em segundo
  // plano (fire-and-forget) — enquanto ele não aparece, faz polling em vez de
  // mostrar o botão manual como se nada tivesse acontecido; desiste depois de
  // MAX_TENTATIVAS_POLLING tentativas (~30s) e cai de volta pro estado manual
  useEffect(() => {
    if (!aguardandoPrimeiroCalculo || perfil || !session) return

    let tentativas = 0
    const intervalo = setInterval(async () => {
      tentativas += 1
      try {
        const perfilData = await getPerfilCalculado(session.user.id)
        if (perfilData.perfilCalculado) {
          setPerfil(perfilData.perfilCalculado)
          setPerfilCalculadoEm(perfilData.perfilCalculadoEm)
          setAguardandoPrimeiroCalculo(false)
        } else if (tentativas >= MAX_TENTATIVAS_POLLING) {
          setAguardandoPrimeiroCalculo(false)
        }
      } catch (err) {
        console.error('[useHabitos] falha ao verificar perfil calculado:', err)
        if (tentativas >= MAX_TENTATIVAS_POLLING) setAguardandoPrimeiroCalculo(false)
      }
    }, INTERVALO_POLLING_MS)

    return () => clearInterval(intervalo)
  }, [aguardandoPrimeiroCalculo, perfil, session])

  async function calcular() {
    setAguardandoPrimeiroCalculo(false)
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

  return {
    perfil,
    perfilCalculadoEm,
    topCategoria,
    isLoading,
    isCalculando,
    aguardandoPrimeiroCalculo: aguardandoPrimeiroCalculo && !perfil,
    error,
    calcular,
  }
}
