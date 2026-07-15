import { supabase } from '../../services/supabase'
import type { Asset, AssetInput } from './types'

export async function listAssets(userId: string): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('id, nome, tipo, valor_estimado')
    .eq('user_id', userId)
    .order('nome')
  if (error) throw error
  return data
}

export async function createAsset(userId: string, input: AssetInput) {
  const { error } = await supabase.from('assets').insert({ user_id: userId, ...input })
  if (error) throw error
}

export async function deleteAsset(id: string) {
  const { error } = await supabase.from('assets').delete().eq('id', id)
  if (error) throw error
}
