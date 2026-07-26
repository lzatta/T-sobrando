export type StatusDesafio = 'ativo' | 'concluido' | 'descartado' | 'consolidado'
export type OrigemDesafio = 'comportamental' | 'financeira'

export type Desafio = {
  id: string
  titulo: string
  descricao: string
  status: StatusDesafio
  origem: OrigemDesafio
  habito_par_id: string | null
  ultimo_marco_perguntado: number | null
  gerado_em: string
  concluido_em: string | null
}

export type TipoCheckin = 'cumprido' | 'falhou'

export type Checkin = {
  id: string
  challenge_id: string
  data: string
  tipo: TipoCheckin
  descricao: string | null
}
