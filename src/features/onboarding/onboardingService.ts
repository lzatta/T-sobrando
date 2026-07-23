import { supabase } from '../../services/supabase'

export async function completeOnboarding(userId: string) {
  const { error } = await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', userId)
  if (error) throw error
}

export async function getOnboardingCompleted(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data ? (data.onboarding_completed as boolean) : null
}
