import { Text, View } from 'react-native'

export default function AppHome() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-24 dark:bg-background-dark">
      <Text className="text-center text-text-primary dark:text-text-primary-dark">
        Login concluído. As próximas telas (onboarding, triagem, dashboard) ainda serão implementadas.
      </Text>
    </View>
  )
}
