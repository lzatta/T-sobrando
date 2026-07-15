export type OnboardingStep = {
  titulo: string
  descricao: string
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    titulo: 'Entenda seus hábitos',
    descricao:
      'O Tá Sobrando começa com um diagnóstico rápido para entender seu perfil financeiro e o que te faz gastar por impulso.',
  },
  {
    titulo: 'Metas com propósito',
    descricao:
      'Você define suas metas com prioridade, e cada recomendação do app considera sempre a que importa mais para você primeiro.',
  },
  {
    titulo: 'Mudança de comportamento de verdade',
    descricao:
      'Nada de só organizar receitas e despesas: o app incentiva pequenas trocas de hábito que aproximam você do que você quer.',
  },
]
