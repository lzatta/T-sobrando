import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signUp } from './authService'
import { signUpSchema, type SignUpInput } from './types'

export function useSignUp() {
  const [authError, setAuthError] = useState<string | null>(null)
  const form = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) })

  async function onSubmit(data: SignUpInput) {
    setAuthError(null)
    try {
      await signUp(data)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Não foi possível criar a conta')
    }
  }

  return { form, authError, submit: form.handleSubmit(onSubmit) }
}
