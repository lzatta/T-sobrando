import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from './authService'
import { loginSchema, type LoginInput } from './types'

export function useLogin() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setAuthError(null)
    try {
      await signIn(data)
      router.replace('/(app)')
    } catch (error) {
      console.error('[useLogin] falha ao entrar:', error)
      setAuthError(error instanceof Error ? error.message : 'Não foi possível entrar')
    }
  }

  return { form, authError, submit: form.handleSubmit(onSubmit) }
}
