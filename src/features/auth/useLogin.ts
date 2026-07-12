import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from './authService'
import { loginSchema, type LoginInput } from './types'

export function useLogin() {
  const [authError, setAuthError] = useState<string | null>(null)
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setAuthError(null)
    try {
      await signIn(data)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Não foi possível entrar')
    }
  }

  return { form, authError, submit: form.handleSubmit(onSubmit) }
}
