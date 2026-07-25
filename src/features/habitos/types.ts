export type PerfilCalculado = {
  resumo: string
  pontos_fortes: string[]
  pontos_atencao: string[]
  recomendacao_geral: string
}

export type HabitoRuim = {
  nome: string
  tipo: string
  gatilho: string
  recompensa: string
}

export type HabitoSubstituto = {
  nome: string
  tipo: string
  gatilho: string
  recompensa: string
  beneficio_vida: string
}

export type ParHabito = {
  id: string
  habito_ruim: HabitoRuim
  habito_substituto: HabitoSubstituto
  prioridade: number
}
