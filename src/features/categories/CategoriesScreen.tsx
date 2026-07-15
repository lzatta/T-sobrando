import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { SegmentedToggle } from '../../components/SegmentedToggle'
import { categoriaSchema } from './types'
import { useCategories } from './useCategories'

export function CategoriesScreen() {
  const { categorias, isLoading, error, adicionar, remover } = useCategories()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleAdicionar() {
    const resultado = categoriaSchema.safeParse({ nome, tipo })
    if (!resultado.success) {
      setFormError(resultado.error.issues[0].message)
      return
    }

    setFormError(null)
    setIsSaving(true)
    try {
      await adicionar(resultado.data)
      setNome('')
    } catch (err) {
      console.error('[CategoriesScreen] falha ao adicionar categoria:', err)
      setFormError('Não foi possível salvar a categoria.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FlatList
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-16 px-24 pb-32"
      data={categorias}
      keyExtractor={(item) => item.id}
      refreshing={isLoading}
      ListHeaderComponent={
        <View className="gap-16 pb-16">
          <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Categorias</Text>

          <Card className="gap-12">
            <Input label="Nome" value={nome} onChangeText={setNome} error={formError ?? undefined} />
            <SegmentedToggle
              opcoes={[
                { value: 'despesa', label: 'Despesa' },
                { value: 'receita', label: 'Receita' },
              ]}
              valor={tipo}
              onChange={setTipo}
            />
            <Button label="Adicionar categoria" onPress={handleAdicionar} loading={isSaving} />
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
              {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
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
