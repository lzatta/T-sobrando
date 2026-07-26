export type StatusDesafio = 'ativo' | 'concluido' | 'descartado'

export type Desafio = {
  id: string
  titulo: string
  descricao: string
  status: StatusDesafio
  habito_par_id: string | null
  gerado_em: string
  concluido_em: string | null
}
