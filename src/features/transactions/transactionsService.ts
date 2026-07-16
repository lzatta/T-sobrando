import { supabase } from '../../services/supabase'
import { transacaoSchema, type Transacao, type TransacaoInput } from './types'

export async function listTransacoes(userId: string): Promise<Transacao[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('id, tipo, valor, descricao, data, instituicao, instituicao_outro, categories(nome)')
    .eq('user_id', userId)
    .order('data', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as Transacao[]
}

export async function createTransacao(userId: string, input: TransacaoInput) {
  const dados = transacaoSchema.parse(input)
  const { error } = await supabase.from('transactions').insert({
    user_id: userId,
    instituicao: dados.instituicao,
    instituicao_outro: dados.instituicao === 'outro' ? dados.instituicao_outro || null : null,
    category_id: dados.category_id || null,
    tipo: dados.tipo,
    valor: dados.valor,
    descricao: dados.descricao || null,
  })
  if (error) throw error
}

export async function deleteTransacao(id: string) {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}
