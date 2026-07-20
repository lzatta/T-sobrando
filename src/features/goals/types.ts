import { z } from 'zod'

export const CATEGORIAS_META = [
  { value: 'viagem', label: 'Viagem' },
  { value: 'casa', label: 'Casa' },
  { value: 'carro', label: 'Carro' },
  { value: 'educacao', label: 'Educação' },
  { value: 'reserva_emergencia', label: 'Reserva de emergência' },
  { value: 'outro', label: 'Outro' },
] as const

const CATEGORIA_META_VALUES = CATEGORIAS_META.map((categoria) => categoria.value)

export const metaSchema = z.object({
  nome: z.string().min(1, 'Informe um nome'),
  categoria: z.enum(CATEGORIA_META_VALUES as [string, ...string[]], {
    message: 'Selecione uma categoria',
  }),
  categoria_outro: z.string().optional(),
  valor_alvo: z.coerce.number({ message: 'Informe um valor válido' }).positive('Informe um valor maior que zero'),
  prazo: z.string().min(1, 'Selecione um prazo'),
})

export type MetaInput = z.infer<typeof metaSchema>

export const aporteSchema = z.object({
  valor: z.coerce.number({ message: 'Informe um valor válido' }).positive('Informe um valor maior que zero'),
})

export type AporteInput = z.infer<typeof aporteSchema>

export type Meta = {
  id: string
  nome: string
  categoria: string
  categoria_outro: string | null
  prioridade: number
  valor_alvo: number
  valor_atual: number
  prazo: string
}
