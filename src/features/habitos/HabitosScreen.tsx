import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { BotaoMenu } from '../../components/BotaoMenu'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { useHabitos } from './useHabitos'

const DURACAO_CONFIRMACAO_MS = 6000

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR')
}

export function HabitosScreen() {
  const { triagemConcluida } = useLocalSearchParams<{ triagemConcluida?: string }>()
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(Boolean(triagemConcluida))
  const [resumoExpandido, setResumoExpandido] = useState(false)
  const {
    perfil,
    perfilCalculadoEm,
    pares,
    topCategoria,
    isLoading,
    isCalculando,
    aguardandoPrimeiroCalculo,
    error,
    calcular,
    moverPrioridade,
  } = useHabitos(Boolean(triagemConcluida))

  useEffect(() => {
    if (!mostrarConfirmacao) return
    const timeout = setTimeout(() => setMostrarConfirmacao(false), DURACAO_CONFIRMACAO_MS)
    return () => clearTimeout(timeout)
  }, [mostrarConfirmacao])

  function pedirRecalculo() {
    Alert.alert(
      'Recalcular perfil',
      'Isso vai gerar uma nova lista de hábitos, substituindo a atual — incluindo a ordem que você organizou. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: calcular },
      ]
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-16 px-24 pt-64 pb-32"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Hábitos</Text>
        <BotaoMenu />
      </View>

      {mostrarConfirmacao && (
        <Card className="flex-row items-center justify-between gap-12 border-primary">
          <Text className="flex-1 text-text-primary dark:text-text-primary-dark">
            Boa! Triagem concluída — seu perfil está sendo preparado bem aqui embaixo.
          </Text>
          <Pressable onPress={() => setMostrarConfirmacao(false)} hitSlop={12}>
            <Text className="text-text-secondary dark:text-text-secondary-dark">✕</Text>
          </Pressable>
        </Card>
      )}

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
                {topCategoria.categoriaNome}: {topCategoria.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (
                {topCategoria.percentualDoPeriodo.toFixed(0)}% do que você gastou no mês)
              </Text>
            </Card>
          )}

          {perfil && pares.length > 0 && (
            <View className="gap-12">
              <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                Seus hábitos
              </Text>

              {pares.map((par, index) => (
                <Card key={par.id} className="gap-12">
                  <View className="gap-4">
                    <Text className="font-semibold text-error">Hábito atual</Text>
                    <Text className="font-semibold text-text-primary dark:text-text-primary-dark">
                      {par.habito_ruim.nome}
                    </Text>
                    <Text className="text-text-secondary dark:text-text-secondary-dark">{par.habito_ruim.tipo}</Text>
                    <Text className="text-text-secondary dark:text-text-secondary-dark">
                      Gatilho: {par.habito_ruim.gatilho}
                    </Text>
                    <Text className="text-text-secondary dark:text-text-secondary-dark">
                      Recompensa hoje: {par.habito_ruim.recompensa}
                    </Text>
                  </View>

                  <Text className="text-center text-primary">↓ Troque por</Text>

                  <View className="gap-4">
                    <Text className="font-semibold text-success">Substituto sugerido</Text>
                    <Text className="font-semibold text-text-primary dark:text-text-primary-dark">
                      {par.habito_substituto.nome}
                    </Text>
                    <Text className="text-text-secondary dark:text-text-secondary-dark">
                      {par.habito_substituto.tipo}
                    </Text>
                    <Text className="text-text-secondary dark:text-text-secondary-dark">
                      Gatilho: {par.habito_substituto.gatilho}
                    </Text>
                    <Text className="text-text-secondary dark:text-text-secondary-dark">
                      Recompensa: {par.habito_substituto.recompensa}
                    </Text>
                    <Text className="font-semibold text-success">
                      Ajuda a alcançar: {par.habito_substituto.beneficio_vida}
                    </Text>
                  </View>

                  <View className="flex-row gap-16">
                    <Pressable onPress={() => moverPrioridade(index, 'cima')} disabled={index === 0}>
                      <Text
                        className={index === 0 ? 'text-text-secondary dark:text-text-secondary-dark' : 'text-primary'}
                      >
                        ▲
                      </Text>
                    </Pressable>
                    <Pressable onPress={() => moverPrioridade(index, 'baixo')} disabled={index === pares.length - 1}>
                      <Text
                        className={
                          index === pares.length - 1 ? 'text-text-secondary dark:text-text-secondary-dark' : 'text-primary'
                        }
                      >
                        ▼
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {perfil ? (
            <Card className="gap-12">
              <Pressable onPress={() => setResumoExpandido((atual) => !atual)}>
                <Text className="font-semibold text-primary">
                  {resumoExpandido ? 'Ocultar' : 'Ver'} resumo completo do meu perfil
                </Text>
              </Pressable>

              {resumoExpandido && (
                <View className="gap-16">
                  <View className="gap-4">
                    <Text className="font-semibold text-text-primary dark:text-text-primary-dark">Seu perfil</Text>
                    <Text className="text-text-secondary dark:text-text-secondary-dark">{perfil.resumo}</Text>
                  </View>

                  {perfil.pontos_fortes.length > 0 && (
                    <View className="gap-4">
                      <Text className="font-semibold text-text-primary dark:text-text-primary-dark">
                        Pontos fortes
                      </Text>
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
                </View>
              )}

              {perfilCalculadoEm && (
                <Text className="text-text-secondary dark:text-text-secondary-dark">
                  Calculado em {formatarData(perfilCalculadoEm)}
                </Text>
              )}

              <Button label="Recalcular perfil" variant="secondary" onPress={pedirRecalculo} loading={isCalculando} />
            </Card>
          ) : aguardandoPrimeiroCalculo ? (
            <Card className="flex-row items-center gap-12">
              <ActivityIndicator />
              <Text className="flex-1 text-text-secondary dark:text-text-secondary-dark">
                Calculando seu perfil...
              </Text>
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
