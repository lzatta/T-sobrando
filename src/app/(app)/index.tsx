import { Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { useSignOut } from '../../features/auth/useSignOut'

export default function AppHome() {
  const { submit, isSigningOut } = useSignOut()

  return (
    <View className="flex-1 items-center justify-center gap-16 bg-background px-24 dark:bg-background-dark">
      <Text className="text-center text-text-primary dark:text-text-primary-dark">
        Login concluído. As próximas telas (onboarding, triagem, dashboard) ainda serão implementadas.
      </Text>
      <Button label="Sair" variant="secondary" onPress={submit} loading={isSigningOut} />
    </View>
  )
}
