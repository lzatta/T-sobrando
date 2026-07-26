import { supabase } from '../../services/supabase'
import type { Checkin, Desafio, TipoCheckin } from './types'

const CAMPOS_DESAFIO = 'id, titulo, descricao, status, origem, habito_par_id, ultimo_marco_perguntado, gerado_em, concluido_em'
const CAMPOS_CHECKIN = 'id, challenge_id, data, tipo, descricao'

export async function getDesafioAtivo(userId: string) {
  const { data, error } = await supabase
    .from('challenges')
    .select(CAMPOS_DESAFIO)
    .eq('user_id', userId)
    .eq('status', 'ativo')
    .maybeSingle()
  if (error) throw error
  return data as Desafio | null
}

export async function getHistoricoConcluidos(userId: string) {
  const { data, error } = await supabase
    .from('challenges')
    .select(CAMPOS_DESAFIO)
    .eq('user_id', userId)
    .eq('status', 'concluido')
    .order('concluido_em', { ascending: false })
  if (error) throw error
  return (data ?? []) as Desafio[]
}

export async function getHabitosConsolidados(userId: string) {
  const { data, error } = await supabase
    .from('challenges')
    .select(CAMPOS_DESAFIO)
    .eq('user_id', userId)
    .eq('status', 'consolidado')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Desafio[]
}

// não chama IA: o desafio é derivado do habit_pair de maior prioridade (o
// mesmo que já aparece no topo da lista em Hábitos) — titulo/descricao
// montados por template a partir de campos que a IA já gerou lá
export async function gerarDesafio(userId: string) {
  const { data: par, error: erroPar } = await supabase
    .from('habit_pairs')
    .select('id, habito_ruim, habito_substituto')
    .eq('user_id', userId)
    .order('prioridade', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (erroPar) throw erroPar
  if (!par) throw new Error('Nenhum par de hábito disponível ainda.')

  const habitoRuim = par.habito_ruim as { nome: string }
  const habitoSubstituto = par.habito_substituto as { nome: string; beneficio_vida: string }

  const { data: desafio, error: erroInsert } = await supabase
    .from('challenges')
    .insert({
      user_id: userId,
      habito_par_id: par.id,
      titulo: `Troque: ${habitoRuim.nome} → ${habitoSubstituto.nome}`,
      descricao: habitoSubstituto.beneficio_vida,
    })
    .select(CAMPOS_DESAFIO)
    .single()
  if (erroInsert) throw erroInsert
  return desafio as Desafio
}

export async function descartarDesafio(id: string) {
  const { error } = await supabase.from('challenges').update({ status: 'descartado' }).eq('id', id)
  if (error) throw error
}

export async function marcarConsolidado(id: string) {
  const { error } = await supabase.from('challenges').update({ status: 'consolidado' }).eq('id', id)
  if (error) throw error
}

export async function atualizarMarcoPerguntado(id: string, marco: number) {
  const { error } = await supabase.from('challenges').update({ ultimo_marco_perguntado: marco }).eq('id', id)
  if (error) throw error
}

export async function getCheckins(challengeId: string) {
  const { data, error } = await supabase
    .from('habit_checkins')
    .select(CAMPOS_CHECKIN)
    .eq('challenge_id', challengeId)
    .order('data', { ascending: true })
  if (error) throw error
  return (data ?? []) as Checkin[]
}

// upsert por (challenge_id, data): se a pessoa já fez o check-in de hoje e
// mudar de ideia no mesmo dia, atualiza em vez de duplicar
export async function registrarCheckin(
  challengeId: string,
  userId: string,
  tipo: TipoCheckin,
  descricao: string | null
) {
  const hojeISO = new Date().toISOString().slice(0, 10)
  const { error } = await supabase
    .from('habit_checkins')
    .upsert(
      { challenge_id: challengeId, user_id: userId, data: hojeISO, tipo, descricao: descricao || null },
      { onConflict: 'challenge_id,data' }
    )
  if (error) throw error
}
