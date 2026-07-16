import { Link } from 'expo-router'
import { FlatList, Pressable, Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { INSTITUICOES } from '../../constants/instituicoes'
import { useTransactions } from './useTransactions'

function nomeInstituicao(instituicao: string, instituicaoOutro: string | null) {
  if (instituicao === 'outro') return instituicaoOutro || 'Outro'
  return INSTITUICOES.find((item) => item.value === instituicao)?.label ?? instituicao
}

export function TransactionsScreen() {
  const { transacoes, isLoading, error, remover } = useTransactions()

  return (
    <View className="flex-1 gap-16 bg-background px-24 pt-64 dark:bg-background-dark">
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Transações</Text>

      <Link href="/(app)/nova-transacao" asChild>
        <Button label="Nova transação" />
      </Link>

      <Link href="/(app)/categorias" className="text-primary">
        Categorias
      </Link>

      {error ? <Text className="text-error">{error}</Text> : null}

      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        contentContainerClassName="gap-12"
        renderItem={({ item }) => (
          <Card className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-text-primary dark:text-text-primary-dark">
                {item.descricao || item.categories?.nome || (item.tipo === 'receita' ? 'Receita' : 'Despesa')}
              </Text>
              <Text className="text-text-secondary dark:text-text-secondary-dark">
                {nomeInstituicao(item.instituicao, item.instituicao_outro)} ·{' '}
                {new Date(item.data).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <Text className={item.tipo === 'receita' ? 'font-semibold text-success' : 'font-semibold text-error'}>
              {item.tipo === 'receita' ? '+' : '-'}
              {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
            <Pressable onPress={() => remover(item.id)} className="ml-12">
              <Text className="text-error">Excluir</Text>
            </Pressable>
          </Card>
        )}
      />
    </View>
  )
}
