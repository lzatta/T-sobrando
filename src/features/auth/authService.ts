import { supabase } from '../../services/supabase'
import type { ForgotPasswordInput, LoginInput, SignUpInput } from './types'

export async function signIn({ email, password }: LoginInput) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signUp({ email, password }: SignUpInput) {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  // com confirmação de e-mail desativada, signUp já retorna uma sessão ativa;
  // encerra ela para a pessoa entrar deliberadamente pela tela de login
  await signOut()
}

export async function resetPassword({ email }: ForgotPasswordInput) {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
