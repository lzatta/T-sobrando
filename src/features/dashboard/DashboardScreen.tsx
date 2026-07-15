import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { Card } from '../../components/Card'
import { useDashboard } from './useDashboard'

function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function DashboardScreen() {
  const { resumo, isLoading, error } = useDashboard()

  if (isLoading && !resumo) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-16 px-24 pt-64 pb-32"
    >
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Dashboard</Text>

      {error ? <Text className="text-error">{error}</Text> : null}

      {resumo ? (
        <>
          <Card>
            <Text className="text-text-secondary dark:text-text-secondary-dark">Tá sobrando este mês</Text>
            <Text
              className={`text-3xl font-semibold ${resumo.sobrouDoMes >= 0 ? 'text-success' : 'text-error'}`}
            >
              {formatarMoeda(resumo.sobrouDoMes)}
            </Text>
          </Card>

          <View className="flex-row gap-16">
            <Card className="flex-1">
              <Text className="text-text-secondary dark:text-text-secondary-dark">Receitas do mês</Text>
              <Text className="text-lg font-semibold text-success">{formatarMoeda(resumo.receitasDoMes)}</Text>
            </Card>
            <Card className="flex-1">
              <Text className="text-text-secondary dark:text-text-secondary-dark">Despesas do mês</Text>
              <Text className="text-lg font-semibold text-error">{formatarMoeda(resumo.despesasDoMes)}</Text>
            </Card>
          </View>

          <Card>
            <Text className="text-text-secondary dark:text-text-secondary-dark">Saldo atual</Text>
            <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              {formatarMoeda(resumo.saldoAtual)}
            </Text>
          </Card>

          <Card>
            <Text className="text-text-secondary dark:text-text-secondary-dark">Patrimônio total</Text>
            <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              {formatarMoeda(resumo.patrimonioTotal)}
            </Text>
          </Card>
        </>
      ) : null}
    </ScrollView>
  )
}
