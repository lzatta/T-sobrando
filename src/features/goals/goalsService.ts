import { supabase } from '../../services/supabase'
import { metaSchema, type Meta, type MetaInput } from './types'

export async function listMetas(userId: string): Promise<Meta[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('id, nome, categoria, categoria_outro, prioridade, valor_alvo, valor_atual, prazo')
    .eq('user_id', userId)
    .order('prioridade', { ascending: true })
  if (error) throw error
  return data
}

export async function createMeta(userId: string, input: MetaInput) {
  const dados = metaSchema.parse(input)

  const { data: ultimaMeta, error: errUltima } = await supabase
    .from('goals')
    .select('prioridade')
    .eq('user_id', userId)
    .order('prioridade', { ascending: false })
    .limit(1)
  if (errUltima) throw errUltima

  const proximaPrioridade = ultimaMeta.length > 0 ? ultimaMeta[0].prioridade + 1 : 0

  const { error } = await supabase.from('goals').insert({
    user_id: userId,
    nome: dados.nome,
    categoria: dados.categoria,
    categoria_outro: dados.categoria === 'outro' ? dados.categoria_outro || null : null,
    valor_alvo: dados.valor_alvo,
    prazo: dados.prazo,
    prioridade: proximaPrioridade,
  })
  if (error) throw error
}

export async function aportar(metaId: string, novoValorAtual: number) {
  const { error } = await supabase.from('goals').update({ valor_atual: novoValorAtual }).eq('id', metaId)
  if (error) throw error
}

export async function trocarPrioridade(metaA: Meta, metaB: Meta) {
  const { error: error1 } = await supabase.from('goals').update({ prioridade: metaB.prioridade }).eq('id', metaA.id)
  if (error1) throw error1

  const { error: error2 } = await supabase.from('goals').update({ prioridade: metaA.prioridade }).eq('id', metaB.id)
  if (error2) throw error2
}

export async function deleteMeta(id: string) {
  const { error } = await supabase.from('goals').delete().eq('id', id)
  if (error) throw error
}
