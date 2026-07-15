import { Link } from 'expo-router'
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
    isLoadingOpcoes,
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

  const semContas = !isLoadingOpcoes && contas.length === 0

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-16 px-24 pt-24 pb-32"
    >
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
        {semContas ? (
          <View className="gap-8">
            <Text className="text-text-secondary dark:text-text-secondary-dark">
              Você ainda não tem nenhuma conta cadastrada.
            </Text>
            <Link href="/(app)/contas" className="text-primary">
              Criar uma conta
            </Link>
          </View>
        ) : (
          contas.map((conta) => (
            <OpcaoCard
              key={conta.id}
              label={conta.nome}
              selected={accountId === conta.id}
              onPress={() => setAccountId(conta.id)}
            />
          ))
        )}
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

      <Button label="Salvar" onPress={salvar} loading={isSaving} disabled={semContas} />
    </ScrollView>
  )
}
