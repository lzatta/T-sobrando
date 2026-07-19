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
  const [{ data: transacoesData, error: errTransacoes }, { data: assets, error: errAssets }] = await Promise.all([
    supabase
      .from('transactions')
      .select('id, tipo, valor, descricao, data, category_id, categories(nome)')
      .eq('user_id', userId),
    supabase.from('assets').select('valor_estimado').eq('user_id', userId),
  ])

  if (errTransacoes) throw errTransacoes
  if (errAssets) throw errAssets

  const transacoes = transacoesData as unknown as TransacaoBruta[]

  // sem conta/saldo pré-cadastrado: o saldo começa do zero a partir da primeira
  // transação registrada no app — dado inteiramente derivado, nunca armazenado
  const totalReceitas = transacoes
    .filter((t) => t.tipo === 'receita')
    .reduce((soma, t) => soma + Number(t.valor), 0)
  const totalDespesas = transacoes
    .filter((t) => t.tipo === 'despesa')
    .reduce((soma, t) => soma + Number(t.valor), 0)
  const saldoAtual = totalReceitas - totalDespesas

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

  // cada bloco tem sua própria base de 100% — receita e despesa são escalas diferentes,
  // misturar as duas num único denominador produz percentuais sem sentido em conjunto
  const percentualDeDespesa = (valor: number) =>
    despesasDoMes > 0 ? (Math.abs(valor) / despesasDoMes) * 100 : 0
  const percentualDeReceita = (valor: number) =>
    receitasDoMes > 0 ? (Math.abs(valor) / receitasDoMes) * 100 : 0

  const topDespesas = transacoesDoMes
    .filter((t) => t.tipo === 'despesa')
    .sort((a, b) => Number(b.valor) - Number(a.valor))
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      descricao: t.descricao || t.categories?.nome || 'Despesa',
      valor: Number(t.valor),
      percentualDoPeriodo: percentualDeDespesa(Number(t.valor)),
    }))

  const topReceitas = transacoesDoMes
    .filter((t) => t.tipo === 'receita')
    .sort((a, b) => Number(b.valor) - Number(a.valor))
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      descricao: t.descricao || t.categories?.nome || 'Receita',
      valor: Number(t.valor),
      percentualDoPeriodo: percentualDeReceita(Number(t.valor)),
    }))

  // categorias são só de despesa na prática (o filtro abaixo confirma isso: nenhuma
  // transação de receita entra na soma), então a base de 100% é despesasDoMes, igual
  // ao Top Despesas — não a soma combinada de receita + despesa
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
      percentualDoPeriodo: percentualDeDespesa(total),
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
    topDespesas,
    topReceitas,
    topCategorias,
  }
}
