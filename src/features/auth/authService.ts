import { supabase } from '../../services/supabase'
import type { ForgotPasswordInput, LoginInput, SignUpInput } from './types'

export async function signIn({ email, password }: LoginInput) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signUp({ email, password }: SignUpInput) {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
}

export async function resetPassword({ email }: ForgotPasswordInput) {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}
