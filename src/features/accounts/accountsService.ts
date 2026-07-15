import { supabase } from '../../services/supabase'
import type { Conta, ContaInput } from './types'

export async function listContas(userId: string): Promise<Conta[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('id, nome, tipo, saldo_inicial')
    .eq('user_id', userId)
    .order('nome')
  if (error) throw error
  return data
}

export async function createConta(userId: string, input: ContaInput) {
  const { error } = await supabase.from('accounts').insert({ user_id: userId, ...input })
  if (error) throw error
}

export async function deleteConta(id: string) {
  const { error } = await supabase.from('accounts').delete().eq('id', id)
  if (error) throw error
}
