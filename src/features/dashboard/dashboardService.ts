import { supabase } from '../../services/supabase'
import type { ResumoFinanceiro } from './types'

export async function getResumoFinanceiro(userId: string): Promise<ResumoFinanceiro> {
  const [{ data: contas, error: errContas }, { data: transacoes, error: errTransacoes }, { data: assets, error: errAssets }] =
    await Promise.all([
      supabase.from('accounts').select('saldo_inicial').eq('user_id', userId),
      supabase.from('transactions').select('tipo, valor, data').eq('user_id', userId),
      supabase.from('assets').select('valor_estimado').eq('user_id', userId),
    ])

  if (errContas) throw errContas
  if (errTransacoes) throw errTransacoes
  if (errAssets) throw errAssets

  const saldoInicialTotal = contas.reduce((soma, conta) => soma + Number(conta.saldo_inicial), 0)
  const totalReceitas = transacoes
    .filter((t) => t.tipo === 'receita')
    .reduce((soma, t) => soma + Number(t.valor), 0)
  const totalDespesas = transacoes
    .filter((t) => t.tipo === 'despesa')
    .reduce((soma, t) => soma + Number(t.valor), 0)
  const saldoAtual = saldoInicialTotal + totalReceitas - totalDespesas

  const hoje = new Date()
  const transacoesDoMes = transacoes.filter((t) => {
    const dataTransacao = new Date(t.data)
    return dataTransacao.getMonth() === hoje.getMonth() && dataTransacao.getFullYear() === hoje.getFullYear()
  })
  const receitasDoMes = transacoesDoMes
    .filter((t) => t.tipo === 'receita')
    .reduce((soma, t) => soma + Number(t.valor), 0)
  const despesasDoMes = transacoesDoMes
    .filter((t) => t.tipo === 'despesa')
    .reduce((soma, t) => soma + Number(t.valor), 0)

  const patrimonioAssets = assets.reduce((soma, asset) => soma + Number(asset.valor_estimado), 0)

  return {
    saldoAtual,
    receitasDoMes,
    despesasDoMes,
    sobrouDoMes: receitasDoMes - despesasDoMes,
    patrimonioTotal: patrimonioAssets + saldoAtual,
  }
}
