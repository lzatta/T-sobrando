import { supabase } from '../../services/supabase'
import type { ResumoFinanceiro } from './types'

type TransacaoBruta = {
  id: string
  tipo: 'receita' | 'despesa'
  valor: number
  descricao: string | null
  data: string
  category_id: string | null
  categories: { nome: string } | null
}

export async function getResumoFinanceiro(userId: string): Promise<ResumoFinanceiro> {
  const [
    { data: contas, error: errContas },
    { data: transacoesData, error: errTransacoes },
    { data: assets, error: errAssets },
  ] = await Promise.all([
    supabase.from('accounts').select('saldo_inicial').eq('user_id', userId),
    supabase
      .from('transactions')
      .select('id, tipo, valor, descricao, data, category_id, categories(nome)')
      .eq('user_id', userId),
    supabase.from('assets').select('valor_estimado').eq('user_id', userId),
  ])

  if (errContas) throw errContas
  if (errTransacoes) throw errTransacoes
  if (errAssets) throw errAssets

  const transacoes = transacoesData as unknown as TransacaoBruta[]

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

  // percentual sempre sobre a receita mensal total, nunca sobre a soma dos itens exibidos —
  // senão a barra fica enganosa quando existem outras transações/categorias fora do top 5
  const percentualDaReceita = (valor: number) => (receitasDoMes > 0 ? (valor / receitasDoMes) * 100 : 0)

  const topMovimentacoes = [...transacoesDoMes]
    .sort((a, b) => Number(b.valor) - Number(a.valor))
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      descricao: t.descricao || t.categories?.nome || (t.tipo === 'receita' ? 'Receita' : 'Despesa'),
      valor: Number(t.valor),
      percentualDaReceita: percentualDaReceita(Number(t.valor)),
    }))

  const somaPorCategoria = new Map<string, { nome: string; total: number }>()
  transacoesDoMes
    .filter((t) => t.tipo === 'despesa')
    .forEach((t) => {
      const categoriaId = t.category_id ?? 'sem-categoria'
      const categoriaNome = t.categories?.nome ?? 'Sem categoria'
      const atual = somaPorCategoria.get(categoriaId)
      somaPorCategoria.set(categoriaId, { nome: categoriaNome, total: (atual?.total ?? 0) + Number(t.valor) })
    })

  const topCategorias = Array.from(somaPorCategoria.entries())
    .map(([categoriaId, { nome, total }]) => ({
      categoriaId,
      categoriaNome: nome,
      valorTotal: total,
      percentualDaReceita: percentualDaReceita(total),
    }))
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .slice(0, 5)

  const patrimonioAssets = assets.reduce((soma, asset) => soma + Number(asset.valor_estimado), 0)

  return {
    saldoAtual,
    receitasDoMes,
    despesasDoMes,
    sobrouDoMes: receitasDoMes - despesasDoMes,
    patrimonioTotal: patrimonioAssets + saldoAtual,
    topMovimentacoes,
    topCategorias,
  }
}
