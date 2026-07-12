import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { resetPassword } from './authService'
import { forgotPasswordSchema, type ForgotPasswordInput } from './types'

export function useForgotPassword() {
  const [authError, setAuthError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const form = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(data: ForgotPasswordInput) {
    setAuthError(null)
    try {
      await resetPassword(data)
      setEmailSent(true)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Não foi possível enviar o e-mail')
    }
  }

  return { form, authError, emailSent, submit: form.handleSubmit(onSubmit) }
}
