export const INSTITUICOES = [
  { value: 'nubank', label: 'Nubank' },
  { value: 'itau', label: 'Itaú' },
  { value: 'bradesco', label: 'Bradesco' },
  { value: 'banco_do_brasil', label: 'Banco do Brasil' },
  { value: 'caixa', label: 'Caixa Econômica Federal' },
  { value: 'santander', label: 'Santander' },
  { value: 'inter', label: 'Banco Inter' },
  { value: 'c6', label: 'C6 Bank' },
  { value: 'btg', label: 'BTG Pactual' },
  { value: 'xp', label: 'XP Investimentos' },
  { value: 'picpay', label: 'PicPay' },
  { value: 'mercado_pago', label: 'Mercado Pago' },
  { value: 'neon', label: 'Neon' },
  { value: 'outro', label: 'Outro' },
] as const

export const INSTITUICAO_VALUES = INSTITUICOES.map((instituicao) => instituicao.value)
