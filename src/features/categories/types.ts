import { z } from 'zod'

export const categoriaSchema = z.object({
  nome: z.string().min(1, 'Informe um nome'),
  tipo: z.enum(['receita', 'despesa']),
})

export type CategoriaInput = z.infer<typeof categoriaSchema>

export type Categoria = {
  id: string
  nome: string
  tipo: 'receita' | 'despesa'
}
