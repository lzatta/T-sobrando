import { z } from 'zod'

export const TIPOS_CONTA = [
  { value: 'conta_corrente', label: 'Conta corrente' },
  { value: 'carteira', label: 'Carteira' },
  { value: 'poupanca', label: 'Poupança' },
  { value: 'cartao_credito', label: 'Cartão de crédito' },
  { value: 'investimento', label: 'Investimento' },
] as const

export const contaSchema = z.object({
  nome: z.string().min(1, 'Informe um nome'),
  tipo: z.enum(['conta_corrente', 'carteira', 'poupanca', 'cartao_credito', 'investimento']),
  saldo_inicial: z.coerce.number({ message: 'Informe um valor válido' }),
})

export type ContaInput = z.infer<typeof contaSchema>

export type Conta = {
  id: string
  nome: string
  tipo: (typeof TIPOS_CONTA)[number]['value']
  saldo_inicial: number
}
