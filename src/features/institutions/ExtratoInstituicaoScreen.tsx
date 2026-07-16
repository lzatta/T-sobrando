import { FlatList, Text } from 'react-native'
import { Card } from '../../components/Card'
import { useExtratoInstituicao } from './useExtratoInstituicao'

function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ExtratoInstituicaoScreen() {
  const { itens, isLoading, error } = useExtratoInstituicao()

  return (
    <FlatList
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-12 px-24 pt-24 pb-32"
      data={itens}
      keyExtractor={(item) => item.chave}
      refreshing={isLoading}
      ListHeaderComponent={error ? <Text className="mb-12 text-error">{error}</Text> : null}
      ListEmptyComponent={
        !isLoading ? (
          <Text className="text-text-secondary dark:text-text-secondary-dark">
            Nenhuma transação registrada ainda.
          </Text>
        ) : null
      }
      renderItem={({ item }) => (
        <Card className="flex-row items-center justify-between">
          <Text className="text-text-primary dark:text-text-primary-dark">{item.nome}</Text>
          <Text className={item.saldo >= 0 ? 'font-semibold text-success' : 'font-semibold text-error'}>
            {formatarMoeda(item.saldo)}
          </Text>
        </Card>
      )}
    />
  )
}
