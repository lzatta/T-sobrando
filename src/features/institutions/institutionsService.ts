import { INSTITUICOES } from '../../constants/instituicoes'
import { supabase } from '../../services/supabase'
import type { ItemExtratoInstituicao } from './types'

type TransacaoInstituicao = {
  tipo: 'receita' | 'despesa'
  valor: number
  instituicao: string
  instituicao_outro: string | null
}

export async function getExtratoPorInstituicao(userId: string): Promise<ItemExtratoInstituicao[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('tipo, valor, instituicao, instituicao_outro')
    .eq('user_id', userId)
  if (error) throw error

  const transacoes = data as unknown as TransacaoInstituicao[]
  const saldosPorChave = new Map<string, { nome: string; saldo: number }>()

  for (const transacao of transacoes) {
    const ehOutro = transacao.instituicao === 'outro'
    const chave = ehOutro ? `outro:${transacao.instituicao_outro}` : transacao.instituicao
    const nome = ehOutro
      ? transacao.instituicao_outro || 'Outro'
      : (INSTITUICOES.find((item) => item.value === transacao.instituicao)?.label ?? transacao.instituicao)

    const atual = saldosPorChave.get(chave) ?? { nome, saldo: 0 }
    const delta = transacao.tipo === 'receita' ? Number(transacao.valor) : -Number(transacao.valor)
    saldosPorChave.set(chave, { nome, saldo: atual.saldo + delta })
  }

  return Array.from(saldosPorChave.entries())
    .map(([chave, { nome, saldo }]) => ({ chave, nome, saldo }))
    .sort((a, b) => b.saldo - a.saldo)
}
