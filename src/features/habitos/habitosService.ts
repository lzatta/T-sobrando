import { supabase } from '../../services/supabase'
import type { ParHabito, PerfilCalculado } from './types'

export async function getPerfilCalculado(userId: string) {
  const { data, error } = await supabase
    .from('triagem_respostas')
    .select('perfil_calculado, perfil_calculado_em')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error

  return {
    perfilCalculado: (data?.perfil_calculado as PerfilCalculado | null) ?? null,
    perfilCalculadoEm: data?.perfil_calculado_em ?? null,
  }
}

export async function getHabitoPares(userId: string) {
  const { data, error } = await supabase
    .from('habit_pairs')
    .select('id, habito_ruim, habito_substituto, prioridade')
    .eq('user_id', userId)
    .order('prioridade', { ascending: true })
  if (error) throw error
  return (data ?? []) as ParHabito[]
}

export async function trocarPrioridadeParHabito(parA: ParHabito, parB: ParHabito) {
  const [{ error: erroA }, { error: erroB }] = await Promise.all([
    supabase.from('habit_pairs').update({ prioridade: parB.prioridade }).eq('id', parA.id),
    supabase.from('habit_pairs').update({ prioridade: parA.prioridade }).eq('id', parB.id),
  ])
  if (erroA) throw erroA
  if (erroB) throw erroB
}

export async function calcularPerfil() {
  const { data, error } = await supabase.functions.invoke<{
    perfilCalculado: PerfilCalculado
    perfilCalculadoEm: string
    pares: ParHabito[]
  }>('calcular-perfil')
  if (error) throw error
  if (!data) throw new Error('Resposta vazia da function calcular-perfil.')
  return data
}
