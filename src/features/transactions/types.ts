import { z } from 'zod'

export const transacaoSchema = z.object({
  tipo: z.enum(['receita', 'despesa']),
  valor: z.coerce.number({ message: 'Informe um valor válido' }).positive('Informe um valor maior que zero'),
  account_id: z.string().min(1, 'Selecione uma conta'),
  category_id: z.string().optional(),
  descricao: z.string().optional(),
})

export type TransacaoInput = z.infer<typeof transacaoSchema>

export type Transacao = {
  id: string
  tipo: 'receita' | 'despesa'
  valor: number
  descricao: string | null
  data: string
  accounts: { nome: string } | null
  categories: { nome: string } | null
}
