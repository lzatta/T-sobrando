import { z } from 'zod'

export const TIPOS_ASSET = [
  { value: 'imovel', label: 'Imóvel' },
  { value: 'veiculo', label: 'Veículo' },
  { value: 'investimento', label: 'Investimento' },
  { value: 'outro', label: 'Outro' },
] as const

export const assetSchema = z.object({
  nome: z.string().min(1, 'Informe um nome'),
  tipo: z.enum(['imovel', 'veiculo', 'investimento', 'outro']),
  valor_estimado: z.coerce.number({ message: 'Informe um valor válido' }).min(0, 'Informe um valor válido'),
})

export type AssetInput = z.infer<typeof assetSchema>

export type Asset = {
  id: string
  nome: string
  tipo: (typeof TIPOS_ASSET)[number]['value']
  valor_estimado: number
}
