import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { OpcaoCard } from '../../components/OpcaoCard'
import { TIPOS_ASSET, assetSchema, type Asset } from './types'
import { useAssets } from './useAssets'

export function AssetsScreen() {
  const { assets, isLoading, error, adicionar, remover } = useAssets()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<Asset['tipo']>('investimento')
  const [valorEstimado, setValorEstimado] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const patrimonioTotal = assets.reduce((soma, item) => soma + item.valor_estimado, 0)

  async function handleAdicionar() {
    const resultado = assetSchema.safeParse({ nome, tipo, valor_estimado: valorEstimado })
    if (!resultado.success) {
      setFormError(resultado.error.issues[0].message)
      return
    }

    setFormError(null)
    setIsSaving(true)
    try {
      await adicionar(resultado.data)
      setNome('')
      setValorEstimado('')
    } catch (err) {
      console.error('[AssetsScreen] falha ao adicionar patrimônio:', err)
      setFormError('Não foi possível salvar.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FlatList
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-16 px-24 pb-32"
      data={assets}
      keyExtractor={(item) => item.id}
      refreshing={isLoading}
      ListHeaderComponent={
        <View className="gap-16 pb-16">
          <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Patrimônio</Text>
          <Card>
            <Text className="text-text-secondary dark:text-text-secondary-dark">Total</Text>
            <Text className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">
              {patrimonioTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </Card>

          <Card className="gap-12">
            <Input label="Nome" value={nome} onChangeText={setNome} error={formError ?? undefined} />
            <Input
              label="Valor estimado"
              keyboardType="numeric"
              value={valorEstimado}
              onChangeText={setValorEstimado}
            />
            <View className="gap-8">
              {TIPOS_ASSET.map((opcao) => (
                <OpcaoCard
                  key={opcao.value}
                  label={opcao.label}
                  selected={tipo === opcao.value}
                  onPress={() => setTipo(opcao.value)}
                />
              ))}
            </View>
            <Button label="Adicionar" onPress={handleAdicionar} loading={isSaving} />
          </Card>

          {error ? <Text className="text-error">{error}</Text> : null}
        </View>
      }
      ItemSeparatorComponent={() => <View className="h-12" />}
      renderItem={({ item }) => (
        <Card className="flex-row items-center justify-between">
          <View>
            <Text className="text-text-primary dark:text-text-primary-dark">{item.nome}</Text>
            <Text className="text-text-secondary dark:text-text-secondary-dark">
              {TIPOS_ASSET.find((t) => t.value === item.tipo)?.label} ·{' '}
              {item.valor_estimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </View>
          <Pressable onPress={() => remover(item.id)}>
            <Text className="text-error">Excluir</Text>
          </Pressable>
        </Card>
      )}
    />
  )
}
