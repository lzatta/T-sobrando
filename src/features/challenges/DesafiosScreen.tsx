import { Link } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { BotaoMenu } from '../../components/BotaoMenu'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { useDesafios } from './useDesafios'

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR')
}

function formatarPercentual(valor: number) {
  return `${Math.round(valor * 100)}%`
}

export function DesafiosScreen() {
  const {
    desafioAtivo,
    streakAtual,
    consistenciaHistorica,
    jaCheckedInHoje,
    mostrarConsolidacao,
    historicoConcluidos,
    historicoConsolidados,
    temParesDisponiveis,
    isLoading,
    isGerando,
    isRegistrandoCheckin,
    error,
    gerar,
    descartar,
    registrarCheckinAcao,
    confirmarConsolidacao,
  } = useDesafios()

  const [descricaoCheckin, setDescricaoCheckin] = useState('')

  async function fazerCheckin(tipo: 'cumprido' | 'falhou') {
    await registrarCheckinAcao(tipo, descricaoCheckin)
    setDescricaoCheckin('')
  }

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-16 px-24 pt-64 pb-32"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Desafios</Text>
        <BotaoMenu />
      </View>

      {error ? <Text className="text-error">{error}</Text> : null}

      {isLoading ? (
        <ActivityIndicator />
      ) : desafioAtivo ? (
        <>
          {mostrarConsolidacao && (
            <Card className="gap-12 border-primary">
              <Text className="font-semibold text-text-primary dark:text-text-primary-dark">
                Você sente que esse hábito já é automático pra você, ou ainda precisa de esforço consciente?
              </Text>
              <View className="flex-row gap-12">
                <View className="flex-1">
                  <Button label="Já é automático" onPress={() => confirmarConsolidacao(true)} />
                </View>
                <View className="flex-1">
                  <Button
                    label="Ainda preciso de esforço"
                    variant="secondary"
                    onPress={() => confirmarConsolidacao(false)}
                  />
                </View>
              </View>
            </Card>
          )}

          <Card className="gap-12">
            <Text className="font-semibold text-text-primary dark:text-text-primary-dark">
              {desafioAtivo.titulo}
            </Text>
            <Text className="text-text-secondary dark:text-text-secondary-dark">{desafioAtivo.descricao}</Text>

            <View className="flex-row gap-24">
              <View>
                <Text className="text-text-secondary dark:text-text-secondary-dark">Streak atual</Text>
                <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                  {streakAtual} {streakAtual === 1 ? 'dia' : 'dias'}
                </Text>
              </View>
              <View>
                <Text className="text-text-secondary dark:text-text-secondary-dark">Consistência</Text>
                <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                  {formatarPercentual(consistenciaHistorica)}
                </Text>
              </View>
            </View>

            {jaCheckedInHoje ? (
              <Text className="text-text-secondary dark:text-text-secondary-dark">
                Você já registrou o check-in de hoje — volte amanhã.
              </Text>
            ) : (
              <View className="gap-12">
                <Input
                  label="Descreva como foi (opcional)"
                  value={descricaoCheckin}
                  onChangeText={setDescricaoCheckin}
                  multiline
                />
                <View className="flex-row gap-12">
                  <View className="flex-1">
                    <Button label="Fiz hoje" onPress={() => fazerCheckin('cumprido')} loading={isRegistrandoCheckin} />
                  </View>
                  <View className="flex-1">
                    <Button
                      label="Não consegui hoje"
                      variant="secondary"
                      onPress={() => fazerCheckin('falhou')}
                      loading={isRegistrandoCheckin}
                    />
                  </View>
                </View>
              </View>
            )}

            <Button label="Descartar desafio" variant="secondary" onPress={descartar} />
          </Card>
        </>
      ) : temParesDisponiveis ? (
        <Card className="gap-12">
          <Text className="text-text-secondary dark:text-text-secondary-dark">
            Pronto pra colocar em prática o hábito de maior prioridade da sua lista?
          </Text>
          <Button label="Gerar desafio" onPress={gerar} loading={isGerando} />
        </Card>
      ) : (
        <Card className="gap-12">
          <Text className="text-text-secondary dark:text-text-secondary-dark">
            Calcule seu perfil em Hábitos primeiro pra gente sugerir seu primeiro desafio.
          </Text>
          <Link href="/(app)/(tabs)/habitos" className="text-primary">
            Ir para Hábitos
          </Link>
        </Card>
      )}

      {historicoConsolidados.length > 0 && (
        <View className="gap-12">
          <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
            Hábitos consolidados
          </Text>
          {historicoConsolidados.map((desafio) => (
            <Card key={desafio.id} className="gap-4 border-success">
              <Text className="font-semibold text-success">{desafio.titulo}</Text>
              <Text className="text-text-secondary dark:text-text-secondary-dark">Já é automático pra você</Text>
            </Card>
          ))}
        </View>
      )}

      {historicoConcluidos.length > 0 && (
        <View className="gap-12">
          <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
            Desafios concluídos
          </Text>
          {historicoConcluidos.map((desafio) => (
            <Card key={desafio.id} className="gap-4">
              <Text className="font-semibold text-text-primary dark:text-text-primary-dark">{desafio.titulo}</Text>
              {desafio.concluido_em && (
                <Text className="text-text-secondary dark:text-text-secondary-dark">
                  Concluído em {formatarData(desafio.concluido_em)}
                </Text>
              )}
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
