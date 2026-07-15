import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { OpcaoCard } from '../../components/OpcaoCard'
import { TIPOS_CONTA, contaSchema, type Conta } from './types'
import { useAccounts } from './useAccounts'

export function AccountsScreen() {
  const { contas, isLoading, error, adicionar, remover } = useAccounts()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<Conta['tipo']>('conta_corrente')
  const [saldoInicial, setSaldoInicial] = useState('0')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleAdicionar() {
    const resultado = contaSchema.safeParse({ nome, tipo, saldo_inicial: saldoInicial })
    if (!resultado.success) {
      setFormError(resultado.error.issues[0].message)
      return
    }

    setFormError(null)
    setIsSaving(true)
    try {
      await adicionar(resultado.data)
      setNome('')
      setSaldoInicial('0')
    } catch (err) {
      console.error('[AccountsScreen] falha ao adicionar conta:', err)
      setFormError('Não foi possível salvar a conta.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <View className="flex-1 gap-16 bg-background px-24 pt-64 dark:bg-background-dark">
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Contas</Text>

      <Card className="gap-12">
        <Input label="Nome" value={nome} onChangeText={setNome} error={formError ?? undefined} />
        <Input
          label="Saldo inicial"
          keyboardType="numeric"
          value={saldoInicial}
          onChangeText={setSaldoInicial}
        />
        <View className="gap-8">
          {TIPOS_CONTA.map((opcao) => (
            <OpcaoCard
              key={opcao.value}
              label={opcao.label}
              selected={tipo === opcao.value}
              onPress={() => setTipo(opcao.value)}
            />
          ))}
        </View>
        <Button label="Adicionar conta" onPress={handleAdicionar} loading={isSaving} />
      </Card>

      {error ? <Text className="text-error">{error}</Text> : null}

      <FlatList
        data={contas}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        contentContainerClassName="gap-12"
        renderItem={({ item }) => (
          <Card className="flex-row items-center justify-between">
            <View>
              <Text className="text-text-primary dark:text-text-primary-dark">{item.nome}</Text>
              <Text className="text-text-secondary dark:text-text-secondary-dark">
                {TIPOS_CONTA.find((t) => t.value === item.tipo)?.label}
              </Text>
            </View>
            <Pressable onPress={() => remover(item.id)}>
              <Text className="text-error">Excluir</Text>
            </Pressable>
          </Card>
        )}
      />
    </View>
  )
}
