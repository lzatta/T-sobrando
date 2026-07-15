import { Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { useSignOut } from '../auth/useSignOut'
import { useSession } from '../../stores/AuthContext'

export function ProfileScreen() {
  const { session } = useSession()
  const { submit, isSigningOut } = useSignOut()

  return (
    <View className="flex-1 gap-16 bg-background px-24 pt-64 dark:bg-background-dark">
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Perfil</Text>
      <Text className="text-text-secondary dark:text-text-secondary-dark">{session?.user.email}</Text>
      <Button label="Sair" variant="secondary" onPress={submit} loading={isSigningOut} />
    </View>
  )
}
