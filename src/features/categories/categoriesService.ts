import { supabase } from '../../services/supabase'
import type { Categoria, CategoriaInput } from './types'

export async function listCategorias(userId: string): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, nome, tipo')
    .eq('user_id', userId)
    .order('nome')
  if (error) throw error
  return data
}

export async function createCategoria(userId: string, input: CategoriaInput) {
  const { error } = await supabase.from('categories').insert({ user_id: userId, ...input })
  if (error) throw error
}

export async function deleteCategoria(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
