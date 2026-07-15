export type ItemTopMovimentacao = {
  id: string
  descricao: string
  valor: number
  percentualDaReceita: number
}

export type ItemTopCategoria = {
  categoriaId: string
  categoriaNome: string
  valorTotal: number
  percentualDaReceita: number
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
