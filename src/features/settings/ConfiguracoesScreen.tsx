import { Text, View } from 'react-native'
import { Card } from '../../components/Card'
import { useSession } from '../../stores/AuthContext'

export function ConfiguracoesScreen() {
  const { session } = useSession()

  return (
    <View className="flex-1 gap-16 bg-background px-24 pt-24 dark:bg-background-dark">
      <Card>
        <Text className="text-text-secondary dark:text-text-secondary-dark">Conta</Text>
        <Text className="text-text-primary dark:text-text-primary-dark">{session?.user.email}</Text>
      </Card>
    </View>
  )
}
