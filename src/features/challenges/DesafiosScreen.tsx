import { Link } from 'expo-router'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { BotaoMenu } from '../../components/BotaoMenu'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { useDesafios } from './useDesafios'

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR')
}

export function DesafiosScreen() {
  const { desafioAtivo, historico, temParesDisponiveis, isLoading, isGerando, error, gerar, concluir, descartar } =
    useDesafios()

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
        <Card className="gap-12">
          <Text className="font-semibold text-text-primary dark:text-text-primary-dark">{desafioAtivo.titulo}</Text>
          <Text className="text-text-secondary dark:text-text-secondary-dark">{desafioAtivo.descricao}</Text>
          <View className="flex-row gap-12">
            <View className="flex-1">
              <Button label="Concluir" onPress={concluir} />
            </View>
            <View className="flex-1">
              <Button label="Descartar" variant="secondary" onPress={descartar} />
            </View>
          </View>
        </Card>
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

      {historico.length > 0 && (
        <View className="gap-12">
          <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
            Desafios concluídos
          </Text>
          {historico.map((desafio) => (
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
