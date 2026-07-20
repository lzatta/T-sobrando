export type ResultadoAporte =
  | { tipo: 'concluida' }
  | { tipo: 'prazo_vencido' }
  | { tipo: 'normal'; diasReduzidos: number }

function diasEntre(dataAlvo: string, hoje: Date) {
  const alvo = new Date(`${dataAlvo}T00:00:00`)
  const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  const diffMs = alvo.getTime() - hojeSemHora.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

// dado derivado, calculado na hora — nunca armazenado.
// dois casos extremos tratados explicitamente:
// - aporte que bate ou ultrapassa a meta (mesmo que ela já estivesse concluída antes) -> 'concluida'
// - prazo já vencido ou vencendo hoje (0 dias) -> 'prazo_vencido', evita divisão por zero/negativo
export function calcularReducaoDias(
  valorAlvo: number,
  valorAtualAntes: number,
  prazo: string,
  valorAporte: number,
  hoje: Date = new Date()
): ResultadoAporte {
  const valorAtualDepois = valorAtualAntes + valorAporte

  if (valorAtualDepois >= valorAlvo) {
    return { tipo: 'concluida' }
  }

  const diasRestantesAntes = diasEntre(prazo, hoje)
  if (diasRestantesAntes <= 0) {
    return { tipo: 'prazo_vencido' }
  }

  const faltaAntes = valorAlvo - valorAtualAntes
  const diasReduzidos = Math.round(diasRestantesAntes * (valorAporte / faltaAntes))

  return { tipo: 'normal', diasReduzidos }
}
