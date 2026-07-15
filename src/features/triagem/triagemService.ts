import { supabase } from '../../services/supabase'
import { triagemRespostasSchema, type TriagemRespostas } from './types'

export async function saveTriagemRespostas(userId: string, respostas: TriagemRespostas) {
  const respostasValidadas = triagemRespostasSchema.parse(respostas)
  const { error } = await supabase
    .from('triagem_respostas')
    .upsert({ user_id: userId, respostas: respostasValidadas }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function getTriagemRespostas(userId: string) {
  const { data, error } = await supabase
    .from('triagem_respostas')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}
