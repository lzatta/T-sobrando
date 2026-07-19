export type ItemTopMovimentacao = {
  id: string
  descricao: string
  valor: number
  percentualDoPeriodo: number
}

export type ItemTopCategoria = {
  categoriaId: string
  categoriaNome: string
  valorTotal: number
  percentualDoPeriodo: number
}

export type ResumoFinanceiro = {
  saldoAtual: number
  receitasDoMes: number
  despesasDoMes: number
  sobrouDoMes: number
  patrimonioTotal: number
  topMovimentacoes: ItemTopMovimentacao[]
  topCategorias: ItemTopCategoria[]
}
