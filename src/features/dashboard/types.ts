export type ItemTopTransacao = {
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
  topDespesas: ItemTopTransacao[]
  topReceitas: ItemTopTransacao[]
  topCategorias: ItemTopCategoria[]
}
