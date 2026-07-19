import { z } from 'zod'
import { INSTITUICAO_VALUES } from '../../constants/instituicoes'

export const transacaoSchema = z.object({
  tipo: z.enum(['receita', 'despesa']),
  valor: z.coerce.number({ message: 'Informe um valor válido' }).positive('Informe um valor maior que zero'),
  instituicao: z.enum(INSTITUICAO_VALUES as [string, ...string[]], {
    message: 'Selecione uma instituição',
  }),
  instituicao_outro: z.string().optional(),
  category_id: z.string().optional(),
  descricao: z.string().optional(),
  data: z.string().min(1, 'Selecione uma data'),
})

export type TransacaoInput = z.infer<typeof transacaoSchema>

export type Transacao = {
  id: string
  tipo: 'receita' | 'despesa'
  valor: number
  descricao: string | null
  data: string
  instituicao: string
  instituicao_outro: string | null
  categories: { nome: string } | null
}
