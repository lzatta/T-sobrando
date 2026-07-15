import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useSession } from '../../stores/AuthContext'
import { completeOnboarding } from './onboardingService'
import { ONBOARDING_STEPS } from './types'

export function useOnboarding() {
  const router = useRouter()
  const { session } = useSession()
  const [stepIndex, setStepIndex] = useState(0)
  const [isFinishing, setIsFinishing] = useState(false)

  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1
  const isFirstStep = stepIndex === 0
  const step = ONBOARDING_STEPS[stepIndex]

  function voltar() {
    if (isFirstStep) return
    setStepIndex((current) => current - 1)
  }

  async function avancar() {
    if (!isLastStep) {
      setStepIndex((current) => current + 1)
      return
    }

    if (!session) return

    setIsFinishing(true)
    try {
      await completeOnboarding(session.user.id)
      router.replace('/(triagem)')
    } catch (error) {
      console.error('[useOnboarding] falha ao concluir onboarding:', error)
      setIsFinishing(false)
    }
  }

  return { step, isFirstStep, isLastStep, isFinishing, avancar, voltar }
}
