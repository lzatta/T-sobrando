import type { Checkin } from './types'

// dado derivado, calculado na hora — nunca armazenado. Streak atual conta,
// do check-in mais recente pra trás, quantos 'cumprido' consecutivos existem
// até bater um 'falhou' (ou acabarem os check-ins). "Não consegui hoje" zera
// só isso, nunca a consistência histórica.
export function calcularStreakAtual(checkins: Checkin[]): number {
  const ordenados = [...checkins].sort((a, b) => (a.data < b.data ? 1 : -1))
  let streak = 0
  for (const checkin of ordenados) {
    if (checkin.tipo !== 'cumprido') break
    streak += 1
  }
  return streak
}

export function diasCorridosDesde(geradoEm: string, hoje: Date): number {
  const inicio = new Date(geradoEm)
  const inicioSemHora = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate())
  const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  const diffMs = hojeSemHora.getTime() - inicioSemHora.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
}

// consistência histórica nunca reseta com uma falha isolada — é sobre todo o
// histórico do desafio, não só a sequência atual (base científica: Lally/UCL,
// não o mito popular de "21 dias" ou "um erro estraga tudo")
export function calcularConsistenciaHistorica(checkins: Checkin[], geradoEm: string, hoje: Date = new Date()): number {
  const dias = diasCorridosDesde(geradoEm, hoje)
  if (dias <= 0) return 0
  const cumpridos = checkins.filter((checkin) => checkin.tipo === 'cumprido').length
  return Math.min(cumpridos / dias, 1)
}

// 21 dias é só o primeiro ponto de checagem, não uma promessa de "hábito
// formado" — depois disso, a cada +30 dias enquanto o desafio continuar ativo
export function calcularProximoMarco(ultimoMarcoPerguntado: number | null): number {
  return ultimoMarcoPerguntado ? ultimoMarcoPerguntado + 30 : 21
}

export function deveMostrarConsolidacao(
  geradoEm: string,
  ultimoMarcoPerguntado: number | null,
  hoje: Date = new Date()
): boolean {
  return diasCorridosDesde(geradoEm, hoje) >= calcularProximoMarco(ultimoMarcoPerguntado)
}

export function jaFezCheckinHoje(checkins: Checkin[], hoje: Date = new Date()): boolean {
  const hojeISO = hoje.toISOString().slice(0, 10)
  return checkins.some((checkin) => checkin.data === hojeISO)
}
