import { ScrollView, Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { OpcaoCard } from '../../components/OpcaoCard'
import { SegmentedToggle } from '../../components/SegmentedToggle'
import { useNovaTransacao } from './useNovaTransacao'

export function NovaTransacaoScreen() {
  const {
    contas,
    categoriasFiltradas,
    tipo,
    alterarTipo,
    valor,
    setValor,
    accountId,
    setAccountId,
    categoryId,
    setCategoryId,
    descricao,
    setDescricao,
    formError,
    isSaving,
    salvar,
  } = useNovaTransacao()

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-16 px-24 pt-64 pb-32"
    >
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Nova transação</Text>

      <SegmentedToggle
        opcoes={[
          { value: 'despesa', label: 'Despesa' },
          { value: 'receita', label: 'Receita' },
        ]}
        valor={tipo}
        onChange={alterarTipo}
      />

      <Input label="Valor" keyboardType="numeric" value={valor} onChangeText={setValor} />

      <Input
        label="Descrição (opcional)"
        value={descricao}
        onChangeText={setDescricao}
      />

      <View className="gap-8">
        <Text className="text-text-secondary dark:text-text-secondary-dark">Conta</Text>
        {contas.map((conta) => (
          <OpcaoCard
            key={conta.id}
            label={conta.nome}
            selected={accountId === conta.id}
            onPress={() => setAccountId(conta.id)}
          />
        ))}
      </View>

      {categoriasFiltradas.length > 0 && (
        <View className="gap-8">
          <Text className="text-text-secondary dark:text-text-secondary-dark">Categoria (opcional)</Text>
          {categoriasFiltradas.map((categoria) => (
            <OpcaoCard
              key={categoria.id}
              label={categoria.nome}
              selected={categoryId === categoria.id}
              onPress={() => setCategoryId(categoria.id === categoryId ? undefined : categoria.id)}
            />
          ))}
        </View>
      )}

      {formError ? <Text className="text-error">{formError}</Text> : null}

      <Button label="Salvar" onPress={salvar} loading={isSaving} />
    </ScrollView>
  )
}
