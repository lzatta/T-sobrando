import { Text, View } from 'react-native'
import { BotaoMenu } from '../../components/BotaoMenu'

export function DesafiosScreen() {
  return (
    <View className="flex-1 gap-16 bg-background px-24 pt-64 dark:bg-background-dark">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Desafios</Text>
        <BotaoMenu />
      </View>

      <Text className="text-text-secondary dark:text-text-secondary-dark">
        Em breve: seu desafio ativo e o histórico de desafios concluídos.
      </Text>
    </View>
  )
}
