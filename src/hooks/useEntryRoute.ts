import { useEffect, useState } from 'react'
import { getOnboardingCompleted } from '../features/onboarding/onboardingService'
import { getTriagemRespostas } from '../features/triagem/triagemService'
import { useSession } from '../stores/AuthContext'

export type EntryRoute = 'loading' | '/(auth)/login' | '/(onboarding)' | '/(triagem)' | '/(app)'

export function useEntryRoute(): EntryRoute {
  const { session, isLoading } = useSession()
  const [route, setRoute] = useState<EntryRoute>('loading')

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      setRoute('/(auth)/login')
      return
    }

    let cancelado = false

    async function resolverDestino() {
      try {
        const onboardingCompleted = await getOnboardingCompleted(session!.user.id)
        if (!onboardingCompleted) {
          if (!cancelado) setRoute('/(onboarding)')
          return
        }

        const triagem = await getTriagemRespostas(session!.user.id)
        if (!triagem) {
          if (!cancelado) setRoute('/(triagem)')
          return
        }

        if (!cancelado) setRoute('/(app)')
      } catch (error) {
        console.error('[useEntryRoute] falha ao resolver destino:', error)
      }
    }

    resolverDestino()
    return () => {
      cancelado = true
    }
  }, [session, isLoading])

  return route
}
