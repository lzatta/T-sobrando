import { supabase } from '../../services/supabase'
import type { PerfilCalculado } from './types'

export async function getPerfilCalculado(userId: string) {
  const { data, error } = await supabase
    .from('triagem_respostas')
    .select('perfil_calculado, perfil_calculado_em')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error

  return {
    perfilCalculado: (data?.perfil_calculado as PerfilCalculado | null) ?? null,
    perfilCalculadoEm: data?.perfil_calculado_em ?? null,
  }
}

export async function calcularPerfil() {
  const { data, error } = await supabase.functions.invoke<{
    perfilCalculado: PerfilCalculado
    perfilCalculadoEm: string
  }>('calcular-perfil')
  if (error) throw error
  if (!data) throw new Error('Resposta vazia da function calcular-perfil.')
  return data
}
