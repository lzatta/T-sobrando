import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { BotaoMenu } from '../../components/BotaoMenu'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { useHabitos } from './useHabitos'

function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR')
}

export function HabitosScreen() {
  const { perfil, perfilCalculadoEm, topCategoria, isLoading, isCalculando, error, calcular } = useHabitos()

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-16 px-24 pt-64 pb-32"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Hábitos</Text>
        <BotaoMenu />
      </View>

      {error ? <Text className="text-error">{error}</Text> : null}

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          {topCategoria && (
            <Card className="gap-4">
              <Text className="font-semibold text-text-primary dark:text-text-primary-dark">
                Seu maior gasto este mês
              </Text>
              <Text className="text-text-secondary dark:text-text-secondary-dark">
                {topCategoria.categoriaNome}: {formatarMoeda(topCategoria.valorTotal)} (
                {topCategoria.percentualDoPeriodo.toFixed(0)}% do que você gastou no mês)
              </Text>
            </Card>
          )}

          {perfil ? (
            <Card className="gap-16">
              <View className="gap-4">
                <Text className="font-semibold text-text-primary dark:text-text-primary-dark">Seu perfil</Text>
                <Text className="text-text-secondary dark:text-text-secondary-dark">{perfil.resumo}</Text>
              </View>

              {perfil.pontos_fortes.length > 0 && (
                <View className="gap-4">
                  <Text className="font-semibold text-text-primary dark:text-text-primary-dark">Pontos fortes</Text>
                  {perfil.pontos_fortes.map((ponto) => (
                    <Text key={ponto} className="text-text-secondary dark:text-text-secondary-dark">
                      • {ponto}
                    </Text>
                  ))}
                </View>
              )}

              {perfil.pontos_atencao.length > 0 && (
                <View className="gap-4">
                  <Text className="font-semibold text-text-primary dark:text-text-primary-dark">
                    Pontos de atenção
                  </Text>
                  {perfil.pontos_atencao.map((ponto) => (
                    <Text key={ponto} className="text-text-secondary dark:text-text-secondary-dark">
                      • {ponto}
                    </Text>
                  ))}
                </View>
              )}

              <View className="gap-4">
                <Text className="font-semibold text-text-primary dark:text-text-primary-dark">Recomendação</Text>
                <Text className="text-text-secondary dark:text-text-secondary-dark">
                  {perfil.recomendacao_geral}
                </Text>
              </View>

              {perfilCalculadoEm && (
                <Text className="text-text-secondary dark:text-text-secondary-dark">
                  Calculado em {formatarData(perfilCalculadoEm)}
                </Text>
              )}

              <Button label="Recalcular perfil" variant="secondary" onPress={calcular} loading={isCalculando} />
            </Card>
          ) : (
            <Card className="gap-12">
              <Text className="text-text-secondary dark:text-text-secondary-dark">
                Ainda não calculamos o diagnóstico do seu perfil de comportamento financeiro a partir da sua
                triagem.
              </Text>
              <Button label="Calcular meu perfil" onPress={calcular} loading={isCalculando} />
            </Card>
          )}
        </>
      )}
    </ScrollView>
  )
}
