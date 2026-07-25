import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { signOut } from '../features/auth/authService'
import { getOnboardingCompleted } from '../features/onboarding/onboardingService'
import { getTriagemRespostas } from '../features/triagem/triagemService'
import { useSession } from '../stores/AuthContext'

export type EntryRoute = 'loading' | '/(auth)/login' | '/(onboarding)' | '/(triagem)' | '/(app)'

export function useEntryRoute(): EntryRoute {
  const { session, isLoading } = useSession()
  const [route, setRoute] = useState<EntryRoute>('loading')

  // incrementa a cada vez que o app volta a ficar ativo (retomado do
  // background), forçando o efeito abaixo a rodar de novo mesmo com
  // session/isLoading inalterados — cobre o caso de o app ter sido só
  // minimizado (não reiniciado) enquanto o estado de onboarding/triagem
  // mudou no banco nesse meio-tempo. Só tem efeito enquanto este hook está
  // montado (ou seja, enquanto a rota ainda não foi resolvida para dentro de
  // (app)/(onboarding)/(triagem) — depois de resolvido, este componente
  // desmonta e retomar o app não passa mais por aqui).
  const [retomadas, setRetomadas] = useState(0)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') setRetomadas((atual) => atual + 1)
    })
    return () => subscription.remove()
  }, [])

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

        // perfil não existe mais (ex.: usuário apagado no painel do Supabase
        // com a sessão ainda salva no aparelho) — sessão órfã, força logout
        // local em vez de deixar o erro estourar
        if (onboardingCompleted === null) {
          await signOut()
          if (!cancelado) setRoute('/(auth)/login')
          return
        }

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
  }, [session, isLoading, retomadas])

  return route
}
